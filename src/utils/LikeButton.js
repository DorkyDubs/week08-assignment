import { dbConnect } from "./fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function LikeButton(nameTable, idData, path) {
  async function handleSubmit(formdata) {
    "use server";
    const db = dbConnect();

    const currentComments = await db.query(
      `SELECT likes FROM ${nameTable.nameTable} WHERE id =  ${nameTable.idData} `
    );
    const wrangledLikes = Number(currentComments.rows[0].likes) + 1;
    await db.query(
      `UPDATE ${nameTable.nameTable} SET likes = ($1) WHERE id = ${nameTable.idData}`,
      [wrangledLikes]
    );
    revalidatePath(`${nameTable.path}`);
    redirect(`${nameTable.path}`);
  }

  return (
    <>
      {" "}
      <form action={handleSubmit}>
        <button className="border-solid border-2 border-green-500">Like</button>
      </form>
    </>
  );
}
