'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useStorage } from '@/hooks/useStorage';
import { Deck, LearningStatus } from '@/types';

export default function DeckDetails({ params }: { params: Promise<{ deckId: string }> }) {
    const { deckId } = use(params);
    const { decks, isLoaded } = useStorage();
    const [deck, setDeck] = useState<Deck | null>(null);

    useEffect(() => {
        if (isLoaded) {
            const found = decks.find((d) => d.id === deckId);
            setDeck(found || null);
        }
    }, [isLoaded, decks, deckId]);

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
    if (!deck) return <div className="p-8 text-center">Deck not found</div>;

    const stats = {
        new: deck.cards.filter(c => c.learningState.status === 'New').length,
        learning: deck.cards.filter(c => c.learningState.status === 'Learning' || c.learningState.status === 'Relearning').length,
        review: deck.cards.filter(c => c.learningState.status === 'Review').length,
        total: deck.cards.length
    };

    const getStatusColor = (status: LearningStatus) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Learning':
            case 'Relearning': return 'bg-yellow-100 text-yellow-800';
            case 'Review': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (timestamp: number) => {
        if (timestamp === 0) return 'Chưa học';
        return new Date(timestamp).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-gray-500 hover:text-gray-800 mb-4 inline-block">← Quay lại</Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{deck.title}</h1>
                            <p className="text-gray-500">{deck.subject} • {deck.cards.length} câu hỏi</p>
                        </div>
                        <Link
                            href={`/study/${deck.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Học ngay
                        </Link>
                    </div>

                    {/* Dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                            <div className="text-sm text-blue-800">Mới (New)</div>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
                            <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
                            <div className="text-sm text-yellow-800">Đang học</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.review}</div>
                            <div className="text-sm text-green-800">Đã thuộc</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                            <div className="text-sm text-gray-800">Tổng số</div>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                        Danh sách câu hỏi
                    </div>
                    <div className="divide-y divide-gray-100">
                        {deck.cards.map((card, idx) => (
                            <div key={card.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-400">#{idx + 1}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(card.learningState.status)}`}>
                                            {card.learningState.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-800 truncate">{card.stem}</p>
                                </div>
                                <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                                    <div className="text-xs text-gray-400">Ôn tập tiếp theo</div>
                                    <div>{card.learningState.status === 'New' ? '-' : formatDate(card.learningState.nextReviewDate)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
