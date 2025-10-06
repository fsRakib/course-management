"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/";

    switch (session.user.role) {
      case "student":
        return "/student/dashboard";
      case "developer":
        return "/developer/dashboard";
      case "socialMediaManager":
        return "/manager/dashboard";
      case "admin":
        return "/admin/dashboard";
      case "instructor":
        return "/instructor/dashboard";
      default:
        return "/user/dashboard";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "socialMediaManager":
        return "Manager";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">CourseHub</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Public Navigation Links */}
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>

            {status === "loading" ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : session ? (
              /* Authenticated User Navigation */
              <div className="flex items-center space-x-4">
                {/* Dashboard Link */}
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* Role-specific Links */}
                {(session.user.role === "developer" ||
                  session.user.role === "admin") && (
                  <Link
                    href="/developer/courses"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Manage Courses
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRoleDisplayName(session.user.role)}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              /* Unauthenticated User Navigation */
              <div className="flex items-center space-x-4">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {status === "loading" ? (
                <div className="flex items-center px-3 py-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : session ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {(session.user.role === "developer" ||
                    session.user.role === "admin") && (
                    <Link
                      href="/developer/courses"
                      className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Manage Courses
                    </Link>
                  )}

                  <div className="px-3 py-2 border-t border-gray-200 mt-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getRoleDisplayName(session.user.role)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2 border-t border-gray-200 mt-2">
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
