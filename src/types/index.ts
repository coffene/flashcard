export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface Option {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    stem: string; // The question text
    imageUrl?: string; // URL to image (optional)
    level?: Difficulty;
}

export type LearningStatus = 'New' | 'Learning' | 'Review' | 'Relearning';

export interface LearningState {
    status: LearningStatus;
    nextReviewDate: number; // Timestamp
    interval: number; // Days
    easeFactor: number; // SM-2 multiplier (default 2.5)
    repetitions: number; // Consecutive correct answers
    lastReviewDate?: number; // Timestamp of last review
}

export interface Card extends Question {
    options: Option[];
    correctOptionId: string;
    learningState: LearningState;
    explanation?: string;
}

export interface Deck {
    id: string;
    title: string;
    subject: string;
    description?: string;
    timeLimit?: number; // Minutes
    cards: Card[];
    isReadOnly?: boolean; // If true, regular users cannot edit
    year: number;
}
