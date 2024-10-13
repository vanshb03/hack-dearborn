"use client";

import React, { useEffect, useRef } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Component() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });3

    const subtitleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });

    if (titleRef.current) {
      titleObserver.observe(titleRef.current);
    }
    if (subtitleRef.current) {
      subtitleObserver.observe(subtitleRef.current);
    }

    return () => {
      if (titleRef.current) {
        titleObserver.unobserve(titleRef.current);
      }
      if (subtitleRef.current) {
        subtitleObserver.unobserve(subtitleRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <CalendarIcon className="h-6 w-6 text-primary" />
          <span className="sr-only">aischeduler</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary py-2" prefetch={false}>
            Features
            </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary py-2" prefetch={false}>
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary py-2" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary py-2" prefetch={false}>
            Contact
          </Link>
          <Link
                  href="#"
                  className="text-sm font-medium hover:text-primary bg-primary text-primary-foreground text-md rounded px-4 py-2 shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Sign Up
            </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.h1 
                ref={titleRef}
                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary opacity-0 translate-y-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Reclaim Your Time with aischeduler
              </motion.h1>
              <motion.p 
                ref={subtitleRef}
                className="max-w-[600px] text-secondary-foreground md:text-xl opacity-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Automatically block off 15-30 minute periods for tasks and to-do items, so you can focus on what
                matters most.
              </motion.p>
              <motion.div 
                className="flex flex-col gap-2 min-[400px]:flex-row mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-8 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Sign Up
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                  Boost Your Productivity with aischeduler
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  aischeduler integrates with your Google Calendar to automatically block off time for your tasks and
                  to-do items, so you can focus on what&apos;s important.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-primary">Automatic Time Blocking</h3>
                      <p className="text-muted-foreground">
                        aischeduler integrates with your Google Calendar to automatically block off 15-30 minute periods
                        for your tasks and to-do items.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-primary">Increased Productivity</h3>
                      <p className="text-muted-foreground">
                        By automatically blocking off time for your tasks, you&apos;ll be able to focus and get more done.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-primary">Seamless Integration</h3>
                      <p className="text-muted-foreground">
                        aischeduler integrates directly with your Google Calendar, so you can manage your time without
                        switching between apps.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="aspect-video overflow-hidden rounded-xl bg-muted"></div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Take Control of Your Time with aischeduler
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                aischeduler helps you stay focused and productive by automatically blocking off time for your tasks and
                to-do items.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-8 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Sign Up
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border">
        <p className="text-xs text-muted-foreground">&copy; 2024 aischeduler. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:text-primary" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:text-primary" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}