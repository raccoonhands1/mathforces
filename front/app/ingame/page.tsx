"use client";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { addStyles, EditableMathField } from "react-mathquill";

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles();

import useSocket from "@/hooks/useSocket";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/provider/user.provider";

interface User {
  username: string;
  score: number;
}

// TODO add provider that stores the username and check
// username here to display different color bar.
const LeaderBoard = ({
  users,
  classname,
}: {
  users: User[];
  classname?: string;
}) => {
  const maxScore = users[0]?.score;
  console.log(users, "users");
  return (
    <div className={classname}>
      <h1>Leaderboard</h1>
      <div>
        <AnimatePresence>
          {users.map(({ username, score }, index) => (
            <motion.div
              key={username}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              layout
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",

                alignItems: "center",
                padding: "10px",
                margin: "5px 0",
                backgroundColor: "lightblue",
                borderRadius: "5px",
              }}
            >
              <span className="w-[50px]">{username.slice(0, 3)}</span>
              <div className="w-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / maxScore) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: "20px",
                    backgroundColor: "blue",
                  }}
                />
              </div>
              <span className="w-[50px]">{score}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Page = () => {
  const [latex, setLatex] = useState("");
  const { user } = useUser();
  const renderPlaceholder = (text: string) => (
    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
      {text}
    </div>
  );
  const socket = useSocket("http://localhost:5000");
  const [scores, setScores] = useState<User[]>([]);
  const [gameId, setGameId] = useState();
  const [question, setQuestion] = useState<{
    prompt: string;
    question_id: number;
  } | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");

        socket.emit("register", user);
      });

      socket.on("score_update", (data) => {
        console.log(data.scores);
        const users: User[] = Object.entries(data.scores).map(
          ([username, score], index) => {
            return {
              username,
              score: score as number,
            };
          }
        );
        const sorted = [...users].sort((a, b) => b.score - a.score);
        setScores(sorted);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
      socket.on("game_started", (data) => {
        const { game_id } = data;
        console.log(game_id, "gameId");
        setGameId(game_id);
      });
      socket.on("new_question", ({ question }) => {
        const { question: prompt, question_id } = question;
        setQuestion({ question_id, prompt });
        console.log(prompt, "is question", question_id, "is question_id");
      });
    }
  }, [socket]);

  const sendScore = () => {
    const score = Math.floor(Math.random() * 100);
    console.log("sending answer", latex);
    socket?.emit("receive_answer", {
      game_id: gameId,
      answer: latex,
      question_id: question?.question_id,
    });
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <Link
        // className="absolute top-10 left-10 button"
        href="/"
        className="absolute top-10 left-10 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:border-red-500 hover:text-red-500"
      >
        quit
      </Link>
      <div className="flex flex-col items-center space-y-6 w-full px-4">
        <div className="relative w-60 h-24">{question?.prompt}</div>
        <div className="relative w-60 h-24">
          {/* {latex === "" && renderPlaceholder("Type Here")}
          <EditableMathField
            className="bg-black border-2 rounded-md w-full h-full p-4 text-center text-xl"
            latex={latex}
            onChange={(mathField) => {
              setLatex(mathField.latex());
            }}
          /> */}
          <textarea
            className="text-black"
            onChange={(e) => setLatex(e.target.value)}
          >
            {latex}
          </textarea>
        </div>
        <div
          onClick={sendScore}
          className="button flex-none mt-4 bg-black border border-gray-300 rounded text-gray-700 hover:border-green-500 hover:text-green-500"
        >
          submit
        </div>
      </div>
      <LeaderBoard
        users={scores}
        classname="absolute top-20 right-10 h-[500px] w-[300px]"
      />
    </div>
  );
};

export default Page;
