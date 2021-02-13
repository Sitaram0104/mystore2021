import { parseCookies } from "nookies";
import { useState } from "react";
import baseUrl from "../helpers/baseUrl";

export default function Create() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [media, setMedia] = useState("");
  const [description, setDescription] = useState("");
  const { token } = parseCookies();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mediaUrl = await imageUpload();
      const res = await fetch(`${baseUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ name, price, mediaUrl, description }),
      });
      const res2 = await res.json();
      if (res2.error) {
        M.toast({ html: res2.error, classes: "red" });
      } else {
        M.toast({ html: "Product saved successfully", classes: "green" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", media);
      data.append("upload_preset", "mystore");
      data.append("cloude_name", "srmeena");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/srmeena/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res2 = await res.json();
      return res2.url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="container" onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      <div className="file-field input-field">
        <div className="btn #1565c0 blue darken-3">
          <span>File</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <img
        className="responsive-img"
        src={media ? URL.createObjectURL(media) : ""}
      />
      <textarea
        id="textarea1"
        className="materialize-textarea"
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button
        className="btn waves-effect waves-light #1565c0 blue darken-3"
        type="submit"
        onClick={(e) => handleSubmit(e)}
      >
        Submit
        <i className="material-icons right">send</i>
      </button>
    </form>
  );
}

export async function getServerSideProps(context) {
  const cookie = parseCookies(context);
  const user = cookie.user ? JSON.parse(cookie.user) : "";
  if (user && user.role !== "admin") {
    const { res } = context;
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}
