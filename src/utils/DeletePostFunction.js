import { dbConnect } from "./fetchdata";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; //!<<this file, not other
import { addTableDigits } from "./addTableDigits";
export default function DeleteButton(nameTable, idData, path) {
  async function handleSubmit(formdata) {
    "use server";
    const db = dbConnect();
    console.log(nameTable.idData);
    const tableId = await addTableDigits(nameTable.idData);
    const postNumber = Number(nameTable.idData);
    const postTableName = nameTable.nameTable + tableId;

    const secretCode = formdata.get("wordpass");

    const codeCheck = (
      await db.query(
        `SELECT security FROM ${nameTable.nameTable} WHERE id = ${nameTable.idData}`
      )
    ).rows;
    console.log(codeCheck[0].security);
    console.log(secretCode);

    if (secretCode === codeCheck[0].security) {
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
      console.log(nameTable.isPost);

      await db.query(`DROP TABLE IF EXISTS ${postTableName}`);
      revalidatePath(`/${nameTable.path}`);
      redirect(`/${nameTable.path}`);
    }
  }

  return (
    <>
      <form action={handleSubmit} className="flex flex-row justify-between">
        {" "}
        <button className="border-solid border-2 border-red-500 ">
          Delete
        </button>
        <div className="">
          <label htmlFor="pass" required className="text-[10px]"></label>

          <input
            className="text-slate-900 w-[10rem] object-center border-white border-2"
            type="password"
            id="user-pass"
            name="wordpass"
            required
            placeholder="Pass please:"
          />
        </div>
      </form>
    </>
  );
}
