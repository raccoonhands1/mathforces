import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <div className="h-[200px] flex flex-col justify-between items-center border-white border-[1px] rounded-md p-5">
        Mathforces
        <Link className="button" href="/ingame">
          Join the battle
        </Link>
      </div>
    </div>
  );
}
