'use client';

import Link from 'next/link';
import { useStorage } from '@/hooks/useStorage';

export default function Home() {
  const { decks, isLoaded, resetDeck } = useStorage();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Group decks by subject
  const decksBySubject = decks.reduce((acc, deck) => {
    const subject = deck.subject || 'Khác';
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(deck);
    return acc;
  }, {} as Record<string, typeof decks>);

  const subjects = Object.keys(decksBySubject).sort();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Flashcard Ôn Thi</h1>
          <p className="text-gray-600">Hệ thống ôn tập trắc nghiệm thông minh (SRS)</p>
        </header>

        {subjects.map(subject => (
          <div key={subject} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200 flex items-center">
              <span className="bg-blue-600 w-2 h-8 mr-3 rounded-sm"></span>
              {subject}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {decksBySubject[subject].map((deck) => {
                const dueCards = deck.cards.filter(c => c.learningState.nextReviewDate <= Date.now()).length;
                const newCards = deck.cards.filter(c => c.learningState.status === 'New').length;
                const totalCards = deck.cards.length;

                // Calculate studied today
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const studiedToday = deck.cards.filter(c => c.learningState.lastReviewDate && c.learningState.lastReviewDate >= startOfDay.getTime()).length;

                return (
                  <div key={deck.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{deck.title}</h2>
                        <p className="text-sm text-gray-500">{deck.timeLimit ? `${deck.timeLimit} phút` : ''}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded block mb-1">
                          {deck.cards.length} câu
                        </span>
                        {studiedToday > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            Hôm nay: {studiedToday}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-4 mb-6 text-sm">
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-red-500">{dueCards}</span>
                        <span className="text-gray-500">Cần ôn</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-blue-500">{newCards}</span>
                        <span className="text-gray-500">Mới</span>
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
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn đặt lại tiến độ học của đề này?')) {
                            resetDeck(deck.id);
                          }
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
