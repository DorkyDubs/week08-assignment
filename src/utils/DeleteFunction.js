import { dbConnect } from "./fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import { addTableDigits } from "./addTableDigits";
export default function DeleteButton(nameTable, idData, path, isPost) {
  async function handleSubmit() {
    "use server";
    const db = dbConnect();
    console.log(nameTable.idData);
    const tableId = await addTableDigits(nameTable.idData);
    const postNumber = Number(nameTable.idData);
    const postTableName = nameTable.nameTable + tableId;

    await db.query(
      `DELETE FROM ${nameTable.nameTable} WHERE id = ${nameTable.idData} RETURNING *`
    );
    const currentPosts = await db.query(
      `SELECT no_of_posts FROM categories WHERE category_name =  '${nameTable.nameTable}' `
    );
    const wrangledPostCount = Number(currentPosts.rows[0].no_of_posts) - 1;
    await db.query(
      `UPDATE categories SET no_of_posts = ($1) WHERE category_name = '${nameTable.nameTable}'`,
      [wrangledPostCount]
    );

    if (nameTable.isPost === 1) {
      await db.query(`DROP ${postTableName}`);
    }

    revalidatePath(`/${nameTable.path}`);
    redirect(`/${nameTable.path}`);
  }
  return (
    <>
      <form action={handleSubmit}>
        {" "}
        <button className="border-solid border-2 border-red-500">Delete</button>
      </form>
    </>
  );
}
