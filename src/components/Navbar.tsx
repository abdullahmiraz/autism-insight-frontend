import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Autism Insight</h1>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/detect">Detect</Link>
          <Link href="/progress">Progress</Link>
          <Link href="/milestones">Milestones</Link>
          <Link href="/therapy">Therapy</Link>
          <Link href="/feedback">Feedback</Link>
        </div>
      </div>
    </nav>
  );
}
