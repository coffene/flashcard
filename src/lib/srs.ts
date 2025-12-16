import { LearningState } from '@/types';

export type Rating = 'Again' | 'Good' | 'Easy';

export const INITIAL_LEARNING_STATE: LearningState = {
    status: 'New',
    nextReviewDate: Date.now(),
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
};

export function calculateNextReview(
    currentState: LearningState,
    rating: Rating
): LearningState {
    let { interval, easeFactor, repetitions } = currentState;
    const now = Date.now();

    if (rating === 'Again') {
        // Reset progress
        repetitions = 0;
        interval = 0; // Review immediately (or in 1 min, but for simplicity 0 means "now")
        // Ease factor remains same or slightly decreases? SM-2 says EF doesn't change on failure usually, or drops.
        // Let's keep it simple: Reset interval.
        return {
            status: 'Relearning',
            nextReviewDate: now + 60 * 1000, // 1 minute later
            interval: 0,
            easeFactor: Math.max(1.3, easeFactor - 0.2),
            repetitions: 0,
            lastReviewDate: now,
        };
    }

    // Rating is Good or Easy
    if (rating === 'Easy') {
        interval = interval === 0 ? 4 : interval * easeFactor * 1.3; // Bonus for easy
    } else {
        // Good
        // SM-2 formula for EF: EF' = EF + (0.1 - (5-q)*(0.08+(5-q)*0.02))
        // Simplified:
        interval = interval === 0 ? 1 : interval * easeFactor;
    }

    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor); // Minimum EF is 1.3

    // Calculate next date
    // Interval is in days.
    const nextReviewDate = now + interval * 24 * 60 * 60 * 1000;

    return {
        status: 'Review',
        nextReviewDate,
        interval,
        easeFactor,
        repetitions,
        lastReviewDate: now,
    };
}

export function formatInterval(intervalInDays: number): string {
    if (intervalInDays === 0) return '< 10m';
    if (intervalInDays < 1) {
        const hours = Math.round(intervalInDays * 24);
        return `${hours}h`;
    }
    if (intervalInDays >= 365) {
        const years = (intervalInDays / 365).toFixed(1);
        return `${years}y`;
    }
    if (intervalInDays >= 30) {
        const months = (intervalInDays / 30).toFixed(1);
        return `${months}mo`;
    }
    return `${Math.round(intervalInDays)}d`;
}
