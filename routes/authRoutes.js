// routes/authRoutes.js
import express from "express";
import passport from "passport";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// ⬇️ Existing Email+Password Auth
router.post("/register", register);
router.post("/login", login);

// ✅ LOGOUT - Fixes session clearing in Passport
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }

    res.clearCookie("session"); // ✅ if cookie-session used
    res.status(200).json({ message: "Logged out successfully" });
  });
});


export default router;
