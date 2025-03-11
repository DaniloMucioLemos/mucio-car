"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800">
                Múcio Car Admin
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {session?.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 