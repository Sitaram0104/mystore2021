import Link from "next/link";
import { useRouter } from "next/router";
import baseUrl from "../helpers/baseUrl";

export default function Home({ products }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h3>Loading</h3>;
  }
  const productList = products.map((product) => {
    return (
      <div className="card pcard" key={product._id}>
        <div className="card-image">
          <img src={product.mediaUrl} />
          <span className="card-title">{product.name}</span>
        </div>
        <div className="card-content">
          <p>₹ {product.price}</p>
        </div>
        <div className="card-action">
          <Link
            href={{
              pathname: "/product/[id]",
              query: { id: product._id },
            }}
          >
            <a>View Product</a>
          </Link>
        </div>
      </div>
    );
  });
  return <div className="rootcard">{productList}</div>;
}

// export async function getStaticProps(context) {
//   initDB();
//   const res = await Product.find();
//   const data = JSON.parse(JSON.stringify(res));
//   return { props: { products: data } };
// }

export async function getServerSideProps(context) {
  const res = await fetch(`${baseUrl}/api/products`, { method: "GET" });
  const data = await res.json();
  return { props: { products: data } };
}
