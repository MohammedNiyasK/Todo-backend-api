import express from 'express';
import {ObjectId} from 'mongodb'

import { collections } from '../services/database.service';

const router = express.Router()

interface TodoCompleted {
    completed:boolean
}

// PUT (TODO COMPLETED)

router.put('/:id', async (req, res) => {
    const id = req?.params?.id;
   
    try {
        const updatedTodo:TodoCompleted = {
           completed:true
        };
        
        const query = {_id: new ObjectId(id)};
    
        const result = await collections.todos?.updateOne(query,{$set:updatedTodo});
    
        result ? res.status(200).send(`succesfully updated with id : ${id}`)
        : res.status(304).send(`todo with id:${id} not updated`)
        
    } catch (error : any) {
        console.error(error.message)
        res.status(400).send(error.message)   
    }
    })


    export default router;