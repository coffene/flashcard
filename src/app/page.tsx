import Link from 'next/link';
import { getDecks } from '@/app/actions';
import DeckCard from '@/components/DeckCard';

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function Home() {
  const decks = await getDecks();

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
          {/* <div className="mt-4">
            <Link href="/admin" className="text-blue-600 hover:underline">Quản trị hệ thống</Link>
          </div> */}
        </header>

        {subjects.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Chưa có bộ đề nào.
          </div>
        ) : (
          subjects.map(subject => (
            <div key={subject} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200 flex items-center">
                <span className="bg-blue-600 w-2 h-8 mr-3 rounded-sm"></span>
                {subject}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {decksBySubject[subject].map((deck) => (
                  <DeckCard key={deck.id} deck={deck} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
