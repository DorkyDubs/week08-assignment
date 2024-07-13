import { dbConnect } from "./fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import { addTableDigits } from "./addTableDigits";
export default function DeleteButton(nameTable, idData, path, cat, postId) {
  async function handleSubmit(formdata) {
    "use server";
    const db = dbConnect();
    console.log(nameTable.idData);
    const tableId = await addTableDigits(nameTable.idData);
    const postNumber = Number(nameTable.idData);
    const postTableName = nameTable.nameTable + tableId;
    console.log(nameTable.cat);
    console.log(nameTable.postId);
    console.log(nameTable.path);
    await db.query(
      `DELETE FROM ${nameTable.nameTable} WHERE id = ${postNumber} RETURNING *`
    );
    const currentComments = await db.query(
      `SELECT no_of_comments FROM ${nameTable.cat} WHERE id =  ${nameTable.postId} `
    );
    const wrangledPostCount =
      Number(currentComments.rows[0].no_of_comments) - 1;
    await db.query(
      `UPDATE ${nameTable.cat} SET no_of_comments = ($1) WHERE id = ${nameTable.postId}`,
      [wrangledPostCount]
    );

    revalidatePath(`${nameTable.path}`);
    redirect(`${nameTable.path}`);
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
