"use client";

import Link from "next/link";
import { useAuth } from "../../lib/useAuth";
import { Button } from "../ui/button";
import Image from "next/image";

export default function UserDetails() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container p-4 bg-yellow-100 text-yellow-800 border border-yellow-500  flex  items-center gap-8">
        <p>Please log in to see your details.</p>
        <Link href={"/login"}>
          <Button>Login /Signup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0 my-8  container mx-auto text-black">
      <h2 className="text-3xl font-semibold text-center mb-6">User Profile</h2>
      <div className="flex flex-col items-center">
        {user.photoURL ? (
          <Image
            src={(user && user.photoURL) || ""}
            alt="User Avatar"
            width={100}
            height={100}
            className="rounded-full border p-1"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Photo</span>
          </div>
        )}
        <p className="mt-4 text-lg font-semibold">
          {user.displayName || "No name provided"}
        </p>
        <p className="text-gray-600">{user.email}</p>
        <div className="mt-6 border-t pt-4">
          <p className="text-sm">
            <strong>UID:</strong> {user.uid}
          </p>
        </div>
      </div>
    </div>
  );
}
