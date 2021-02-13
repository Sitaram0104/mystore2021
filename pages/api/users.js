import Authenticated from "../../helpers/Authenticated";
import initDB from "../../helpers/initDB";
import User from "../../models/User";

initDB();
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await fetchUsers(req, res);
      break;
    case "PUT":
      await ChangeRole(req, res);
      break;
  }
};

const fetchUsers = Authenticated(async (req, res) => {
  const user = await User.find({ _id: { $ne: req.userId } }).select(
    "-password"
  );
  res.status(200).json(user);
});

const ChangeRole = Authenticated(async (req, res) => {
  try {
    const { _id, role } = req.body;
    const newRole = role === "user" ? "admin" : "user";
    const user = await User.findOneAndUpdate(
      { _id },
      { role: newRole },
      { new: true }
    ).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});
