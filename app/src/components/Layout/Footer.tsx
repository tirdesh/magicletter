import { Separator } from "@/components/ui/separator";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">MagicLetter</h3>
            <p className="text-sm text-muted-foreground">
              Empowering your job search with AI-driven cover letters.
            </p>
          </div>

          {/* Social Media */}
          <div className="space-y-2 md:text-right">
            <h3 className="font-semibold text-lg">Connect With Us</h3>
            <div className="flex space-x-4 md:justify-end">
              <a
                href="https://github.com/tirdesh/magicletter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GitHubLogoIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/tirdu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <TwitterLogoIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/tirdesh/magicletter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <LinkedInLogoIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:tirdesh@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <EnvelopeClosedIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} MagicLetter. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
