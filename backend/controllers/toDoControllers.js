import ToDo from "../models/todoModels.js";
import { ZodError } from "zod";
import { createTodoSchema } from "../validators/todoSchema.js";



export const getALL = async(req,res)=>{
    try{
         const fullList = await ToDo.find({user: req.user._id})
    res.status(200).json({message:"All Lists",list : fullList})
    }catch(err){
        console.log(err);
        res.status(500).send("Error finding Alllist")
    }
}

export const getList = async(req,res)=>{
    try{
        const {getID} = req.params;
        const listID = await ToDo.findOne({_id: getID, user: req.user._id})
        if(!listID){
           return res.status(404).send("Not Found")
        }
        res.status(200).json({message:"List found successfully", list: listID})
    }catch(err){
        console.log(err);
        res.status(500).send("Error finding list")
    }
}

export const createList = async(req,res)=>{
    try{
              
        createTodoSchema.parse(req.body)

         const {title,description} = req.body;
    const newToDo = new ToDo({
        user: req.user._id,
        title,
        description,
        completed : false
    })
    await newToDo.save();
    res.status(201).json({success: true ,message:"new todolist has been created successfully", toDo: newToDo})
    }catch(err){

        if(err instanceof ZodError){
             return res.status(400).json({ message: err.errors[0].message });
        }
        console.log(err);
        res.status(500).send("internal server error");
    }
   
}

export const updateList = async(req,res)=>{
    try{
        const {listID} = req.params;
        const {title,description,completed} = req.body;
        const updateID = await ToDo.findOneAndUpdate(
            {_id: listID, user: req.user._id},
            {title,description,completed},
            {new:true}
        )
        if(!updateID){
            return res.status(404).send("list not found!")
        }
        res.status(200).send("list has been updated");
    }catch(err){
        console.log(err);
        res.status(500).send("Error in updating list!")
    }
}

export const deleteALL = async(req,res)=>{
    const todos = await ToDo.find();
    if((todos).length === 0){
     return   res.send("DB is empty")
    }else{
             try{
                await ToDo.deleteMany({user: req.user._id});
                res.status(200).send("All Data has been deleted successfully!")
             }catch(err){
                console.log(err);
                res.status(500).send("Error in deleting all")
             }
    }
}

export const deleteList = async(req,res)=>{
    try{
        const {listID} = req.params;
        const deletable = await ToDo.findOneAndDelete({_id: listID, user: req.user._id});
        if(!deletable){
          return  res.send("list not found")
        }
        res.status(200).json({message:"list has been deleted successfully", list:listID})
    }catch(err){
        console.log(err);
        res.status(500).send("error in deleting list")
    }
}
