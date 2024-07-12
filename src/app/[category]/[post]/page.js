import { dbConnect } from "@/utils/fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
//we need some nave sorted
//need some query strings to sort the data asc and desc
const db = dbConnect();
//! to do : get posts data, display data

export default async function commentsPage({ params }) {
  //? herre need ot get data from database, filter by id
  //? handle submit for comemnt form

  async function handleSubmit(formdata) {
    "use server";

    const commentText = formdata.get("comment-text");
    const commentUsername = formdata.get("comment_username");

    // Need to put data into database
    const db = dbConnect();
    await db.query(
      `INSERT INTO ${params.post} (username,comment) VALUES ($1,$2)`,
      [commentUsername, commentText]
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
      <p> all them comments</p>
      {/* //! and display form to add a comment that are connected to database
      columns by names (in input) */}
      <form action={handleSubmit}>
        <label htmlFor="comment_username">Username: :</label>
        <input
          className="text-slate-900"
          type="text"
          id="comment_username"
          name="comment_username"
          required
          placheholder="user ID"
        />{" "}
        <label htmlFor="comment-text">Post:</label>
        <input
          className="text-slate-900"
          type="text"
          id="comment-text"
          name="comment-text"
          required
          placheholder="Write post here"
        />
        <button className="border-solid border-2 border-sky-500" type="submit">
          submit comment
        </button>
      </form>
    </>
  );
}
