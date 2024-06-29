import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { auth } from "../firebase";

const Dashboard: React.FC = () => {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <p className="mb-6">Hello, {currentUser?.email}</p>

      <div className="flex flex-col space-y-4 mb-8">
        <Button onClick={() => navigate("/app/resumes")}>Manage Resumes</Button>
        <Button onClick={() => navigate("/app/magic-wizard")}>
          Magic Wizard
        </Button>
      </div>

      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default Dashboard;
