// src/components/ExportResumeButton.tsx
import React from "react";
import { ResumeDocxGenerator, ResumeData } from "../services/resumeDocxGenerator";

interface ExportProps {
  resumeData: ResumeData;
}

export const ExportResumeButton: React.FC<ExportProps> = ({ resumeData }) => {
  const handleExport = async () => {
    const blob = await ResumeDocxGenerator.generate(resumeData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = `${resumeData.contact.fullName.replace(/\s+/g, "_")}_Resume.docx`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        padding: "10px 16px",
        backgroundColor: "#0078D4",
        color: "#FFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Download Microsoft Word (.docx)
    </button>
  );
};