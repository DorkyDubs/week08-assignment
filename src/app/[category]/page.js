import { dbConnect } from "@/utils/fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
//we need some nave sorted
//need some query strings to sort the data asc and desc

export default async function postsPage({ params }) {
  //? herre need ot get data from database, filter by id
  //? handle submit for post form
  const db = dbConnect();

  async function handleSubmit(formdata) {
    "use server";

    const postText = formdata.get("post-text");
    const postUsername = formdata.get("post_username");

    // Need to put data into database
    const db = dbConnect();
    await db.query(
      `INSERT INTO ${params.post} (username,comment) VALUES ($1,$2)`,
      [postUsername, postText]
    );
    // await db.query(`INSERT INTO ${params.post} (username,comment) VALUES ($1,$2)`, [
    //     commentUsername,
    //     commentText,
    //   ]);//! this bit to update like count and no_of_posts cont

    revalidatePath(`/${params.category}/${params.post}`);
    redirect(`/${params.category}/${params.post}`);
  }
  const data = (await db.query(`SELECT * FROM ${params.post} `)).rows;

  return (
    <>
      <p> all them posts</p>
      {/* //! and display form to add a post that are connected to database columns by names (in input) */}
      here we need
    </>
  );
}
