// lib/useAuth.ts

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
      setLoading(false);

      // If the user is authenticated, set a cookie with a token
      if (user) {
        user.getIdToken().then((token) => {
          document.cookie = `userToken=${token}; path=/; max-age=3600`; // Cookie expires in 1 hour
        });
      } else {
        document.cookie = `userToken=; path=/; max-age=0`; // Clear cookie when the user logs out
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
