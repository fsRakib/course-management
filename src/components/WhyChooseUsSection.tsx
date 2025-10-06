import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WhyChooseUsSection() {
  const reasons = [
    {
      title: "প্রমাণিত সাফল্যের রেকর্ড",
      description:
        "হাজারো শিক্ষার্থীর সফলতার মাধ্যমে প্রমাণিত আমাদের শিক্ষা পদ্ধতি",
      icon: "🏆",
      stats: "৯৫% সাফল্যের হার",
    },
    {
      title: "আধুনিক শিক্ষা প্রযুক্তি",
      description:
        "সর্বাধুনিক প্রযুক্তি ব্যবহার করে ইন্টারঅ্যাক্টিভ শিক্ষা প্রদান",
      icon: "💻",
      stats: "২৪/৭ অনলাইন সাপোর্ট",
    },
    {
      title: "ব্যক্তিগত মনোযোগ",
      description: "প্রতিটি শিক্ষার্থীর প্রয়োজন অনুযায়ী ব্যক্তিগত গাইডেন্স",
      icon: "👥",
      stats: "১:১৫ শিক্ষক-শিক্ষার্থী অনুপাত",
    },
    {
      title: "সাশ্রয়ী মূল্য",
      description: "মানসম্মত শিক্ষা সবার নাগালের মধ্যে রাখার প্রতিশ্রুতি",
      icon: "💰",
      stats: "৫০% কম খরচে উন্নত শিক্ষা",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            কেন <span className="gradient-text">আমাদের</span> বেছে নেবেন?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            আমাদের অনন্য বৈশিষ্ট্য এবং প্রমাণিত পদ্ধতি আপনার সফলতা নিশ্চিত করে
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{reason.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {reason.description}
                </p>
                <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {reason.stats}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              আপনিও হতে পারেন আমাদের পরবর্তী সফল শিক্ষার্থী!
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              আজই যুক্ত হন আমাদের সাথে এবং শুরু করুন আপনার সফলতার যাত্রা
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg"
              >
                <Link href="/signup">এখনই রেজিস্ট্রেশন করুন</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                <Link href="/student/dashboard">ফ্রি ট্রায়াল নিন</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
