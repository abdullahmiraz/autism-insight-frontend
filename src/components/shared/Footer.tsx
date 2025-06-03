import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4  ">
      Autism Insight &copy; 2025
      <div className="opcitiy-50 text-slate-700 my-2 flex flex-col items-center justify-center">
        Developed by{" "}
        <Link href="/">Humayra tabassum, Myful kobir tori, Mehnaj dinu</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/users">Users</Link>
      </div>
    </footer>
  );
}
