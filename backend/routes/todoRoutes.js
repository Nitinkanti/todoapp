import express from "express";
import ToDo from "../models/todoModels.js";
import { createList, deleteALL, deleteList, getALL, getList, updateList } from "../controllers/toDoControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const todoRouter = express.Router();

todoRouter.get("/all",getALL)

todoRouter.get("/list/:getID",getList)

todoRouter.post("/create",createList)

todoRouter.put("/update/:listID",updateList)

todoRouter.delete("/deleteall",deleteALL)

todoRouter.delete("/delete/:listID",deleteList)

export default todoRouter;