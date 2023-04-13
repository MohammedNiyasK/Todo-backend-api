import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.clearCookie("token").status(200).send("Logout successful.");
});

export default router;