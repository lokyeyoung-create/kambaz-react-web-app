import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>Lok Ye Young, 202610_1</h2>
      <h2>Arav Goyal, 202610_1</h2>
      <p>This is my lab and Kambaz project.</p>
      <Link href="/Labs" id="wd-lab-link">
        Click here to get to the Labs
      </Link>
      <br></br>
      <Link href="/Account/Signin" id="wd-kambaz-link">
        Click here to get to the Kambaz
      </Link>
      <br></br>
      <Link
        href="https://github.com/lokyeyoung-create/kambaz-react-web-app"
        id="wd-github-link"
      >
        Click here to get to the Source Code
      </Link>
    </div>
  );
}
