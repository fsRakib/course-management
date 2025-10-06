import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeroBanner from "@/components/HeroBanner";
import SuccessStats from "@/components/SuccessStats";
import TestimonialSection from "@/components/TestimonialSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Programs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              সময়োপযোগী প্রোগ্রামসমূহ
            </h2>
            <p className="text-xl text-gray-600">
              আপনার লক্ষ্য অনুযায়ী বেছে নিন সেরা কোর্স
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Medical Admission Program */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  মেডিকেল এডমিশন প্রোগ্রাম
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> মেধাবী ও
                    অভিজ্ঞ শিক্ষক দ্বারা ক্লাস
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> লাইভ ম্যারাথন
                    ক্লাস
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> প্রশ্নব্যাংক
                    মাস্টার ক্লাস ও কুইজ
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">•</span> সার্বক্ষণিক Q
                    & A সেবা
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-500 hover:bg-green-600">
                    বিস্তারিত
                  </Button>
                  <Button variant="outline" className="flex-1">
                    ভর্তি হন
                  </Button>
                </div>
              </div>
            </Card>

            {/* Engineering Admission Program */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  ইঞ্জিনিয়ারিং এডমিশন প্রোগ্রাম
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> পর্যাপ্ত
                    সংখ্যক স্ট্যান্ডার্ড এক্সাম
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> মানসম্মত সকল
                    স্টাডি ম্যাটেরিয়ালস
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> লাইভ ম্যারাথন
                    ক্লাস
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">•</span> ডাউট সলভিং
                    সেবা
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                    বিস্তারিত
                  </Button>
                  <Button variant="outline" className="flex-1">
                    ভর্তি হন
                  </Button>
                </div>
              </div>
            </Card>

            {/* University Admission Program */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  ভার্সিটি এডমিশন প্রোগ্রাম
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> ঢাকা
                    বিশ্ববিদ্যালয় 'ক' ও 'খ' ইউনিট
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> GST
                    প্রস্তুতি
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> প্রশ্নব্যাংক
                    মাস্টার ক্লাস
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-500 mr-2">•</span> অনলাইন ও
                    অফলাইন সুবিধা
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                    বিস্তারিত
                  </Button>
                  <Button variant="outline" className="flex-1">
                    ভর্তি হন
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            আজই শুরু করুন আপনার সফলতার যাত্রা
          </h2>
          <p className="text-xl mb-8 text-green-100">
            হাজারো শিক্ষার্থীর সাথে যুক্ত হয়ে আপনার স্বপ্নের ক্যারিয়ার গড়ুন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              <Link href="/signup">ফ্রি রেজিস্ট্রেশন করুন</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
            >
              <Link href="/student/dashboard">কোর্স সমূহ দেখুন</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
