import { dbConnect } from "@/utils/fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import Link from "next/link";
// import Image from "next/image";

//we need some nave sorted
import DeleteButton from "@/utils/DeletePostFunction";
import LikeButton from "@/utils/LikeButton";

//need some query strings to sort the data asc and desc
export async function generateMetadata({ params }) {
  return {
    title: `${params.category} Posts`,
    description: `See what users have to say about ${params.category} `,
  };
}

export default async function postsPage({ params }) {
  const db = dbConnect();

  //!This method creates a lot of tables. it isn't neccesary but had a desire to abuse supabase. The alternative would be to have three tables : category, posts and comments. For filtering purposes each post could be linked to category through a foriegn key denoting the category id, and likewise each comment could have a key connecting it to the posts id. Having already done this in a previous assignment decided to tackle the issue of directing to different tables for one-to-many relationships, but included the reference lines when creating tables so joins can be implemented if desired.

  await db.query(`CREATE TABLE IF NOT EXISTS ${params.category} (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    post_text TEXT NOT NULL,
    category TEXT,
    title TEXT,
    likes INT,
    no_of_comments INT,
    img_src TEXT,
    security VARCHAR(32),
    category_id INT REFERENCES categories (id))`);

  // async function handleLike(table, id) {
  //   updateLikes(table, id);
  //   revalidatePath(`/${params.category}`); //!maybe move the refreshinto function in util?
  //   redirect(`/${params.category}`);
  // }

  // async function doDelete(table, id) {
  //   console.log(table, id);
  //   handleDelete(table, id);

  //   revalidatePath(`/`); //!maybe move the refreshinto function in util as well?
  //   redirect(`/`); //! also implement a password function
  // }

  async function handleSubmit(formdata) {
    "use server";

    const postText = formdata.get("post-text");
    const postUsername = formdata.get("post-username");
    const postTitle = formdata.get("post-title");
    const sec = formdata.get("wordpass");
    if (formdata.get("post-img" != undefined)) {
      const postImg = formdata.get("post-img");
    } else {
      const postImg = "https://picsum.photos/400/300";
    } //!can implement placeholder

    // Need to put data into database
    const db = dbConnect();

    await db.query(
      `INSERT INTO ${params.category} (username,post_text,category,likes, no_of_comments,security,title) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [postUsername, postText, params.category, 0, 0, sec, postTitle]
    );
    const currentPosts = await db.query(
      `SELECT no_of_posts FROM categories WHERE category_name = '${params.category}' `
    ); //!dunno if needed firgure out in testing
    const wrangledPostCount = Number(currentPosts.rows[0].no_of_posts) + 1;
    await db.query(
      `UPDATE categories SET no_of_posts = ($1) WHERE category_name = '${params.category}'`,
      [wrangledPostCount]
    );
    console.log(wrangledPostCount);

    revalidatePath(`/${params.category}`);
    redirect(`/${params.category}`);
  }
  const data = (await db.query(`SELECT * FROM ${params.category} `)).rows;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between  pt-[100px] border-t-4">
        <h1>{params.category}</h1>

        <div className="object-center w-[16rem] mr-[60px] border-2 mb-[1rem] border-cyan-500">
          <form
            action={handleSubmit}
            className="object-center
          "
          >
            <label htmlFor="username" className="" required>
              Username:{" "}
            </label>
            <input
              className="text-slate-900 w-[15.7rem]"
              type="text"
              id="post-username"
              name="post-username"
              required
              placeholder="Select a username"
            />{" "}
            <br />
            <label htmlFor="post-title" required className="pl-[0px]">
              Title:{" "}
            </label>
            <input
              className="  text-slate-900 w-[15.7rem]"
              type="text"
              id="post-title"
              name="post-title"
              required
              placeholder="Title"
            />
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
            <div className="">
              <label htmlFor="post-text" required>
                Post:{" "}
              </label>
              <br />
              <textarea
                className=" h-[12rem] w-[15.7rem] text-slate-900 "
                type="text"
                id="post-text"
                name="post-text"
                required
                placeholder="Write a post"
              />
            </div>
            <div>
              <label htmlFor="pass">Passcode: </label>

              <br />
              <input
                className="text-slate-900 w-[15.7rem]"
                type="password"
                id="user-pass"
                name="wordpass"
                required
                placeholder="Enable Deletion"
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

        <section className="">
          {/* ^ for all post/ posts box container */}

          {data.map((data) => (
            <div
              key={data.id}
              className=" border-yellow-100 border-2 border-solid mr-[60px]
              w-[16rem]"
            >
              {/* ^ for each post */}

              {/* <Image
              src="data.img_src"
              alt="user image"
              width={400}
              height={300}
            /> */}
              <h3 className="bg-yellow-100 text-black font-serif border-2 border-yellow-100 w-[15.8rem]">
                Username: {data.username}
              </h3>
              <h3 className=" w-[15.8rem] font-semibold border-ridge border-2 border-groove border-cyan-300 bg-cyan-300 text-black">
                Title: {data.title}
              </h3>
              <h4 className=" h-auto w-[15.8rem] text-center object-center pt-[1rem] text-black bg-gray-200 font-bold text-[1.8rem] pb-[1rem]">
                {data.post_text}
              </h4>
              <div className="flex flex-row justify-between border-1 border-yellow-200">
                <h5>Comments: {data.no_of_comments}</h5>

                <h5> Likes: {data.likes}</h5>
              </div>
              <div className="flex flex-row justify-between ">
                <Link href={`/${params.category}/${data.id}`}>
                  {" "}
                  See comments
                </Link>
                <LikeButton
                  idData={data.id}
                  nameTable={params.category}
                  path={params.category}
                />{" "}
              </div>
              <DeleteButton
                nameTable={params.category}
                idData={data.id}
                path={params.category}
                isPost={1}
                //! neededed to say if is post or comment.if is post, will run table drop on delete
              />

              {/* <form
              action={handleLike(params.category, data.id, params.category)}
            >
              <button className="border-solid border-2 border-green-500">
                Like
              </button>
            </form>*/}
            </div>
          ))}
        </section>
      </main>{" "}
    </>
  );
}
