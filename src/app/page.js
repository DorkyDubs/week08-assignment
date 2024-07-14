import Image from "next/image";
import { dbConnect } from "@/utils/fetchdata";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other

function generateMetadata({ params }) {
  return {
    title: `The Best Topics Board`,
    description: `See what users have to say about anything`,
  };
}

export default async function Home() {
  const db = dbConnect();

  await db.query(`CREATE TABLE IF NOT exists
   
      categories (
        id bigint primary key generated always as identity,
        category_name text unique,
        no_of_posts bigint)`);
  //  ! declare here so can be table is built when request goes in later. table exists now though so could delete tbf, but left here for marking purposes
  async function handleSubmit(formdata) {
    "use server";
    const db = dbConnect();
    const categoryName = formdata.get("category-name");
    const firstLetter = categoryName.charAt(0);
    const remainingLetters = categoryName.substring(1);
    const firstLetterCap = firstLetter.toUpperCase();
    const cappedCategoryName = firstLetterCap + remainingLetters;
    // Need to put data into database

    await db.query(
      `INSERT INTO categories (category_name, no_of_posts) VALUES ($1,$2)`,
      [cappedCategoryName, 0]
    );
    // await db.query(`INSERT INTO ${params.post} (username,comment) VALUES ($1,$2)`, [
    //     commentUsername,
    //     commentText,
    //   ]);//! this bit to update like count and no_of_posts cont

    revalidatePath(`/`);
    redirect(`/`);
  }
  const data = (await db.query(`SELECT * from categories`)).rows;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center content-center pt-[40px] border-t-4 border-teal-400 border-dotted">
        <div className=" flex flex-row flex-wrap content-center items-center ml-[50px] font-extrabold text-2xl">
          {data.map((data) => (
            <div
              key={data.id}
              className=" w-[15rem] h-[6rem] text-center   object-centerjustify-center pt-[10px] mt-[30px] m-[5px] text-white"
            >
              <Link href={`${data.category_name}`}>{data.category_name}</Link>{" "}
              <br />
              <Link href={`${data.category_name}`}>
                {" "}
                Posts: {data.no_of_posts}{" "}
              </Link>
              {/*//? yes this s is a duplicate, it's so each part can be clicked to go there. It's split incase they need to stack when styling */}
            </div>
          ))}
        </div>
        <div className="flex flex-column text-center pt-[3rem]">
          <form action={handleSubmit} className="pb-[100px] ">
            <label htmlFor="category-name">New Category: :</label>
            <div>
              <input
                className="text-slate-900"
                type="text"
                id="category-name"
                name="category-name"
                required
                placeholder="Enter New Category"
              />
            </div>
            <button
              className="border-solid border-2 border-sky-500"
              type="submit"
            >
              Submit New Category
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
