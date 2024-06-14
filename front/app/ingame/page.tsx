import Link from "next/link";

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
      <div>Leaderboard</div>
      <div>
        {users.map((user, index) => {
          const { username, score } = user;
          const line = "" + index + ". " + username + " - " + score;
          return <div>{line}</div>;
        })}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <Link className="absolute top-10 left-10 button" href="/">
        quit
      </Link>
      <div className="">
        <div>Find the x if 2x = 10.</div>
        <textarea />
        <div className="button flex-none"> submit </div>
      </div>
      <LeaderBoard classname="absolute top-20 right-10" />
    </div>
  );
};

export default Page;
