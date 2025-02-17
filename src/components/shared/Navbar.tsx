"use client";

import { User, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../lib/useAuth";
import Link from "next/link";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-[#282828] text-white p-4">
      <div className="container mx-auto flex justify-between items-center h-full">
        <span className="text-xl font-bold">
          <Link href={"/"}>Autism Insight</Link>
        </span>

        <div className="flex items-center space-x-4">
          {!loading && user ? (
            <>
              {}
              <div className="flex items-center space-x-2">
                <Link href="/user">
                  <User size={32} className="p-1 rounded-full border" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-300 hover:text-white flex items-center bg-primary p-2 rounded-md gap-2"
                >
                  <span>Logout</span>
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <div>
              <button className="text-sm text-gray-300 hover:text-white">
                <Link href={"/login"}>Login /Signup</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
