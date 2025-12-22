'use client';

import Link from 'next/link';
import { Deck } from '@/types';
import { resetDeck } from '@/app/actions';

export default function DeckCard({ deck }: { deck: Deck }) {
    const dueCards = deck.cards.filter(c => c.learningState.nextReviewDate <= Date.now()).length;
    const newCards = deck.cards.filter(c => c.learningState.status === 'New').length;
    const totalCards = deck.cards.length;

    // Calculate studied today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const studiedToday = deck.cards.filter(c => c.learningState.lastReviewDate && c.learningState.lastReviewDate >= startOfDay.getTime()).length;

    const handleReset = async () => {
        if (confirm('Bạn có chắc muốn đặt lại tiến độ học của đề này?')) {
            await resetDeck(deck.id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{deck.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{deck.timeLimit ? `${deck.timeLimit} phút` : ''}</p>
                </div>
                <div className="text-right">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded block mb-1">
                        {deck.cards.length} câu
                    </span>
                    {studiedToday > 0 && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Hôm nay: {studiedToday}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex space-x-4 mb-6 text-sm">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-red-500 dark:text-red-400">{dueCards}</span>
                    <span className="text-gray-500 dark:text-gray-400">Cần ôn</span>
                </div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-blue-500 dark:text-blue-400">{newCards}</span>
                    <span className="text-gray-500 dark:text-gray-400">Mới</span>
                </div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-green-500">
                        {totalCards - dueCards - newCards}
                    </span>
                    <span className="text-gray-500">Đã thuộc</span>
                </div>
            </div>

            <div className="flex space-x-3 mt-auto">
                <Link
                    href={`/study/${deck.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Học ngay
                </Link>
                <Link
                    href={`/deck/${deck.id}`}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors font-medium"
                >
                    Chi tiết
                </Link>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
