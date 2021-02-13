import { parseCookies } from "nookies";
import React, { useEffect, useRef } from "react";
import UserRoles from "../components/UserRoles";
import baseUrl from "../helpers/baseUrl";

function account({ orders }) {
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  const orderCardRef = useRef(null);

  useEffect(() => {
    M.Collapsible.init(orderCardRef.current);
  }, []);

  const OrderHistory = () => {
    return (
      <ul className="collapsible" ref={orderCardRef}>
        {orders.map((item, index) => (
          <li key={item._id}>
            <div className="collapsible-header">
              <i className="material-icons">folder</i>
              {item.createdAt}
            </div>
            <div className="collapsible-body">
              <h5>Total: ₹ {item.total}</h5>
              {item.products.map((pitem) => (
                <h6 key={pitem._id}>
                  {pitem.product.name} &times; {pitem.quantity}
                </h6>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container">
      <div
        className="center-align white-text"
        style={{
          backgroundColor: "#1565c0",
          marginTop: "10px",
          padding: "3px",
        }}
      >
        <h4>{user.name}</h4>
        <h4>{user.email}</h4>
      </div>

      {orders.length === 0 ? (
        <div className="center-align container">
          <h5>You have no order history</h5>
        </div>
      ) : (
        <>
          <h3>Order History</h3>
          <OrderHistory />
        </>
      )}
      {user.role === "root" && <UserRoles />}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    const { res } = context;
    res.writeHead(302, { Location: "/login" });
    res.end();
  }

  const res = await fetch(`${baseUrl}/api/orders`, {
    method: "GET",
    headers: { Authorization: token },
  });
  const orders = await res.json();

  if (orders.error) {
    return { props: { error: orders.error } };
  }
  return { props: { orders } };
}

export default account;
