"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "📊",
  },
  {
    name: "Agendamentos",
    href: "/admin/agendamentos",
    icon: "📅",
  },
  {
    name: "Serviços",
    href: "/admin/servicos",
    icon: "🔧",
  },
  {
    name: "Depoimentos",
    href: "/admin/depoimentos",
    icon: "💬",
  },
  {
    name: "Galeria",
    href: "/admin/galeria",
    icon: "🖼️",
  },
  {
    name: "Configurações",
    href: "/admin/configuracoes",
    icon: "⚙️",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
} 