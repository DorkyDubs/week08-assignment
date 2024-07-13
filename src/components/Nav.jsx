import Link from "next/link";

export default async function Nav() {
  return (
    <>
      <Link href="/">Home</Link>
      {/* 
//!Want to import and map up to 5 Topics with the most posts */}

      <Link href=""> All Topics</Link>
    </>
  );
}
