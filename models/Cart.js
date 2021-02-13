import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    products: [
      {
        quantity: { type: Number, default: 1 },
        product: { type: ObjectId, ref: "Product" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
