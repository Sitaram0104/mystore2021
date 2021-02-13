import { destroyCookie, parseCookies } from "nookies";
import React, { useState } from "react";
import baseUrl from "../helpers/baseUrl";
import { useRouter } from "next/router";
import Link from "next/link";
import StripeCheckout from "react-stripe-checkout";

function cart({ error, products }) {
  console.log(error, products);
  const router = useRouter();
  const { token } = parseCookies();
  const [cartProducts, setCartProducts] = useState(products);

  if (!token) {
    return (
      <div className="center-align">
        <h3>please login to view your Cart</h3>
        <Link href="/login">
          <a>
            <button className="btn #1565c0 blue darken-3">Login Page</button>
          </a>
        </Link>
      </div>
    );
  }
  if (error) {
    M.toast({ html: error, classes: "red" });
    // destroyCookie(null, "user");
    // destroyCookie(null, "token");
    // router.push("/login");
  }

  const handleRemove = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ productId: pid }),
    });
    const res2 = await res.json();
    setCartProducts(res2);
  };

  const CartItems = () => {
    return (
      <>
        {cartProducts.map((item, index) => {
          return (
            <div key={index} style={{ display: "flex", margin: "20px" }}>
              <img
                src={item.product.mediaUrl}
                alt={item.product.name}
                style={{ width: "30%" }}
              />
              <div style={{ marginLeft: "20px" }}>
                <h6>{item.product.name}</h6>
                <h6>
                  {item.quantity} &times; ₹ {item.product.price}
                </h6>
                <button
                  className="btn red"
                  onClick={() => handleRemove(item.product._id)}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const handleCheckout = async (paymentInfo) => {
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ paymentInfo }),
    });
    const res2 = await res.json();
    if (res2.message) {
      M.toast({ html: res2.message, classes: "green" });
      router.push("/");
    } else {
      M.toast({ html: res2.error, classes: "red" });
    }
  };

  const TotalPrice = () => {
    const price = cartProducts.reduce((acc, crr) => {
      return acc + crr.quantity * crr.product.price;
    }, 0);

    return (
      <div
        className="container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h5>total ₹ {price}</h5>
        {cartProducts.length > 0 && (
          <StripeCheckout
            name="My Store"
            amount={price * 100}
            image={
              cartProducts.length > 0 ? cartProducts[0].product.mediaUrl : ""
            }
            currency="INR"
            shippingAddress={true}
            billingAddress={true}
            zipCode={true}
            stripeKey="pk_test_51IK2McI77VMxi7UkOsGFUxmC3mnWhdKI7E1DslTuCfjzcGL7TffWFJb2v3Gl8fEdstAaYtKCd7E3wlhxKt3wV0rE00UbPrJdqY"
            token={(paymentInfo) => handleCheckout(paymentInfo)}
          >
            <button className="btn">Checkout</button>
          </StripeCheckout>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div>
        <CartItems />
        {cartProducts.length > 0 ? (
          <TotalPrice />
        ) : (
          <div className="container">
            <h3>Cart is Empty</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let er;
  try {
    const { token } = parseCookies(context);
    if (!token) {
      return { props: { products: [] } };
    }
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "GET",
      headers: { Authorization: token },
    });

    // const products = await res.json();
    const products = JSON.parse(JSON.stringify(cart.products));
    er = { res, products };
    return { props: { products, er } };

    // const cookie = parseCookies(context);
    // const user = cookie.user ? JSON.parse(cookie.user) : "";
    // initDB();
    // const user2 = await User.findOne({ email: user.email });
    // er = { user2 };
    // const cart = await Cart.findOne({ user: user2._id });
    // // .populate(
    // //   "products.product"
    // // );
    // er = { user2, cart };
    // const pa = cart.products.map(
    //   async (item) => await item.populate("product")
    // );
    // er = { user2, cart, pa };
    // // const products = JSON.parse(JSON.stringify(cart.products));
    // const products = JSON.parse(JSON.stringify(pa));
    // er = { user2, cart, pa, products };
    // if (products.error) {
    //   return { props: { er: products.error } };
    // }
    // return { props: { products } };
  } catch (error) {
    return { props: { error } };
  }
}

export default cart;
