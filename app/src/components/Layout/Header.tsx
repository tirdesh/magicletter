import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mood-toggle";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-background">
      <div className="text-2xl font-bold">Logo</div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {auth.currentUser ? (
          <Button onClick={() => navigate("/profile")}>Profile</Button>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </div>
    </header>
  );
};
