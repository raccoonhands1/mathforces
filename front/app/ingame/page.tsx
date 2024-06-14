import Link from "next/link";

const Page = () => {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <Link className="absolute top-10 left-10 button" href="/">
        quit
      </Link>
      <div className="">
        <div>Find the x if 2x = 10.</div>
        <textarea />
      </div>
    </div>
  );
};

export default Page;
