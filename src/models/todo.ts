// External dependencies

import {ObjectId} from 'mongodb'



export default interface Todo {
     task: string, 
      id?: ObjectId,
      completed:boolean,
      userId?:ObjectId
}