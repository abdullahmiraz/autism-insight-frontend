import { User } from "lucide-react";
// import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#282828] text-white p-4">
      <div className="container mx-auto flex justify-between items-center h-full">
        <h1 className="text-xl font-bold">Autism Insight</h1>
        {/* <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/detect">Detect</Link>
          <Link href="/progress">Progress</Link>
          <Link href="/milestones">Milestones</Link>
          <Link href="/therapy">Therapy</Link>
          <Link href="/feedback">Feedback</Link>
        </div> */}
        <User size={32} className="p-1 rounded-full border" />
      </div>
    </nav>
  );
}
