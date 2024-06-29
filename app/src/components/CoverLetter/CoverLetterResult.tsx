// src/components/CoverLetter/CoverLetterResult.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedCoverLetter } from "@/model";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface CoverLetterResultProps {
  generatedLetter: GeneratedCoverLetter;
}

const CoverLetterResult: React.FC<CoverLetterResultProps> = ({
  generatedLetter,
}) => {
  const [content, setContent] = useState(generatedLetter.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cover_letter.doc";
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        className="font-mono whitespace-pre-wrap"
      />
      <div className="space-x-2">
        <Button onClick={handleCopy}>Copy to Clipboard</Button>
        <Button onClick={handleDownload}>Download as DOC</Button>
      </div>
    </motion.div>
  );
};

export default CoverLetterResult;
