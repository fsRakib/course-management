"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroBannerProps {
  onAuthModalOpen?: (mode: "signin" | "signup") => void;
}

export default function HeroBanner({ onAuthModalOpen }: HeroBannerProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Master Modern Technology",
      subtitle: "Leading Tech Education Platform",
      description:
        "Learn cutting-edge technologies with expert guidance and build your dream career in tech.",
      gradient: "from-blue-600 via-purple-600 to-blue-800",
    },
    {
      title: "AI & Machine Learning",
      subtitle: "Build the Future with AI",
      description:
        "Master neural networks, deep learning, and create intelligent applications.",
      gradient: "from-green-600 via-teal-600 to-green-800",
    },
    {
      title: "Full Stack Development",
      subtitle: "Code Your Success Story",
      description:
        "From frontend to backend, master the complete web development stack.",
      gradient: "from-purple-600 via-indigo-600 to-purple-800",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className={`relative bg-gradient-to-br ${slides[currentSlide].gradient} text-white py-20 overflow-hidden transition-all duration-1000`}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            {slides[currentSlide].title.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  index ===
                  slides[currentSlide].title
                    .split(" ")
                    .findIndex(
                      (w) =>
                        w === "Technology" ||
                        w === "Learning" ||
                        w === "Development"
                    )
                    ? "text-yellow-300"
                    : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </h1>
          <p
            className="text-2xl md:text-3xl mb-4 text-blue-100 font-semibold animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            {slides[currentSlide].subtitle}
          </p>
          <p
            className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {slides[currentSlide].description}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg transform hover:scale-105 transition-all"
            >
              <Link href="/student/dashboard">Explore Courses</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg transform hover:scale-105 transition-all"
              onClick={() => onAuthModalOpen?.("signup")}
            >
              Start Learning Free
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-yellow-400 scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
