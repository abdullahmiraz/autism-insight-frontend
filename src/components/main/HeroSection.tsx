"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center px-6 md:px-12 lg:px-20 ">
      <div className="absolute inset-0 w-full h-full bg-black opacity-70"></div>
      <Image
        src="/hero.jpg"
        alt="Autism Awareness"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full mix-blend-overlay"
      />
      <div className="relative max-w-3xl text-white">
        <motion.h1
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Understanding Autism, Embracing Differences
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          &quot;Autism is not a disability, it&apos;s a different ability.&quot;
          – Stuart Duncan{" "}
        </motion.p>
        <motion.p
          className="mt-4 text-base md:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Join us in spreading awareness, fostering inclusivity, and celebrating
          neurodiversity.
        </motion.p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Link
            href="./about"
            className="bg-yellow-500 text-blue-900 px-6 py-3 rounded hover:bg-yellow-600 transition"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
