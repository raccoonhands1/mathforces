import React from "react";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();

const renderPlaceholder = (text: string) => (
  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
    {text}
  </div>
);
const LatexPrompt = ({ question }: { question: { prompt: string } }) => {
  return (
    <div className="relative w-60 h-24">
      {renderPlaceholder(question?.prompt || "")}
      <EditableMathField
        latex={question?.prompt}
        config={{
          substituteTextarea: () => {
            const textarea = document.createElement("textarea");
            textarea.disabled = true;
            return textarea;
          },
        }}
        className="bg-black border-2 rounded-md w-full h-full p-4 text-center text-xl"
      />
    </div>
  );
};

export default LatexPrompt;
