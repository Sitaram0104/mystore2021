import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";

function Navbar() {
  const router = useRouter();
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";

  const isActive = (route) => {
    if (route === router.pathname) {
      return "active";
    }
    return "";
  };

  return (
    <nav>
      <div className="nav-wrapper #1565c0 blue darken-3">
        <Link href="/">
          <a className="brand-logo left">MyStore</a>
        </Link>
        <ul id="nav-mobile" className="right ">
          <li className={isActive("/cart")}>
            <Link href="/cart">
              <a>Cart</a>
            </Link>
          </li>
          {user && (user.role !== "root" || user.role !== "admin") && (
            <li className={isActive("/create")}>
              <Link href="/create">
                <a>Create</a>
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li className={isActive("/account")}>
                <Link href="/account">
                  <a>Account</a>
                </Link>
              </li>
              <li className={isActive("/logout")}>
                <button
                  className="btn"
                  onClick={() => {
                    destroyCookie(null, "token");
                    destroyCookie(null, "user");
                    router.push("/");
                  }}
                >
                  logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={isActive("/login")}>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </li>
              <li className={isActive("/signup")}>
                <Link href="/signup">
                  <a>Signup</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
