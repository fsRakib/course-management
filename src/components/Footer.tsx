import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">CourseHub</h3>
            <p className="text-gray-300 mb-4">
              দেশসেরা কোর্স ম্যানেজমেন্ট প্ল্যাটফর্ম। আপনার সফলতার যাত্রায় আমরা
              আছি পাশে।
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                📘 Facebook
              </a>
              <a
                href="#"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                📺 YouTube
              </a>
              <a
                href="#"
                className="text-pink-400 hover:text-pink-300 transition-colors"
              >
                📷 Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/student/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  কোর্স সমূহ
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  রেজিস্ট্রেশন
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  লগইন
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  সম্পর্কে
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">
              প্রোগ্রামসমূহ
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>• মেডিকেল এডমিশন</li>
              <li>• ইঞ্জিনিয়ারিং এডমিশন</li>
              <li>• ভার্সিটি এডমিশন</li>
              <li>• HSC প্রোগ্রাম</li>
              <li>• SSC প্রোগ্রাম</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-400">
              যোগাযোগ
            </h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">📍</span>
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">📞</span>
                <span>+৮৮০ ১৭১২৩৪৫৬৭৮</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">✉️</span>
                <span>info@coursehub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © ২০২৫ CourseHub. সকল অধিকার সংরক্ষিত।
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              গোপনীয়তা নীতি
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              শর্তাবলী
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              সহায়তা
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
