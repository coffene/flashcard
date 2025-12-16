'use server';

import { prisma } from '@/lib/prisma';
import { Deck, Card, LearningState } from '@/types';
import { revalidatePath } from 'next/cache';

// Helper to cast Prisma result to our Type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPrismaDeckToDeck(pDeck: any): Deck {
    return {
        ...pDeck,
        cards: pDeck.cards.map((c: any) => ({
            ...c,
            options: c.options as any, // Cast JSON to Option[]
            learningState: {
                status: c.status,
                nextReviewDate: c.nextReviewDate.getTime(),
                interval: c.interval,
                easeFactor: c.easeFactor,
                repetitions: c.repetitions,
                lastReviewDate: c.lastReviewDate ? c.lastReviewDate.getTime() : undefined,
            }
        }))
    };
}

export async function getDecks(): Promise<Deck[]> {
    try {
        const decks = await prisma.deck.findMany({
            include: { cards: true },
            orderBy: { createdAt: 'desc' }
        });
        return decks.map(mapPrismaDeckToDeck);
    } catch (error) {
        console.error('Failed to get decks:', error);
        return [];
    }
}

export async function createDeck(title: string, subject: string): Promise<Deck | null> {
    try {
        const newDeck = await prisma.deck.create({
            data: {
                title,
                subject,
                year: new Date().getFullYear(),
            },
            include: { cards: true }
        });
        revalidatePath('/');
        return mapPrismaDeckToDeck(newDeck);
    } catch (error) {
        console.error('Failed to create deck:', error);
        return null;
    }
}

export async function importDeck(deckData: Deck) {
    try {
        // Create deck first
        const createdDeck = await prisma.deck.create({
            data: {
                title: deckData.title,
                subject: deckData.subject,
                year: deckData.year || new Date().getFullYear(),
                timeLimit: deckData.timeLimit,
                isReadOnly: deckData.isReadOnly,
            }
        });

        // Create cards
        for (const card of deckData.cards) {
            await prisma.card.create({
                data: {
                    deckId: createdDeck.id,
                    stem: card.stem,
                    imageUrl: card.imageUrl,
                    explanation: card.explanation,
                    options: card.options as any, // Save as JSON
                    correctOptionId: card.correctOptionId,
                    // SRS State
                    status: card.learningState.status,
                    nextReviewDate: new Date(card.learningState.nextReviewDate),
                    interval: card.learningState.interval,
                    easeFactor: card.learningState.easeFactor,
                    repetitions: card.learningState.repetitions,
                    lastReviewDate: card.learningState.lastReviewDate ? new Date(card.learningState.lastReviewDate) : null,
                }
            });
        }

        revalidatePath('/');
        return true;
    } catch (error) {
        console.error("Import failed:", error);
        return false;
    }
}

export async function resetDeck(deckId: string) {
    try {
        await prisma.card.updateMany({
            where: { deckId },
            data: {
                status: 'New',
                nextReviewDate: new Date(),
                interval: 0,
                easeFactor: 2.5,
                repetitions: 0,
                lastReviewDate: null
            }
        });
        revalidatePath('/');
        return true;
    } catch (error) {
        console.error("Reset failed:", error);
        return false;
    }
}
