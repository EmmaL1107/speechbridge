"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mic, Clock, BookOpen, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/speak", label: "Speak", icon: Mic },
  { href: "/history", label: "History", icon: Clock },
  { href: "/lexicon", label: "Words", icon: BookOpen },
  { href: "/voice-model", label: "Voice", icon: Fingerprint },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-medium transition-colors min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
