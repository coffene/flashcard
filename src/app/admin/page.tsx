'use client';

import { useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import Link from 'next/link';
import { Deck } from '@/types';

export default function AdminPage() {
    const { decks, isLoaded, addDeck, deleteDeck } = useStorage();
    const [newDeckTitle, setNewDeckTitle] = useState('');
    const [newDeckSubject, setNewDeckSubject] = useState('');
    const [jsonInput, setJsonInput] = useState('');

    if (!isLoaded) return <div className="p-8">Loading...</div>;

    const handleCreateDeck = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeckTitle || !newDeckSubject) return;

        const newDeck: Deck = {
            id: `deck_${Date.now()}`,
            title: newDeckTitle,
            subject: newDeckSubject,
            cards: [],
            isReadOnly: false,
            year: new Date().getFullYear()
        };

        addDeck(newDeck);
        setNewDeckTitle('');
        setNewDeckSubject('');
    };

    const handleImportJson = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsed = JSON.parse(jsonInput);
            // Basic validation
            if (!parsed.title || !Array.isArray(parsed.cards)) {
                alert('JSON không hợp lệ. Cần có "title" và mảng "cards".');
                return;
            }

            const newDeck: Deck = {
                ...parsed,
                id: parsed.id || `deck_${Date.now()}`,
                subject: parsed.subject || 'Tổng hợp',
                isReadOnly: false,
                year: parsed.year || new Date().getFullYear(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cards: parsed.cards.map((c: any) => ({
                    ...c,
                    learningState: {
                        status: 'New',
                        nextReviewDate: Date.now(),
                        interval: 0,
                        easeFactor: 2.5,
                        repetitions: 0,
                    }
                }))
            };

            addDeck(newDeck);
            setJsonInput('');
            alert('Nhập thành công!');
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
                                            href={`/admin/deck/${deck.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Xóa bộ đề này?')) deleteDeck(deck.id);
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
