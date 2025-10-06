"use client";

import { useEffect, useState } from "react";

export default function ServicesSection() {
  const [visibleServices, setVisibleServices] = useState<number[]>([]);

  const services = [
    {
      icon: "💻",
      title: "Interactive Learning Platform",
      description: "Hands-on coding experience with real projects",
      color: "bg-blue-100 group-hover:bg-blue-500",
      features: [
        "Live Coding Sessions",
        "Project-Based Learning",
        "Code Reviews",
      ],
    },
    {
      icon: "🤖",
      title: "AI & Machine Learning",
      description: "Master the future of technology",
      color: "bg-green-100 group-hover:bg-green-500",
      features: ["Neural Networks", "Deep Learning", "Computer Vision"],
    },
    {
      icon: "🌐",
      title: "Full Stack Development",
      description: "Complete web development mastery",
      color: "bg-purple-100 group-hover:bg-purple-500",
      features: ["Frontend Frameworks", "Backend APIs", "Database Design"],
    },
    {
      icon: "📱",
      title: "Mobile App Development",
      description: "Build apps for iOS and Android",
      color: "bg-yellow-100 group-hover:bg-yellow-500",
      features: ["React Native", "Flutter Development", "Native iOS/Android"],
    },
    {
      icon: "�",
      title: "Python Programming",
      description: "From basics to advanced applications",
      color: "bg-red-100 group-hover:bg-red-500",
      features: ["Syntax Mastery", "Data Structures", "Automation Scripts"],
    },
    {
      icon: "🏆",
      title: "Competitive Programming",
      description: "Algorithmic problem solving",
      color: "bg-indigo-100 group-hover:bg-indigo-500",
      features: ["Algorithm Design", "Contest Preparation", "Problem Solving"],
    },
    {
      icon: "�",
      title: "Data Science & Analytics",
      description: "Extract insights from data",
      color: "bg-teal-100 group-hover:bg-teal-500",
      features: [
        "Data Visualization",
        "Statistical Analysis",
        "Machine Learning Models",
      ],
    },
    {
      icon: "☁️",
      title: "Cloud Computing",
      description: "Deploy and scale applications",
      color: "bg-orange-100 group-hover:bg-orange-500",
      features: ["AWS/Azure/GCP", "DevOps Practices", "Containerization"],
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setTimeout(() => {
              setVisibleServices((prev) => [...prev, index]);
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".service-card");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Cpath d='m20 20 20-20H20v20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Comprehensive <span className="gradient-text">Tech Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to master modern technology and advance your
            career
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`service-card text-center group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                visibleServices.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-transparent">
                <div
                  className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 relative overflow-hidden`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10 group-hover:text-white">
                    {service.icon}
                  </span>
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors">
                  {service.description}
                </p>

                {/* Features list */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ul className="text-xs text-gray-500 space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center justify-center"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Assurance Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <span className="text-2xl mr-3">🚀</span>
            <div className="text-left">
              <div className="font-semibold">Industry-Standard Curriculum</div>
              <div className="text-xs opacity-90">
                Learn with cutting-edge technology
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
