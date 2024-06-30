import { AIProviderButton } from "@/components/MyUI/ai-provider-button";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mood-toggle";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/image.png";
import { auth } from "../../firebase";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-background">
      <div className="text-2xl font-bold">
        <img src={logo} alt="Logo" />
      </div>
      {auth.currentUser ? (
        <>
          <Button variant="outline" onClick={() => navigate("/app/dashboard")}>
            Home
          </Button>
          <Button variant="outline" onClick={() => navigate("/app/resumes")}>
            Manage Resumes
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/app/magic-wizard")}
          >
            Cover Letter Wizard
          </Button>
        </>
      ) : (
        <></>
      )}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {auth.currentUser ? (
          <>
            <AIProviderButton />
            <Button variant="outline" onClick={() => auth.signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};
