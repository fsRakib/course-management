"use client";

import { useEffect, useState } from "react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function Counter({ end, duration = 2000, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(end * easeOutCubic));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function SuccessStats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("success-stats");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const stats = [
    {
      icon: "💼",
      count: 2500,
      suffix: "+",
      title: "Career Transitions",
      subtitle: "From non-tech to high-paying tech jobs",
      color: "bg-red-500",
    },
    {
      icon: "🚀",
      count: 150,
      suffix: "+",
      title: "Startups Launched",
      subtitle: "By our entrepreneurial alumni",
      color: "bg-blue-500",
    },
    {
      icon: "💰",
      count: 95,
      suffix: "%",
      title: "Job Placement Rate",
      subtitle: "Within 6 months of graduation",
      color: "bg-purple-500",
    },
    {
      icon: "🏆",
      count: 50,
      suffix: "+",
      title: "Industry Awards",
      subtitle: "Won by our students & faculty",
      color: "bg-green-500",
    },
  ];

  return (
    <section
      id="success-stats"
      className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='37' cy='37' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Incredible Success Metrics
          </h2>
          <p className="text-xl text-blue-100">
            Real numbers showcasing our students' achievements in tech
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-4xl">{stat.icon}</span>
                </div>
                {/* Floating particles effect */}
                <div className="absolute inset-0 -z-10">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 ${stat.color} rounded-full opacity-50 animate-ping`}
                      style={{
                        top: `${20 + i * 20}%`,
                        left: `${20 + i * 30}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: "2s",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="text-5xl font-bold mb-2 text-yellow-300">
                {isVisible ? (
                  <Counter end={stat.count} suffix={stat.suffix} />
                ) : (
                  "0+"
                )}
              </div>
              <div className="text-lg text-blue-100 mb-1 font-semibold">
                {stat.title}
              </div>
              <div className="text-sm text-blue-200">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Achievement badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {[
            "Award Winning Platform",
            "Global Community",
            "24/7 Support",
            "Industry Experts",
          ].map((badge, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
