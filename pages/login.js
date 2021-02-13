import Link from "next/link";
import { useState } from "react";
import baseUrl from "../helpers/baseUrl";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
    } else {
      M.toast({ html: res2.message, classes: "green" });
      cookie.set("token", res2.token);
      cookie.set("user", res2.user);
      router.push("/account");
    }
  };

  return (
    <form
      className="container card authcard center-align"
      onSubmit={(e) => loginHandler(e)}
    >
      <h3>Login</h3>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="btn waves-effect waves-light #1565c0 blue darken-3"
        type="submit"
      >
        LOGIN
        <i className="material-icons right">forward</i>
      </button>
      <Link href="/signup">
        <a>
          <h5>Don't have an account?</h5>
        </a>
      </Link>
    </form>
  );
}

export async function getServerSideProps(context) {
  const cookie = parseCookies(context);
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  if (user) {
    const { res } = context;
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}
