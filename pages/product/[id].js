import React, { useEffect, useRef, useState } from "react";
import initDB from "../../helpers/initDB";
import Product from "../../models/Product";
import { useRouter } from "next/router";
import baseUrl from "../../helpers/baseUrl";
import { destroyCookie, parseCookies } from "nookies";

function Product1({ product }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const cookies = parseCookies();
  const user = cookies.user ? JSON.parse(cookies.user) : "";

  const modalRef = useRef(null);
  if (router.isFallback) {
    return <h3>Loading...</h3>;
  }

  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, []);

  const AddToCartHandler = async () => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: cookies.token,
      },
      body: JSON.stringify({ quantity, productId: product._id }),
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
      destroyCookie(null, "user");
      destroyCookie(null, "token");
      router.push("/login");
    } else {
      M.toast({ html: res2.message, classes: "green" });
    }
  };

  const getModal = () => {
    return (
      <div id="modal1" className="modal" ref={modalRef}>
        <div className="modal-content">
          <h4>{product.name}</h4>
          <p>Are you sure you want to delete this</p>
        </div>
        <div className="modal-footer">
          <button
            className="btn waves-effect waves-light #c62828 red darken-3"
            onClick={deleteProduct}
          >
            Yes
            <i className="material-icons left">delete</i>
          </button>
          <button className="btn waves-effect waves-light #9e9e9e grey">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const deleteProduct = async () => {
    const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
      method: "DELETE",
    });
    const res2 = await res.json();
    router.push("/");
  };

  return (
    <div className="container center-align" style={{ width: "30%" }}>
      <h3>{product.name}</h3>
      <img src={product.mediaUrl} style={{ width: "100%" }} />
      <h5>Rs {product.price}</h5>
      <div className="row">
        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "60%", margin: "10px" }}
        />
        {user ? (
          <button
            className="btn waves-effect waves-light #1565c0 blue darken-3"
            onClick={(e) => AddToCartHandler(e)}
          >
            Add
            <i className="material-icons right">add</i>
          </button>
        ) : (
          <button
            className="btn waves-effect waves-light #1565c0 blue darken-3"
            onClick={() => router.push("/login")}
          >
            Login To Add
            <i className="material-icons right">login</i>
          </button>
        )}
      </div>
      <p className="left-align">{product.description}</p>
      {user && user.role !== "user" && (
        <button
          data-target="modal1"
          className="btn modal-trigger waves-effect waves-light #c62828 red darken-3"
        >
          Delete
          <i className="material-icons left">delete</i>
        </button>
      )}

      {getModal()}
    </div>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${baseUrl}/api/product/${id}`);
  const data = await res.json();
  return {
    props: { product: data }, // will be passed to the page component as props
  };
}

// export async function getStaticProps({ params: { id } }) {
//   initDB();
//   const res = await Product.findOne({ _id: id });
//   const data = JSON.parse(JSON.stringify(res));
//   return {
//     props: { product: data }, // will be passed to the page component as props
//   };
// }

// export async function getStaticPaths() {
//   initDB();
//   const res = await Product.find();
//   const data = JSON.parse(JSON.stringify(res));
//   const paths = data.map((p) => ({
//     params: { id: p._id.toString() },
//   }));
//   // const paths = [{ params: { id: data[0]._id.toString() } }];

//   return {
//     paths,
//     fallback: true, // See the "fallback" section below
//   };
// }

export default Product1;
