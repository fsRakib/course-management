"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function TestimonialSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "তোফায়েল আহমেদ",
      achievement: "BUET মেধাতালিকায় ১ম",
      year: "২০২ৄ-২৫",
      quote:
        "আমি উদ্ভাসের এডমিশন প্রোগ্রামের সাথে সিলেবাস অনেকটা এগিয়ে রেখেছিলাম। নিয়মিত ক্লাস ও পরীক্ষায় অংশগ্রহণ করেছি, কোনো ক্লাস বা পরীক্ষা কখনো মিস দিইনি। ম্যারাথন ক্লাসগুলো আমার প্রত্যাশার চেয়েও অনেক বেশি কার্যকর ছিল।",
      position: "১ম",
      color: "from-blue-500 to-purple-600",
    },
    {
      name: "সজীব আহমেদ রুহিত",
      achievement: "BUET মেধাতালিকায় ২য়",
      year: "২০২৪-২৫",
      quote:
        "আমি এডমিশন জার্নির শুরু থেকেই উদ্ভাসের সাথে ছিলাম। অনলাইনে ম্যারাথন ক্লাসগুলো করতাম আর অফলাইনে বেশি বেশি এক্সাম দিতাম। গুণগত মানের দিক থেকে উদ্ভাসের ক্লাসগুলো অনেক ভালো ছিল।",
      position: "২য়",
      color: "from-green-500 to-teal-600",
    },
    {
      name: "এস.এ.এম তামিম",
      achievement: "BUET মেধাতালিকায় ৩য়",
      year: "২০২৪-২৫",
      quote:
        "এডমিশনের শুরু থেকেই আমি উদ্ভাসের ফুল কোর্সে ভর্তি ছিলাম। আমি উদ্ভাসের প্রতিটি ক্লাস-পরীক্ষায় অংশগ্রহণ করতাম। বিশেষ করে, উদ্ভাসের ম্যারাথন ক্লাস ও মাস্টার প্রশ্নব্যাংক আমার প্রস্তুতিতে অনেক সাহায্য করেছে।",
      position: "৩য়",
      color: "from-purple-500 to-pink-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            সফল যারা, কেমন তারা?
          </h2>
          <p className="text-xl text-gray-600">
            আমাদের শিক্ষার্থীদের সফলতার গল্প
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl border-0 relative overflow-hidden">
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentTestimonial].color} opacity-5`}
            ></div>

            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
              {/* Achievement Badge */}
              <div className="flex-shrink-0">
                <div
                  className={`w-40 h-40 bg-gradient-to-br ${testimonials[currentTestimonial].color} rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300`}
                >
                  {testimonials[currentTestimonial].position}
                </div>
                {/* Decorative elements */}
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {testimonials[currentTestimonial].name}
                  </h3>
                  <p className="text-xl text-blue-600 font-semibold mb-1">
                    {testimonials[currentTestimonial].achievement}
                  </p>
                  <p className="text-sm text-gray-500">
                    ভর্তি পরীক্ষা: {testimonials[currentTestimonial].year}
                  </p>
                </div>

                <blockquote className="text-gray-700 text-lg leading-relaxed italic relative">
                  <span className="text-6xl text-blue-200 absolute -top-4 -left-4 font-serif">
                    "
                  </span>
                  <span className="relative z-10">
                    {testimonials[currentTestimonial].quote}
                  </span>
                  <span className="text-6xl text-blue-200 absolute -bottom-8 -right-4 font-serif">
                    "
                  </span>
                </blockquote>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="w-10 h-10 rounded-full p-0"
              >
                ←
              </Button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial
                        ? "bg-blue-500 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  )
                }
                className="w-10 h-10 rounded-full p-0"
              >
                →
              </Button>
            </div>
          </Card>

          {/* Video testimonial CTA */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <span className="mr-2">▶️</span>
              আরও সফলতার গল্প দেখুন
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
