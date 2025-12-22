'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { Rating } from '@/lib/srs';

interface FlashcardProps {
    card: Card;
    onRate: (rating: Rating) => void;
}

export default function Flashcard({ card, onRate }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Reset state when card changes
    if (card.id !== card.id) {
        // This check is tricky in React without useEffect, but key prop in parent handles it usually.
        // We'll rely on the parent to force remount by changing the key.
    }

    const handleOptionClick = (optionId: string) => {
        if (isFlipped) return; // Prevent changing answer after reveal
        setSelectedOption(optionId);
    };

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const getOptionStyle = (optionId: string) => {
        const baseStyle = "p-3 border rounded-lg cursor-pointer transition-colors dark:text-gray-200";
        if (!isFlipped) {
            return selectedOption === optionId
                ? `${baseStyle} bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400`
                : `${baseStyle} hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600`;
        }

        // Revealed state
        if (optionId === card.correctOptionId) {
            return `${baseStyle} bg-green-100 border-green-500 font-bold dark:bg-green-900 dark:border-green-400 dark:text-green-100`;
        }
        if (selectedOption === optionId && optionId !== card.correctOptionId) {
            return `${baseStyle} bg-red-100 border-red-500 dark:bg-red-900 dark:border-red-400 dark:text-red-100`;
        }
        return `${baseStyle} opacity-50 dark:border-gray-600`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 min-h-[400px] flex flex-col">
            {/* Card Content */}
            <div className="flex-grow p-8">
                <div className="mb-6">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded mb-2">
                        Câu hỏi
                    </span>
                    <div className={`text-gray-800 dark:text-gray-100 leading-relaxed ${card.stem.includes('\n') ? 'whitespace-pre-wrap font-mono text-sm' : 'text-xl font-medium'}`}>
                        {card.stem}
                    </div>
                    {card.imageUrl && (
                        <div className="mt-4 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={card.imageUrl}
                                alt="Question illustration"
                                className="max-h-64 rounded-lg border border-gray-200 dark:border-gray-600 object-contain bg-white"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {card.options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={getOptionStyle(option.id)}
                        >
                            <span className="font-semibold mr-2">
                                {['A', 'B', 'C', 'D'][card.options.indexOf(option)]}.
                            </span>
                            {option.text}
                        </div>
                    ))}
                </div>

                {isFlipped && card.explanation && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 text-sm text-gray-700 dark:text-gray-300">
                        <strong>Giải thích:</strong> {card.explanation}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
                {!isFlipped ? (
                    <button
                        onClick={handleFlip}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-md"
                    >
                        Xem Đáp Án
                    </button>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => onRate('Again')}
                            className="py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 text-red-700 dark:text-red-300 font-bold rounded-lg border border-red-300 dark:border-red-700"
                        >
                            Quên (1m)
                        </button>
                        <button
                            onClick={() => onRate('Good')}
                            className="py-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold rounded-lg border border-blue-300 dark:border-blue-700"
                        >
                            Nhớ (1d)
                        </button>
                        <button
                            onClick={() => onRate('Easy')}
                            className="py-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900 text-green-700 dark:text-green-300 font-bold rounded-lg border border-green-300 dark:border-green-700"
                        >
                            Dễ (4d)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
