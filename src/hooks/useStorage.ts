'use client';

import { useState, useEffect } from 'react';
import { Deck, Card, LearningState } from '@/types';
import { SAMPLE_DECK } from '@/data/sample';

const STORAGE_KEY = 'flashcard_app_data_v1';

export function useStorage() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setDecks(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse storage', e);
                setDecks([SAMPLE_DECK]);
            }
        } else {
            // Seed with sample data
            setDecks([SAMPLE_DECK]);
            localStorage.setItem(STORAGE_KEY, JSON.stringify([SAMPLE_DECK]));
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever decks change
    const saveDecks = (newDecks: Deck[]) => {
        setDecks(newDecks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDecks));
    };

    const updateCardState = (deckId: string, cardId: string, newState: LearningState) => {
        const newDecks = decks.map((deck) => {
            if (deck.id !== deckId) return deck;
            return {
                ...deck,
                cards: deck.cards.map((card) => {
                    if (card.id !== cardId) return card;
                    return { ...card, learningState: newState };
                }),
            };
        });
        saveDecks(newDecks);
    };

    const resetDeck = (deckId: string) => {
        const newDecks = decks.map((deck) => {
            if (deck.id !== deckId) return deck;
            return {
                ...deck,
                cards: deck.cards.map((card) => ({
                    ...card,
                    learningState: SAMPLE_DECK.cards.find(c => c.id === card.id)?.learningState || {
                        status: 'New',
                        nextReviewDate: Date.now(),
                        interval: 0,
                        easeFactor: 2.5,
                        repetitions: 0,
                    }
                })),
            };
        });
        saveDecks(newDecks);
    }

    const addDeck = (deck: Deck) => {
        saveDecks([...decks, deck]);
    };

    const deleteDeck = (deckId: string) => {
        saveDecks(decks.filter(d => d.id !== deckId));
    };

    const addCard = (deckId: string, card: Card) => {
        const newDecks = decks.map(d => {
            if (d.id !== deckId) return d;
            return { ...d, cards: [...d.cards, card] };
        });
        saveDecks(newDecks);
    };

    const deleteCard = (deckId: string, cardId: string) => {
        const newDecks = decks.map(d => {
            if (d.id !== deckId) return d;
            return { ...d, cards: d.cards.filter(c => c.id !== cardId) };
        });
        saveDecks(newDecks);
    };

    return {
        decks,
        isLoaded,
        updateCardState,
        resetDeck,
        addDeck,
        deleteDeck,
        addCard,
        deleteCard
    };
}
