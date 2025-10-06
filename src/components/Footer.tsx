import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">TechEdu</h3>
            <p className="text-gray-300 mb-4">
              Empowering the next generation of tech innovators. Transform your
              career with cutting-edge technology education and
              industry-standard curriculum.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/techedu"
                className="text-gray-400 hover:text-white transition-colors flex items-center"
              >
                <span className="mr-1">⚡</span> GitHub
              </a>
              <a
                href="https://linkedin.com/company/techedu"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              >
                <span className="mr-1">�</span> LinkedIn
              </a>
              <a
                href="https://twitter.com/techedu"
                className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
              >
                <span className="mr-1">🐦</span> Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/student/dashboard"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">📚</span> All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">🚀</span> Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">🔐</span> Login
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-2">ℹ️</span> About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">
              Tech Programs
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-blue-400 mr-2">🤖</span> Machine Learning
                & AI
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">🌐</span> Full Stack
                Development
              </li>
              <li className="flex items-center">
                <span className="text-purple-400 mr-2">📱</span> Mobile App
                Development
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">🐍</span> Python
                Programming
              </li>
              <li className="flex items-center">
                <span className="text-red-400 mr-2">📊</span> Data Science &
                Analytics
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-400">
              Get In Touch
            </h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">🌍</span>
                <span>Global Online Platform</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">�</span>
                <span>24/7 Support Chat</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">📧</span>
                <span>hello@techedu.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-400 mr-2">🎯</span>
                <span>Career Guidance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-8 pt-8 mb-8">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 text-center">
            <h4 className="text-xl font-semibold text-white mb-2">
              🚀 Stay Updated with Tech Trends
            </h4>
            <p className="text-gray-300 mb-4">
              Get weekly insights on the latest technologies, career tips, and
              exclusive course updates
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 TechEdu. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded">
                🟢 All Systems Operational
              </span>
              <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                🚀 v2.1.0
              </span>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Support
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              API Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
