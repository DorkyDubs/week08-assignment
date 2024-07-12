import { dbConnect } from "./fetchdata";

export async function handleDelete(postId, nameTable) {
  "use server";
  const db = dbConnect();
  await db.query(`DELETE FROM ${nameTable} WHERE id ='${postId}`);
}
