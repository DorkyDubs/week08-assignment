import Image from "next/image";
import { dbConnect } from "@/utils/fetchdata";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>catgories go here</h1>

        <div>
          {data.map((data) => (
            <li key={data.id} className="">
              <Link href={`${data.category_name}`}>{data.category_name}</Link>{" "}
              <Link href={`${data.category_name}`}>
                {" "}
                Posts: {data.no_of_posts}{" "}
              </Link>
              {/*//? yes this s is a duplicate, it's so each part can be clicked to go there. It's split incase they need to stack when styling */}
            </li>
          ))}
        </div>

        <div>
          <form action={handleSubmit}>
            <label htmlFor="category-name">New Category: :</label>
            <input
              className="text-slate-900"
              type="text"
              id="category-name"
              name="category-name"
              required
              placeholder="Enter New Category"
            />
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
