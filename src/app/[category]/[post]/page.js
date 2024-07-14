import { dbConnect } from "@/utils/fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import { addTableDigits } from "@/utils/addTableDigits";
import DeleteButton from "@/utils/DeleteCommentFunction";
import LikeButton from "@/utils/LikeButton";
//we need some nave sorted
//need some query strings to sort the data asc and desc
export async function generateMetadata({ params }) {
  const db = dbConnect();
  const posts = (
    await db.query(`SELECT * FROM ${params.category} WHERE id = ${params.post}`)
  ).rows;
  const post = posts[0];

  return {
    title: ` ${post.username}'s Post about ${params.Title}`,
    description: `See what  ${post.username} and other usershave to say about ${params.category}`,
  };
}
//! to do : get posts data, display data

export default async function commentsPage({ params }) {
  //? herre need ot get data from database, filter by id
  //? handle submit for comemnt form
  const db = dbConnect();
  const tableId = await addTableDigits(params.post); //? standardizes the length of the Id number in the tables. Not hugely practical at this scale.
  const postNumber = Number(params.post);
  const tableName = params.category + tableId;
  const commentPath = `/${params.category}/${params.post}`;
  if (isNaN(postNumber)) {
    return <h3>404. Page not here.</h3>;
  } else {
    //! could just use ${params.category}${params.post} where necccesary but why not combine for later ease}
    await db.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  comment_text VARCHAR (150),
  category TEXT,
  likes INT
  )`);
    // post_id INT REFERENCES ${params.category} (id)//! breaks delete
    // async function handleLike(nameTable, postId) {
    //   //maybe move these out to a Util? params for table, id and refresh page. so path
    //   "use server";
    //   const db = dbConnect();
    //   const currentLikes = await db.query(
    //     `SELECT likes FROM ${nameTable} WHERE id = '${postId}'`
    //   );
    //   const wrangledLikeCount = Number(currentLikes.rows[0].likes) + 1;
    //   db.query(`UPDATE ${nameTable} SET likes = ($1) WHERE id = '${postId}'`, [
    //     wrangledLikeCount,
    //   ]);
    //   revalidatePath(`/${params.category}/${params.post}`);
    //   redirect(`/${params.category}/${params.post}`);
    // }

    // async function doDelete(formdata) {
    //   "use server";

    //   const postNo = Number(formdata.id);
    //   const routePath = `/${params.category}/${params.post}`;
    //   const db = dbConnect();
    //   await db.query(`DELETE FROM ${tableName} WHERE id ='${formdata.id}'`);
    //   revalidatePath(`/${params.category}/${params.post}`);
    //   redirect(`/${params.category}/${params.post}`);
    // }
    async function handleSubmit(formdata) {
      "use server";

      const commentText = formdata.get("comment-text");
      const commentUsername = formdata.get("comment-username");

      // Need to put data into database
      const db = dbConnect();
      await db.query(
        `INSERT INTO ${tableName} (username,comment_text,likes, category ) VALUES ($1,$2,$3,$4)`,
        [commentUsername, commentText, 0, params.category]
      );
      const currentComments = await db.query(
        `SELECT no_of_comments FROM ${params.category} WHERE id = ${params.post} `
      );
      const wrangledCommentCount =
        Number(currentComments.rows[0].no_of_comments) + 1;
      await db.query(
        `UPDATE ${params.category} SET no_of_comments = ($1) WHERE id = '${params.post}'`,
        [wrangledCommentCount]
      );

      revalidatePath(`/${params.category}/${params.post}`);
      redirect(`/${params.category}/${params.post}`);
    }

    // const postData = (
    //   await db.query(
    //     `SELECT * FROM ${params.category} WHERE id = '${postNumber}' `
    //   )
    // ).rows;
    const datas = (await db.query(`SELECT * FROM ${tableName} `)).rows;
    const postdata = (
      await db.query(
        `SELECT * FROM ${params.category} WHERE id = ${params.post}`
      )
    ).rows;
    const post = postdata[0];
    console.log(post);
    return (
      <>
        <main className="flex min-h-screen flex-col items-center justify-between  pt-[100px] border-t-4">
          <p> all them comments</p>
          {/* //! Want original post cotent here */}
          <div className="">
            <div>
              {" "}
              {post.username} speaks truth on {params.category}
            </div>
            <div> Claims &quot; {post.title} "</div>
            <h4 className="text-xl"> {post.post_text}</h4>
          </div>
          {/* //! and display form to add a comment that are connected to database
      columns by names (in input) */}
          <div className="flex flex-column">
            {" "}
            <form action={handleSubmit}>
              <div>
                {" "}
                <label htmlFor="comment-username">Username: :</label>
                <input
                  className="text-slate-900"
                  type="text"
                  id="comment-username"
                  name="comment-username"
                  required
                  placheholder="user ID"
                />{" "}
              </div>
              <div>
                <label htmlFor="comment-text">Post:</label>
                <input
                  className="text-slate-900"
                  type="text"
                  id="comment-text"
                  name="comment-text"
                  required
                  placheholder="Write post here"
                />
              </div>
              <button
                className="border-solid border-2 border-sky-500"
                type="submit"
              >
                submit comment
              </button>
            </form>
          </div>
          <section className="">
            {/* ^ for all comments */}
            {datas.map((data) => (
              <div key={data.id} className="">
                {/* ^ for each comment */}
                <h3>Username: {data.username}</h3>
                <h4>{data.post_text}</h4>
                <h5>Comments: {data.comment_text}</h5>
                <h7>Likes : {data.likes}</h7>
                {/* <form action={handleLike(tableName, data.id)}>
              <button className="border-solid border-2 border-green-500">
                Like
              </button>{" "}
            </form>*/}
                <LikeButton
                  idData={data.id}
                  nameTable={tableName}
                  path={commentPath}
                />
                <DeleteButton
                  cat={params.category}
                  postId={params.post}
                  nameTable={tableName}
                  idData={data.id}
                  path={commentPath}
                />
              </div>
            ))}
          </section>
        </main>
      </>
    );
  } //<-else close
} //<-default close
