import { dbConnect } from "./fetchdata";

export async function updateLikes(postId, nameTable) {
  //maybe move these out to a Util? params for table, id and
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
