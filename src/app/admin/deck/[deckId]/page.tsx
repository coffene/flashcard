'use client';

import { use, useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import Link from 'next/link';
import { Card } from '@/types';
import { INITIAL_LEARNING_STATE } from '@/lib/srs';

export default function AdminDeckDetail({ params }: { params: Promise<{ deckId: string }> }) {
    const { deckId } = use(params);
    const { decks, isLoaded, addCard, deleteCard } = useStorage();

    // Form state
    const [stem, setStem] = useState('');
    const [optA, setOptA] = useState('');
    const [optB, setOptB] = useState('');
    const [optC, setOptC] = useState('');
    const [optD, setOptD] = useState('');
    const [correctIdx, setCorrectIdx] = useState(0);
    const [explanation, setExplanation] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    if (!isLoaded) return <div className="p-8">Loading...</div>;

    const deck = decks.find(d => d.id === deckId);
    if (!deck) return <div className="p-8">Deck not found</div>;

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        const id = `q_${Date.now()}`;
        const newCard: Card = {
            id,
            stem,
            imageUrl: imageUrl || undefined,
            options: [
                { id: `${id}_0`, text: optA },
                { id: `${id}_1`, text: optB },
                { id: `${id}_2`, text: optC },
                { id: `${id}_3`, text: optD },
            ],
            correctOptionId: `${id}_${correctIdx}`,
            explanation,
            learningState: { ...INITIAL_LEARNING_STATE }
        };

        addCard(deckId, newCard);

        // Reset form
        setStem('');
        setOptA(''); setOptB(''); setOptC(''); setOptD('');
        setExplanation('');
        setImageUrl('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sửa bộ đề: {deck.title}</h1>
                        <p className="text-gray-500">ID: {deck.id}</p>
                    </div>
                    <Link href="/admin" className="text-blue-600 hover:underline">← Quay lại</Link>
                </div>

                {/* Add Card Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-lg font-bold mb-4">Thêm câu hỏi mới</h2>
                    <form onSubmit={handleAddCard} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={2}
                                value={stem}
                                onChange={e => setStem(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh (Tùy chọn)</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[optA, optB, optC, optD].map((opt, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Đáp án {['A', 'B', 'C', 'D'][idx]}
                                        <input
                                            type="radio"
                                            name="correct"
                                            className="ml-2"
                                            checked={correctIdx === idx}
                                            onChange={() => setCorrectIdx(idx)}
                                        /> Đúng
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={[optA, optB, optC, optD][idx]}
                                        onChange={e => {
                                            if (idx === 0) setOptA(e.target.value);
                                            if (idx === 1) setOptB(e.target.value);
                                            if (idx === 2) setOptC(e.target.value);
                                            if (idx === 3) setOptD(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giải thích</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={2}
                                value={explanation}
                                onChange={e => setExplanation(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
                            Thêm câu hỏi
                        </button>
                    </form>
                </div>

                {/* List Cards */}
                <div className="space-y-4">
                    {deck.cards.map((card, idx) => (
                        <div key={card.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start">
                            <div>
                                <div className="font-bold text-gray-900 mb-1">Câu {idx + 1}: {card.stem}</div>
                                <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-4">
                                    {card.options.map((opt, i) => (
                                        <span key={opt.id} className={card.correctOptionId === opt.id ? "text-green-600 font-bold" : ""}>
                                            {['A', 'B', 'C', 'D'][i]}. {opt.text}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Xóa câu hỏi này?')) deleteCard(deck.id, card.id);
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Xóa
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
