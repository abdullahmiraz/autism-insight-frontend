'use client';

import { useState, FormEvent } from "react";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p>Password reset email sent! Please check your inbox.</p>
                    <p className="text-sm mt-2">
                        Didn&apos;t receive the email? Check your spam folder or{" "}
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-green-700 underline"
                        >
                            try again
                        </button>
                    </p>
                </div>
            )}

            {!success && (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-2 mt-1 border rounded"
                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                title="Please enter a valid email address"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            )}

            <div className="mt-4 text-center">
                <Link href="/login" className="text-blue-500 hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;