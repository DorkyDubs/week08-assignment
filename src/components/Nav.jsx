import Link from "next/link";
import { dbConnect } from "@/utils/fetchdata";
export default async function Nav() {
  const db = dbConnect();
  const topTopics = (
    await db.query(
      `SELECT category_name FROM categories ORDER BY no_of_posts DESC LIMIT 5`
    )
  ).rows;
  console.log(topTopics);
  return (
    <>
      <div className="flex flex-row justify-between w-100vw text-yellow-300 p pl-[20px] pr-[20px]">
        <Link href="/">Home</Link>{" "}
        {topTopics.map((data, index) => (
          <div key={index} className="">
            {" "}
            <Link href={`/${data.category_name}`}>
              {data.category_name}
            </Link>{" "}
          </div>
        ))}{" "}
        <Link href="/"> All Topics</Link>
      </div>
    </>
  );
}
