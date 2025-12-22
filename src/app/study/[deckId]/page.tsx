'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDeck, updateCardState } from '@/app/actions';
import Flashcard from '@/components/Flashcard';
import { calculateNextReview, Rating } from '@/lib/srs';
import { Card, Deck } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function StudyPage({ params }: { params: Promise<{ deckId: string }> }) {
    const { deckId } = use(params);
    const router = useRouter();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // State for Batch/Round Mode
    const [round, setRound] = useState(1);
    const [queue, setQueue] = useState<Card[]>([]);
    const [nextRoundCards, setNextRoundCards] = useState<{ card: Card, rating: Rating }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        getDeck(deckId).then(d => {
            setDeck(d);
            setIsLoaded(true);
            if (d) {
                setQueue([...d.cards]);
            }
        });
    }, [deckId]);

    const handleRate = async (rating: Rating) => {
        const currentCard = queue[currentIndex];
        const newLearningState = calculateNextReview(currentCard.learningState, rating);

        // 1. Update Storage (Long term progress) - Fire and forget (Optimistic UI)
        updateCardState(deckId, currentCard.id, newLearningState).catch(err => {
            console.error("Failed to update card state in background:", err);
        });

        // 2. Add to next round queue with updated state
        const updatedCard = { ...currentCard, learningState: newLearningState };
        const newNextRoundCards = [...nextRoundCards, { card: updatedCard, rating }];
        setNextRoundCards(newNextRoundCards);

        // 3. Advance or Start Next Round
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of Round -> Transition
            startNextRound(newNextRoundCards);
        }
    };

    const startNextRound = (completedCards: { card: Card, rating: Rating }[]) => {
        // Sort: Again (0) -> Good (1) -> Easy (2)
        const priority: Record<Rating, number> = { 'Again': 0, 'Good': 1, 'Easy': 2 };

        // Sort stable
        completedCards.sort((a, b) => priority[a.rating] - priority[b.rating]);

        const nextQueue = completedCards.map(item => item.card);

        setQueue(nextQueue);
        setNextRoundCards([]);
        setCurrentIndex(0);
        setRound(r => r + 1);
    };

    if (!isLoaded) return <div className="p-8 text-center dark:text-white">Loading...</div>;
    if (!deck) return <div className="p-8 text-center dark:text-white">Deck not found</div>;

    if (queue.length === 0) return <div className="p-8 text-center dark:text-white">Loading cards...</div>;

    const currentCard = queue[currentIndex];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
            <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center transition-colors duration-200">
                <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium">
                    ← Quay lại
                </Link>
                <div className="text-center">
                    <h1 className="font-bold text-gray-800 dark:text-white">{deck.title}</h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Lượt {round} • Câu {deck.cards.findIndex(c => c.id === currentCard.id) + 1}/{deck.cards.length}
                    </span>
                </div>
                <div className="w-16 flex justify-end">
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <Flashcard
                    key={currentCard.id} // Force remount on card change
                    card={currentCard}
                    onRate={handleRate}
                />
            </main>
        </div>
    );
}
