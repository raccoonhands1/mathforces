"use client";
import { useUser } from "@/provider/user.provider";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user, setUser } = useUser();
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <div className="h-[200px] flex flex-col justify-between items-center border-white border-[1px] rounded-md p-5">
        Mathforces
        <input
          className="text-black"
          onChange={(e) => setUser({ username: e.target.value })}
          value={user?.username}
          placeholder="Enter your username"
        />
        <Link className="button" href="/ingame">
          Join the battle
        </Link>
      </div>
    </div>
  );
}
