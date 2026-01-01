import mongoose from "mongoose";

const mongoDBConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected");
    }catch(err){
        console.log("not connected",err);
        process.exit(1);
    }
}
export default mongoDBConnect;