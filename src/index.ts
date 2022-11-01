import express from 'express' 
import mongoose from 'mongoose'
import {json} from 'body-parser'
import { todoRouter } from './routes/todos'

const app =express()
app.use(json()) 
app.use(todoRouter)


const PORT = 3000

app.listen(PORT,()=>{ 
    console.log(`Server running on port ${PORT}`)
})
 

    