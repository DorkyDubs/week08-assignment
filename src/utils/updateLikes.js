import { dbConnect } from "./fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
export async function updateLikes(nameTable, idNo, path) {
  //maybe move these out to a Util? params for table, id and
  "use server";
  const db = dbConnect();
  const currentLikes = await db.query(
    `SELECT likes FROM ${nameTable} WHERE id = '${idNo}'`
  );
  const wrangledLikeCount = Number(currentLikes.rows[0].likes) + 1;
  db.query(`UPDATE ${nameTable} SET likes = ($1) WHERE id = '${idNo}'`, [
    wrangledLikeCount,
  ]);
  revalidatePath(`/${path}`); //!maybe move the refreshinto function in util as well?
  redirect(`/${path}`); //! al
}
