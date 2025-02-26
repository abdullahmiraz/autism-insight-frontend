import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4  ">
      Autism Insight &copy; 2025
      <div className="opcitiy-50 text-slate-700 my-2">
        Developed by{" "}
        <Link href="https://www.linkedin.com/in/abdullahmiraz/">
          Abdullah Miraz
        </Link>
      </div>
    </footer>
  );
}
