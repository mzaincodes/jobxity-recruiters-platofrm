
import verifyAuth from "@/middleware/verifyAuth";

export default function handler(req, res) {
  verifyAuth(req, res, async () => {
    return res.status(200).json({ message: "You are authenticated!", user: req.user });
  });
}
