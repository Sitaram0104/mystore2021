import Authenticated from "../../helpers/Authenticated";
import initDB from "../../helpers/initDB";
import Cart from "../../models/Cart";

initDB();
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await fetchUserCart(req, res);
      break;
    case "PUT":
      await addProduct(req, res);
      break;
    case "DELETE":
      await removeProduct(req, res);
      break;
  }
};

const fetchUserCart = Authenticated(async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId }).populate(
    "products.product"
  );
  console.log(cart.products);
  res.status(200).json(cart.products);
});

const addProduct = Authenticated(async (req, res) => {
  const { quantity, productId } = req.body;
  const cart = await Cart.findOne({ user: req.userId });
  const pExist = cart.products.some(
    (pdoc) => productId === pdoc.product.toString()
  );
  if (pExist) {
    await Cart.findOneAndUpdate(
      { _id: cart._id, "products.product": productId },
      { $inc: { "products.$.quantity": quantity } }
    );
    res.status(200).json({ message: "Product quantity updated to cart" });
  } else {
    const newProduct = { quantity, product: productId };
    await Cart.findByIdAndUpdate(
      { _id: cart._id },
      { $push: { products: newProduct } },
      { upsert: true }
    );
    res.status(200).json({ message: "Product added to cart" });
  }
});

const removeProduct = Authenticated(async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOneAndUpdate(
    { user: req.userId },
    { $pull: { products: { product: productId } } },
    { new: true }
  ).populate("products.product");
  res.status(200).json(cart.products);
});
