import express from 'express' 
import mongoose from 'mongoose'
import {json} from 'body-parser'
import apiCart from "./routes/index"
import dotenv from "dotenv";//me permite cargar datos de .env a esta archivo 



dotenv.config();

const app =express()
app.use(json()) 
app.use("/ShoppingCart", apiCart);



app.listen(process.env.PORT,()=>{ 
    console.log(`Server running on port ${process.env.PORT}`)
})

connectDb()
    .then(() => console.log("DataBase connected successfully"))
    .catch((err) => console.log(err));

async function connectDb() {
    if (process.env.DB_CONNECTION_STRING){
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
    } else {
        console.log("Failed to connect to DataBase");
    }
}

    