import Authenticated from "../../helpers/Authenticated";
import initDB from "../../helpers/initDB";
import Order from "../../models/Order";

initDB();

export default async (req, res) => {
  findOrder(req, res);
};

const findOrder = Authenticated(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate(
      "products.product"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
  }
});
