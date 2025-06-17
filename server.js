import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/posts.js";



connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "https://noteharborplatform.netlify.app", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None", // ✅ cross-site Netlify ↔ Render
      secure: true,
      httpOnly: true,
    },
  })
);


//app.use(session(...));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
