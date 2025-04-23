"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user && user.emailVerified) {
        const token = await user.getIdToken();
        document.cookie = `userToken=${token}; path=/; max-age=3600`;

        setUser(user);
      } else {
        document.cookie = "userToken=; path=/; max-age=0";
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
