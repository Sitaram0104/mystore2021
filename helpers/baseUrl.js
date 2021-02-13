const baseUrl =
  process.env.Node_ENV === "production"
    ? "https://mystore202144.vercel.app/"
    : "http://localhost:3000";

export default baseUrl;
