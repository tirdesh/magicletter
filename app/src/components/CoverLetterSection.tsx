// src/components/Dashboard/CoverLetterSection.tsx
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import React from "react";

interface CoverLetterSectionProps {
  generatedLetter: string;
  copyToClipboard: () => void;
  downloadAsDoc: () => void;
}

const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({
  generatedLetter,
  copyToClipboard,
  downloadAsDoc,
}) => {
  if (!generatedLetter) return null;

  return (
    <CardFooter className="flex flex-col items-start">
      <h3 className="text-lg font-semibold mb-2">Generated Cover Letter:</h3>
      <p className="mb-4">{generatedLetter}</p>
      <div className="space-x-2">
        <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
        <Button onClick={downloadAsDoc}>Download as .doc</Button>
      </div>
    </CardFooter>
  );
};

export default CoverLetterSection;
