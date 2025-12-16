'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import Flashcard from '@/components/Flashcard';
import { calculateNextReview, Rating } from '@/lib/srs';
import { Card } from '@/types';

export default function StudyPage({ params }: { params: Promise<{ deckId: string }> }) {
    const { deckId } = use(params);
    const router = useRouter();
    const { decks, isLoaded, updateCardState } = useStorage();

    // State for Batch/Round Mode
    const [round, setRound] = useState(1);
    const [queue, setQueue] = useState<Card[]>([]);
    const [nextRoundCards, setNextRoundCards] = useState<{ card: Card, rating: Rating }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isLoaded) return;
        if (queue.length > 0) return; // Don't reset if already loaded

        const deck = decks.find((d) => d.id === deckId);
        if (!deck) return;

        // Initial Load: All cards
        setQueue([...deck.cards]);
    }, [isLoaded, decks, deckId]);

    const handleRate = (rating: Rating) => {
        const currentCard = queue[currentIndex];
        const newLearningState = calculateNextReview(currentCard.learningState, rating);

        // 1. Update Storage (Long term progress)
        updateCardState(deckId, currentCard.id, newLearningState);

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

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;

    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return <div className="p-8 text-center">Deck not found</div>;

    if (queue.length === 0) return <div className="p-8 text-center">Loading cards...</div>;

    const currentCard = queue[currentIndex];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <Link href="/" className="text-gray-500 hover:text-gray-800 font-medium">
                    ← Quay lại
                </Link>
                <div className="text-center">
                    <h1 className="font-bold text-gray-800">{deck.title}</h1>
                    <span className="text-xs text-gray-500">
                        Lượt {round} • Câu {deck.cards.findIndex(c => c.id === currentCard.id) + 1}/{deck.cards.length}
                    </span>
                </div>
                <div className="w-16"></div> {/* Spacer */}
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
