// lib/auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

// Type for the email and password login/signup
interface EmailPasswordCredentials {
  email: string;
  password: string;
}

// Register user with Email & Password
export const signUpWithEmail = async ({
  email,
  password,
}: EmailPasswordCredentials) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);

    // Store user in MongoDB
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userCredential.user.email,
        name: userCredential.user.displayName || email.split("@")[0],
        role: "user",
        isEmailVerified: false,
        status: "active",
        lastLogin: new Date(),
        firebaseUid: userCredential.user.uid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create user in database:", errorData);
      throw new Error(errorData.error || "Failed to create user in database");
    }

    const userData = await response.json();

    // Set user token
    document.cookie = `userToken=${userCredential.user.uid}; path=/; max-age=86400`; // 24 hours expiry
    document.cookie = `userEmail=${userCredential.user.email}; path=/; max-age=86400`; // 24 hours expiry

    // Set admin token if user is admin
    if (userData.role === "admin") {
      document.cookie = `adminToken=${userCredential.user.uid}; path=/; max-age=86400`; // 24 hours expiry
    }

    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Login user with Email & Password
export const loginWithEmail = async ({
  email,
  password,
}: EmailPasswordCredentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update last login in MongoDB
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userCredential.user.email,
        name: userCredential.user.displayName || email.split("@")[0],
        lastLogin: new Date(),
        firebaseUid: userCredential.user.uid,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update user in database");
    }

    // Get user role from response
    const userData = await response.json();

    // Set user token
    document.cookie = `userToken=${userCredential.user.uid}; path=/; max-age=86400`; // 24 hours expiry
    document.cookie = `userEmail=${userCredential.user.email}; path=/; max-age=86400`; // 24 hours expiry

    // Set admin token if user is admin
    if (userData.role === "admin") {
      document.cookie = `adminToken=${userCredential.user.uid}; path=/; max-age=86400`; // 24 hours expiry
    }

    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Google Sign-in
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);

    // Store or update user in MongoDB
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userCredential.user.email,
        name:
          userCredential.user.displayName ||
          userCredential.user.email?.split("@")[0],
        role: "user",
        isEmailVerified: userCredential.user.emailVerified,
        status: "active",
        lastLogin: new Date(),
        firebaseUid: userCredential.user.uid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create user in database:", errorData);
      throw new Error(errorData.error || "Failed to create user in database");
    }

    // Get user role from response
    const userData = await response.json();

    // Set user token
    document.cookie = `userToken=${userCredential.user.uid}; path=/; max-age=86400`; // 24 hours expiry
    document.cookie = `userEmail=${userCredential.user.email}; path=/; max-age=86400`; // 24 hours expiry

    // Set admin token if user is admin
    if (userData.role === "admin") {
      document.cookie = `adminToken=${userCredential.user.uid}; path=/; max-age=86400`; // 24 hours expiry
    }

    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Password Reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
