import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const SocialAuthButtons: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/app/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center"
      onClick={handleGoogleSignIn}
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Sign In with Google
    </Button>
  );
};

export default SocialAuthButtons;
