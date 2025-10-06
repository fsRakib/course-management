"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeroBanner from "@/components/HeroBanner";
import SuccessStats from "@/components/SuccessStats";
import TestimonialSection from "@/components/TestimonialSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import { AuthModal } from "@/components/AuthModal";
import { getDashboardPath } from "@/lib/auth-utils";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(
    "signup"
  );

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const dashboardPath = getDashboardPath(session.user.role);
      router.push(dashboardPath);
    }
  }, [status, session, router]);

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the home page if user is authenticated (they will be redirected)
  if (status === "authenticated") {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <HeroBanner
        onAuthModalOpen={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Featured Programs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Master Modern Tech Stacks
            </h2>
            <p className="text-xl text-gray-600">
              Choose the best course according to your career goals in
              technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Machine Learning & AI */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Machine Learning & AI
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> Deep Learning
                    Fundamentals
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> Neural
                    Networks & TensorFlow
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> Computer
                    Vision & NLP
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> Real-world ML
                    Projects
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-500 hover:bg-green-600">
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAuthModalMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Web Development */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Full Stack Web Development
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> React, Next.js
                    & TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> Node.js &
                    Express Backend
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> Database
                    Design & MongoDB
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> Deployment &
                    DevOps
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAuthModalMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Mobile App Development */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Android & iOS Development
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> Flutter &
                    React Native
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> Native
                    Android (Kotlin)
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> iOS
                    Development (Swift)
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> App Store
                    Deployment
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAuthModalMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Python Programming */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🐍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Python Programming
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-yellow-500 mr-2">•</span> Python
                    Fundamentals to Advanced
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-500 mr-2">•</span> Data Science
                    & Analytics
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-500 mr-2">•</span> Django &
                    Flask Web Frameworks
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-500 mr-2">•</span> Automation &
                    Scripting
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAuthModalMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Competitive Programming */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-red-50 to-pink-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">�</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Competitive Programming
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span> Data Structures
                    & Algorithms
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span> Problem Solving
                    Techniques
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span> Codeforces &
                    LeetCode Practice
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">•</span> Contest
                    Preparation
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-red-500 hover:bg-red-600">
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAuthModalMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Data Science & Analytics */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-indigo-50 to-blue-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Data Science & Analytics
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-indigo-500 mr-2">•</span> Statistics &
                    Mathematics
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-500 mr-2">•</span> Pandas,
                    NumPy & Matplotlib
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-500 mr-2">•</span> Machine
                    Learning Models
                  </li>
                  <li className="flex items-center">
                    <span className="text-indigo-500 mr-2">•</span> Business
                    Intelligence Tools
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600">
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setAuthModalMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Statistics */}
      <SuccessStats />

      {/* Student Testimonial */}
      <TestimonialSection />

      {/* Unique Services */}
      <ServicesSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start Your Tech Journey Today
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students mastering cutting-edge technologies and
            building their dream careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={() => {
                setAuthModalMode("signup");
                setIsAuthModalOpen(true);
              }}
            >
              Get Started Free
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg"
            >
              <Link href="/student/dashboard">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}
