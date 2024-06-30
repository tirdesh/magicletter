import { AIProviderMenu } from "@/components/MyUI/ai-provider-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mood-toggle";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image.png";
import { auth } from "../../firebase";

export const Header: React.FC = () => {
  const { currentUser } = useAuth();

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
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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
                <AIProviderMenu />
                <button
                  onClick={() => auth.signOut()}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
