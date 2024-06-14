'use client';
import { useState } from 'react';
import Link from "next/link";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { addStyles, EditableMathField } from 'react-mathquill';

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles();

const LeaderBoard = ({ classname }: { classname?: string }) => {
  const users = [
    {
      username: "Tom",
      score: 35,
    },
    {
      username: "Clayton",
      score: 30,
    },
    {
      username: "Akiko",
      score: 20,
    },
    {
      username: "Jessy",
      score: 12,
    },
    {
      username: "Bat",
      score: 10,
    },
  ];
  return (
    <div className={classname}>
      <div className="pt-6 text-center text-2xl hind-siliguri-bold">Leaderboard</div>
      <hr className="border-t border-gray-400 my-4 mx-12" />
      <div className="justify-center pl-12 pb-6">
        <div className="bg-zinc-900 rounded-lg p-6">
          {users.map((user, index) => {
            const { username, score } = user;
            const line = "" + (index + 1) + ". " + username + " - " + score; // Add key and fix index numbering
            return <div key={index} className="text-center">{line}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  //for input
  const [latex, setLatex] = useState('');
  //for displaying
  const latexdisplay = '\\frac{1}{\\sqrt{2}}\\cdot 2';

  const renderPlaceholder = (text) => (
    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
      {text}
    </div>
  );

  return (
    <div className="relative flex items-center justify-center h-screen">
      <Link className="absolute top-10 left-10 button" href="/">
        quit
      </Link>
      <div className="flex flex-col items-center space-y-6 w-full px-4">
        <div className="relative w-60 h-24">
          {latexdisplay === '' && renderPlaceholder('Static LaTeX Placeholder')}
          <EditableMathField
            latex={latexdisplay}
            config={{
              substituteTextarea: () => {
                const textarea = document.createElement('textarea');
                textarea.disabled = true;
                return textarea;
              },
            }}
            className="bg-black border-2 rounded-md w-full h-full p-4 text-center text-xl"
          />
        </div>
        <div className="relative w-60 h-24">
          {latex === '' && renderPlaceholder('Type Here')}
          <EditableMathField
            className="bg-black border-2 rounded-md w-full h-full p-4 text-center text-xl"
            latex={latex}
            onChange={(mathField) => {
              setLatex(mathField.latex());
            }}
          />
        </div>
        <div className="button flex-none mt-4">submit</div>
      </div>
      <LeaderBoard classname="absolute top-20 right-10 pr-20 bg-zinc-950 rounded-md hind-siliguri-regular" />
    </div>
  );
};

export default Page;
