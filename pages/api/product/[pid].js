import Product from "../../../models/Product";

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};

const getProduct = async (req, res) => {
  const { pid } = req.query;
  try {
    const product = await Product.findOne({ _id: pid });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const deleteProduct = async (req, res) => {
  const { pid } = req.query;
  const product = await Product.findByIdAndDelete({ _id: pid });
  res.status(200).json({ message: "product deleted" });
};
