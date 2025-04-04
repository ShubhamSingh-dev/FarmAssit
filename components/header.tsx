"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { scrollToSection } from "@/lib/utils";

const NavLinks = ({
  onClick,
  isAuthenticated,
}: {
  onClick?: () => void;
  isAuthenticated: boolean;
}) => (
  <>
    <Link
      href="#weather"
      onClick={() => {
        scrollToSection("weather");
        onClick?.();
      }}
      className="text-sm font-medium transition-colors hover:text-green-700 dark:hover:text-green-400"
    >
      Weather
    </Link>
    <Link
      href="#map"
      onClick={() => {
        scrollToSection("map");
        onClick?.();
      }}
      className="text-sm font-medium transition-colors hover:text-green-700 dark:hover:text-green-400"
    >
      NGO Map
    </Link>
    <Link
      href="#prices"
      onClick={() => {
        scrollToSection("prices");
        onClick?.();
      }}
      className="text-sm font-medium transition-colors hover:text-green-700 dark:hover:text-green-400"
    >
      Market Prices
    </Link>
    <Link
      href="#testimonials"
      onClick={() => {
        scrollToSection("testimonials");
        onClick?.();
      }}
      className="text-sm font-medium transition-colors hover:text-green-700 dark:hover:text-green-400"
    >
      Testimonials
    </Link>
    {isAuthenticated && (
      <Link
        href="#assistant"
        onClick={() => {
          scrollToSection("assistant");
          onClick?.();
        }}
        className="text-sm font-medium transition-colors hover:text-green-700 dark:hover:text-green-400"
      >
        AI Assistant
      </Link>
    )}
  </>
);

export function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection("hero");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="#hero"
          onClick={handleLogoClick}
          className="flex items-center space-x-2"
        >
          <span className="text-xl font-bold text-green-700 transition-colors dark:text-green-400">
            FarmAssist
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks
                  onClick={() => setIsOpen(false)}
                  isAuthenticated={!!user}
                />
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks isAuthenticated={!!user} />
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem className="flex items-center justify-between">
                Theme <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                Language <LanguageSwitcher />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
