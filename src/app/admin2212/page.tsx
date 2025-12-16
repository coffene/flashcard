'use client';

import { useState, useEffect } from 'react';
import { createDeck, importDeck, getDecks, deleteDeck } from '@/app/actions';
import Link from 'next/link';
import { Deck } from '@/types';
import { INITIAL_LEARNING_STATE } from '@/lib/srs';

export default function AdminPage() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [newDeckTitle, setNewDeckTitle] = useState('');
    const [newDeckSubject, setNewDeckSubject] = useState('');
    const [jsonInput, setJsonInput] = useState('');

    useEffect(() => {
        getDecks().then(data => {
            setDecks(data);
            setIsLoaded(true);
        });
    }, []);

    if (!isLoaded) return <div className="p-8">Loading...</div>;

    const handleCreateDeck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeckTitle || !newDeckSubject) return;

        const newDeck = await createDeck(newDeckTitle, newDeckSubject);
        if (newDeck) {
            setDecks([newDeck, ...decks]);
            setNewDeckTitle('');
            setNewDeckSubject('');
        }
    };

    const handleImportJson = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsed = JSON.parse(jsonInput);
            // Basic validation
            if (!parsed.title || !Array.isArray(parsed.cards)) {
                alert('JSON không hợp lệ. Cần có "title" và mảng "cards".');
                return;
            }

            const deckToImport: Deck = {
                ...parsed,
                id: parsed.id || `deck_${Date.now()}`,
                subject: parsed.subject || 'Tổng hợp',
                isReadOnly: false,
                year: parsed.year || new Date().getFullYear(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cards: parsed.cards.map((c: any, cIdx: number) => {
                    // Normalize options if they are strings
                    let options = c.options;
                    if (Array.isArray(c.options) && typeof c.options[0] === 'string') {
                        options = c.options.map((opt: string, oIdx: number) => ({
                            id: `opt_${Date.now()}_${cIdx}_${oIdx}`,
                            text: opt
                        }));
                    }

                    // Normalize correctOptionId if it's an index
                    let correctOptionId = c.correctOptionId;
                    if (typeof c.correctOptionId === 'number' && options[c.correctOptionId]) {
                        correctOptionId = options[c.correctOptionId].id;
                    }

                    return {
                        ...c,
                        options,
                        correctOptionId,
                        learningState: { ...INITIAL_LEARNING_STATE }
                    };
                })
            };

            const result = await importDeck(deckToImport);
            if (result.success) {
                const updatedDecks = await getDecks();
                setDecks(updatedDecks);
                setJsonInput('');
                alert('Nhập thành công!');
            } else {
                alert('Lỗi khi lưu vào database: ' + result.error);
            }
        } catch (err) {
            alert('Lỗi parse JSON: ' + err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
                    <Link href="/" className="text-blue-600 hover:underline">← Về trang chủ</Link>
                </div>

                {/* Create Deck */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-xl font-bold mb-4">Tạo bộ đề mới</h2>
                    <form onSubmit={handleCreateDeck} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Tên bộ đề (VD: Lịch sử 12)"
                            className="flex-1 p-2 border rounded"
                            value={newDeckTitle}
                            onChange={e => setNewDeckTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Môn học"
                            className="w-48 p-2 border rounded"
                            value={newDeckSubject}
                            onChange={e => setNewDeckSubject(e.target.value)}
                        />
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                            Tạo
                        </button>
                    </form>
                </div>

                {/* Import JSON */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-xl font-bold mb-4">Nhập bộ đề từ JSON</h2>
                    <form onSubmit={handleImportJson} className="space-y-4">
                        <textarea
                            className="w-full p-2 border rounded font-mono text-sm"
                            rows={4}
                            placeholder='{"title": "Đề mẫu", "subject": "Toán", "cards": [{"id": "c1", "stem": "1+1=?", "options": [{"id":"o1","text":"2"}], "correctAnswerId": "o1"}]}'
                            value={jsonInput}
                            onChange={e => setJsonInput(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Nhập JSON
                        </button>
                    </form>
                </div>

                {/* List Decks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700">Tên bộ đề</th>
                                <th className="p-4 font-semibold text-gray-700">Môn</th>
                                <th className="p-4 font-semibold text-gray-700">Số câu</th>
                                <th className="p-4 font-semibold text-gray-700">Loại</th>
                                <th className="p-4 font-semibold text-gray-700 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {decks.map(deck => (
                                <tr key={deck.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{deck.title}</td>
                                    <td className="p-4 text-gray-600">{deck.subject}</td>
                                    <td className="p-4 text-gray-600">{deck.cards.length}</td>
                                    <td className="p-4">
                                        {deck.isReadOnly ? (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Hệ thống</span>
                                        ) : (
                                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">Người dùng</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link
                                            href={`/admin2212/deck/${deck.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Xóa bộ đề này?')) {
                                                    await deleteDeck(deck.id);
                                                    setDecks(decks.filter(d => d.id !== deck.id));
                                                }
                                            }}
                                            className="text-red-600 hover:underline ml-4"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
