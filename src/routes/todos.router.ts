// External Dependencies

import express,{Request,Response} from 'express';
import {ObjectId} from 'mongodb';
import { collections } from '../services/database.service';
import Todo from '../models/todo';

// Global Config

export const todoRouter = express.Router()

todoRouter.use(express.json())

// GET

todoRouter.get('/', async (req, res) => {
    const {id} = (req as any).user
    const query = new ObjectId(id)
try {
    const todos = await collections.todos?.find<Todo>({userId:query}).toArray();
    res.status(200).send(todos)
    
} catch (error: any) {
    res.status(500).send(error.message)
}
})



todoRouter.get("/:id", async (req , res) => {
    const id = req?.params?.id;

    try {

        const query = {_id: new ObjectId(id)};
        const todo = await collections.todos?.findOne<Todo>(query);

        if(todo){
            res.status(200).send(todo)
        }
        
    } catch (error) {
        res.status(404).send(`unable to find matching document with id: ${id}`)
    }
})

// POST

todoRouter.post('/', async (req , res) => {
    try {
        const {id} = (req as any).user
        const {task} = req.body as Todo

            const result = await collections.todos?.insertOne({
                userId:new ObjectId(id),
                task,
                completed:false,
                canceled:false
            })
            result ? res.status(201).send(`succesfully created with id : ${result.insertedId}`): res.status(500).send("Failed to create a new todo")
        
       
       
       
       
    } catch (error:any) {
        console.error(error)
        res.status(400).send(error.message)
    }
})

// PUT

todoRouter.put('/:id', async (req, res) => {
const id = req?.params?.id;

try {
    const updatedTodo:Todo = req.body;
    const query = {_id: new ObjectId(id)};

    const result = await collections.todos?.updateOne(query,{$set:updatedTodo});

    result ? res.status(200).send(`succesfully updated with id : ${id}`)
    : res.status(304).send(`todo with id:${id} not updated`)
    
} catch (error : any) {
    console.error(error.message)
    res.status(400).send(error.message)   
}
})


// DELETE

todoRouter.delete('/:id', async (req,res) => {
    const id = req?.params?.id;

    try {
        const query = {_id: new ObjectId(id)};
        const result = await collections.todos?.deleteOne(query);

        if(result && result.deletedCount){
            res.status(202).send(`succesfully removed todo with id ${id}`)
        }
        else{
            res.status(400).send('failed to remove')
        }
    } catch (error:any) {
        console.error(error.message)
        res.status(400).send(error.message)
    }
})