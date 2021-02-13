const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://mystore202167.vercel.app/"
    : "http://localhost:3000";

export default baseUrl;
