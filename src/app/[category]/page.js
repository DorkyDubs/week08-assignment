import { dbConnect } from "@/utils/fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import Link from "next/link";
import Image from "next/image";
//we need some nave sorted
//need some query strings to sort the data asc and desc

export default async function postsPage({ params }) {
  const db = dbConnect();
  //!This method creates a lot of tables. it isn't neccesary but had a desire to abuse supabase. The alternative would be to have three tables : category, posts and comments. For filtering purposes each post could be linked to category through a foriegn key denoting the category id, and likewise each comment could have a key connecting it to the posts id. Having already done this in a previous assignment decided to tackle the issue of directing to different tables for one-to-many relationships, but included the reference lines when creating tables so joins can be implemented if desired.

  await db.query(`CREATE TABLE IF NOT EXISTS ${params.category} (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    post_text TEXT NOT NULL,
    category TEXT,
    likes INT,
    no_of_comments INT,
    img_src TEXT,
    category_id INT REFERENCES categories (id))`);
  console.log(params.category);
  async function handleSubmit(formdata) {
    "use server";

    const postText = formdata.get("post-text");
    const postUsername = formdata.get("post-username");
    if (formdata.get("post-img" != undefined)) {
      const postImg = formdata.get("post-img");
    } else {
      const postImg = "https://picsum.photos/400/300";
    } //!can implement placeholder

    // Need to put data into database
    const db = dbConnect();
    const currentPosts = (
      await db.query(`SELECT * FROM categories WHERE id = 3 `)
    ).rows; //!dunno if needed firgure out in testing
    await db.query(
      `INSERT INTO ${params.category} (username,post_text,category,likes, no_of_comments) VALUES ($1,$2,$3,$4,$5)`,
      [postUsername, postText, params.category, 0, 0]
    );

    console.log(currentPosts);
    // await db.query(`INSERT INTO ${params.post} (username,comment) VALUES ($1,$2)`, [
    //     commentUsername,
    //     commentText,
    //   ]);//! this bit to update like count and no_of_posts cont

    revalidatePath(`/${params.category}`);
    redirect(`/${params.category}`);
  }
  const data = (await db.query(`SELECT * FROM ${params.category} `)).rows;

  return (
    <>
      <h1>{params.category}</h1>

      <div>
        <form action={handleSubmit}>
          <label htmlFor="username" required>
            Username:{" "}
          </label>
          <input
            className="text-slate-900"
            type="text"
            id="post-username"
            name="post-username"
            required
            placeholder="Select a username"
          />{" "}
          {/* <div>
            {" "}
            <label htmlFor="post-img" required>
              Image URL:{" "}
            </label>
            <input
              className="text-slate-900"
              type="text"
              id="post-img"
              name="post-img"
              placeholder="Unsplash image link"
            />
          </div> */}
          <div>
            <label htmlFor="post-text" required>
              Post:{" "}
            </label>
            <br />
            <textarea
              className=" h-[12rem] text-slate-900 "
              type="text"
              id="post-text"
              name="post-text"
              required
              placeholder="Write a post"
            />
          </div>
          <button
            className="border-solid border-2 border-sky-500"
            type="submit"
          >
            Submit Post
          </button>
        </form>
      </div>

      <div>
        <h3> posts</h3>
        {data.map((data) => (
          <li key={data.id} className="">
            {/* <Image
              src="data.img_src"
              alt="user image"
              width={400}
              height={300}
            /> */}
            <h3>Username: {data.username}</h3>
            <h4>{data.post_text}</h4>
            <h5>Comments {data.no_of_comments}</h5>
            <h5> Likes: {data.likes}</h5>
            <Link href={`${params.category}/${data.id}`}>Read comments</Link>
          </li>
        ))}
      </div>
    </>
  );
}
