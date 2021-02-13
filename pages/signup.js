import Link from "next/link";
import { useState } from "react";
import baseUrl from "../helpers/baseUrl";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
    } else if (res2.message) {
      M.toast({ html: res2.message, classes: "green" });
      router.push("/login");
    }
  };

  return (
    <form
      className="container card authcard center-align"
      onSubmit={(e) => userSignup(e)}
    >
      <h3>SignUP</h3>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        SIGNUP
        <i className="material-icons right">forward</i>
      </button>
      <Link href="/login">
        <a>
          <h5>Already have an account?</h5>
        </a>
      </Link>
    </form>
  );
}
