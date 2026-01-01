import express from "express";
import todoRouter from "./routes/todoRoutes.js";
import dotenv from "dotenv";
import mongoDBConnect from "./config/db.js";
import cors from "cors";
import {protect} from "./middleware/authMiddleware.js"
import { authRouter } from "./routes/authRoutes.js";

dotenv.config();

const app = express();



app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

mongoDBConnect();

app.use("/api/auth",authRouter);
app.use("/api/todos",protect,todoRouter);

app.use((err ,req ,res ,next)=>{
    console.log(err.stack);
    res.status(500).json({
        message: "something went wrong",
        success : false,
        error : process.env.NODE_ENV === "development" ? err.message : undefined

    })
})

const PORT = process.env.PORT || 5000;

app.use((req,res,next)=>{
    res.status(404).send("route not found");
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
     console.log(`🌐 http://localhost:${PORT}`);
})