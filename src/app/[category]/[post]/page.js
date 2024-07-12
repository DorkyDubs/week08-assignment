import { dbConnect } from "@/utils/fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import { addTableDigits } from "@/utils/addTableDigits";
//we need some nave sorted
//need some query strings to sort the data asc and desc

//! to do : get posts data, display data

export default async function commentsPage({ params }) {
  //? herre need ot get data from database, filter by id
  //? handle submit for comemnt form
  const db = dbConnect();
  const tableId = addTableDigits(params.post); //? standardizes the length of the Id number in the tables. Not hugely practical at this scale.

  const tableName = params.category + tableId;
  console.log(tableName); //! could just use ${params.category}${params.post} where necccesary but why not combine for later ease}
  await db.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  comment_text VARCHAR (150),
  category TEXT,
  likes INT,
  post_id INT REFERENCES ${params.category} (id))`);

  async function handleLike(postId, nameTable) {
    //maybe move these out to a Util? params for table, id and refresh page
    "use server";
    const db = dbConnect();
    const currentLikes = await db.query(
      `SELECT likes FROM ${nameTable} WHERE id = '${postId}'`
    );
    const wrangledLikeCount = Number(currentLikes.rows[0].likes) + 1;
    db.query(`UPDATE ${nameTable} SET likes = ($1) WHERE id = '${postId}'`, [
      wrangledLikeCount,
    ]);
  }

  async function handleDelete(postId, nameTable) {
    "use server";
    const db = dbConnect();
    await db.query(`DELETE FROM ${nameTable} WHERE id ='${postId}`);
  }
  async function handleSubmit(formdata) {
    "use server";

    const commentText = formdata.get("comment-text");
    const commentUsername = formdata.get("comment_username");

    // Need to put data into database
    const db = dbConnect();
    await db.query(
      `INSERT INTO ${tableName} (username,comment_text,likes, category, post_id) VALUES ($1,$2,$3,$4,$5)`,
      [commentUsername, commentText, 0, params.category, params.post]
    );
    const currentComments = await db.query(
      `SELECT no_of_comments FROM ${params.category} WHERE id = '${params.post}' `
    );
    const wrangledCommentCount =
      Number(currentComments.rows[0].no_of_comments) + 1;
    await db.query(
      `UPDATE ${params.category} SET no_of_comments = ($1) WHERE id = '${params.post}'`,
      [wrangledCommentCount]
    );
    console.log(wrangledCommentCount);
    // .rows; //!dunno if needed firgure out in testing

    // await db.query(`INSERT INTO ${params.post} (username,comment) VALUES ($1,$2)`, [
    //     commentUsername,
    //     commentText,
    //   ]);//! this bit to update like count and no_of_posts cont

    revalidatePath(`/${params.category}/${params.post}`);
    redirect(`/${params.category}/${params.post}`);
  }
  const postData = (
    await db.query(
      `SELECT * FROM ${params.category} WHERE id = '${params.post}' `
    )
  ).rows;
  const data = (await db.query(`SELECT * FROM ${tableName} `)).rows;
  return (
    <>
      <p> all them comments</p>
      {/* //! Want original post cotent here */}

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
      <section className="">
        {/* ^ for all comments */}
        {data.map((data) => (
          <div key={data.id} className="">
            {/* ^ for each comment */}
            <h3>Username: {data.username}</h3>
            <h4>{data.post_text}</h4>
            <h5>Comments: {data.comment_text}</h5>
            <h7>Likes : {data.likes}</h7>
          </div>
        ))}
      </section>
    </>
  );
}
