"use client";

import { useEffect, useState } from "react";

export default function ServicesSection() {
  const [visibleServices, setVisibleServices] = useState<number[]>([]);

  const services = [
    {
      icon: "💻",
      title: "অনলাইন/অফলাইন প্রোগ্রাম",
      description: "আপনার সুবিধা অনুযায়ী বেছে নিন",
      color: "bg-blue-100 group-hover:bg-blue-500",
      features: ["লাইভ ক্লাস", "রেকর্ডেড ভিডিও", "ইন্টারঅ্যাক্টিভ সেশন"],
    },
    {
      icon: "👨‍🏫",
      title: "মেধাবী ও অভিজ্ঞ শিক্ষক",
      description: "দেশের সেরা শিক্ষকদের গাইডেন্স",
      color: "bg-green-100 group-hover:bg-green-500",
      features: [
        "বিশেষজ্ঞ শিক্ষকমণ্ডলী",
        "পার্সোনালাইজড গাইডেন্স",
        "মেন্টরিং সাপোর্ট",
      ],
    },
    {
      icon: "📚",
      title: "মানসম্মত স্টাডি ম্যাটেরিয়ালস",
      description: "সর্বোচ্চ মানের পাঠ্য উপকরণ",
      color: "bg-purple-100 group-hover:bg-purple-500",
      features: ["আপডেটেড কন্টেন্ট", "প্রিন্টেড বুক", "ডিজিটাল রিসোর্স"],
    },
    {
      icon: "🎯",
      title: "কনসেপ্ট বেইজড ক্লাস",
      description: "গভীর ধারণার মাধ্যমে শিক্ষা",
      color: "bg-yellow-100 group-hover:bg-yellow-500",
      features: [
        "ধাপে ধাপে শিক্ষা",
        "প্র্যাক্টিক্যাল উদাহরণ",
        "রিয়েল লাইফ অ্যাপ্লিকেশন",
      ],
    },
    {
      icon: "📊",
      title: "ইউনিক এক্সাম সিস্টেম",
      description: "আধুনিক পরীক্ষা পদ্ধতি",
      color: "bg-red-100 group-hover:bg-red-500",
      features: ["AI বেসড মার্কিং", "ডিটেইলড এনালাইসিস", "র‌্যাঙ্কিং সিস্টেম"],
    },
    {
      icon: "💬",
      title: "সার্বক্ষণিক Q&A সেবা",
      description: "২৪/৭ সমস্যা সমাধান",
      color: "bg-indigo-100 group-hover:bg-indigo-500",
      features: ["তাৎক্ষণিক রেসপন্স", "এক্সপার্ট সাপোর্ট", "গ্রুপ ডিসকাশন"],
    },
    {
      icon: "📱",
      title: "Auto SMS রেজাল্ট",
      description: "তাৎক্ষণিক ফলাফল প্রাপ্তি",
      color: "bg-teal-100 group-hover:bg-teal-500",
      features: [
        "রিয়েল টাইম নোটিফিকেশন",
        "পার্ফরমেন্স ট্র্যাকিং",
        "প্যারেন্ট আপডেট",
      ],
    },
    {
      icon: "📈",
      title: "এক্সাম এনালাইসিস রিপোর্ট",
      description: "বিস্তারিত পারফরমেন্স বিশ্লেষণ",
      color: "bg-orange-100 group-hover:bg-orange-500",
      features: [
        "সাবজেক্ট ওয়াইজ স্কোর",
        "উইক নেস আইডেন্টিফিকেশন",
        "ইমপ্রুভমেন্ট প্ল্যান",
      ],
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
            অনন্য সব <span className="gradient-text">সেবা পরিক্রমা</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            দেশব্যাপী সমান মানের শিক্ষা সেবা প্রদানে আমরা প্রতিশ্রুতিবদ্ধ
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
            <span className="text-2xl mr-3">🏆</span>
            <div className="text-left">
              <div className="font-semibold">
                দেশব্যাপী সমান সেবার নিশ্চয়তা
              </div>
              <div className="text-xs opacity-90">
                সকল শাখায় একই মানের শিক্ষা
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
