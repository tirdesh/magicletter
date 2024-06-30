import { AIProviderMenu } from "@/components/MyUI/ai-provider-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mood-toggle";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/image.png";
import { auth } from "../../firebase";

export const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/app/dashboard" },
    { label: "Manage Resumes", path: "/app/resumes" },
    { label: "Cover Letter Wizard", path: "/app/magic-wizard" },
  ];

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and App Name */}
          <Link to="/app/dashboard" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={logo} alt="MagicLetter Logo" />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <span className="text-xl font-bold hidden sm:inline">
              MagicLetter
            </span>
          </Link>

          {/* Navigation */}
          {currentUser && (
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {currentUser && (
              <>
                <div className="relative group">
                  <AIProviderMenu />
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => auth.signOut()}
                  className="text-sm font-medium hover:bg-secondary"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
