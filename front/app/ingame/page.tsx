"use client";

import useSocket from "@/hooks/useSocket";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const socket = useSocket("http://localhost:5000");
  const [scores, setScores] = useState<User[]>([]);
  const [gameId, setGameId] = useState();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");

        socket.emit("register", { username: "YourUsernameHere" });
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
    }
  }, [socket]);

  const sendScore = () => {
    const score = Math.floor(Math.random() * 100);
    console.log("sending score", score);
    socket?.emit("receive_answer", { score, game_id: gameId });
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <Link className="absolute top-10 left-10 button" href="/">
        quit
      </Link>
      <div className="">
        <div>Find the x if 2x = 10.</div>
        <textarea />
        <div onClick={sendScore} className="button flex-none">
          {" "}
          submit{" "}
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
