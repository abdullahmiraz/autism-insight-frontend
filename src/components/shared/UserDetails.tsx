"use client";

import Link from "next/link";
import { useAuth } from "../../lib/useAuth";
import { Button } from "../ui/button";

export default function UserDetails() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 border border-yellow-500 rounded-md flex  items-center gap-8">
        <p>Please log in to see your details.</p>
        <Link href={"/login"}>
          <Button>Login /Signup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md">
      <h2 className="text-2xl font-semibold">User Details</h2>
      <div className="mt-4">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>UID:</strong> {user.uid}
        </p>
        <p>
          <strong>Display Name:</strong>{" "}
          {user.displayName || "No name provided"}
        </p>
        <p>
          <strong>Photo URL:</strong> {user.photoURL || "No photo available"}
        </p>
      </div>
    </div>
  );
}
