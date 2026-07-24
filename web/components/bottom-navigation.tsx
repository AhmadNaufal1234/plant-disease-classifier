"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  House,
  Camera,
  History,
} from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();

  const menus = [
    {
      label: "Home",
      href: "/dashboard",
      icon: House,
    },
    {
      label: "Scan",
      href: "/deteksi",
      icon: Camera,
    },
    {
      label: "Riwayat",
      href: "/riwayat",
      icon: History,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">

      <div className="max-w-md mx-auto">

        <div className="m-3 rounded-2xl border bg-background/95 backdrop-blur">

          <div className="grid grid-cols-3">

            {menus.map((menu) => {
              const Icon = menu.icon;

              const active =
                pathname === menu.href;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="flex flex-col items-center py-3"
                >
                  <Icon
                    size={22}
                    className={
                      active
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  />

                  <span
                    className={`text-xs mt-1 ${
                      active
                        ? "text-green-500 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {menu.label}
                  </span>
                </Link>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}