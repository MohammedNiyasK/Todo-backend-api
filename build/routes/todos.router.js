"use strict";
// External Dependencies
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_service_1 = require("../services/database.service");
// Global Config
exports.todoRouter = express_1.default.Router();
exports.todoRouter.use(express_1.default.json());
// GET
exports.todoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.user;
    const query = new mongodb_1.ObjectId(id);
    try {
        const todos = yield ((_a = database_service_1.collections.todos) === null || _a === void 0 ? void 0 : _a.find({ userId: query }).toArray());
        res.status(200).send(todos);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.todoRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const id = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const todo = yield ((_c = database_service_1.collections.todos) === null || _c === void 0 ? void 0 : _c.findOne(query));
        if (todo) {
            res.status(200).send(todo);
        }
    }
    catch (error) {
        res.status(404).send(`unable to find matching document with id: ${id}`);
    }
}));
// POST
exports.todoRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { id } = req.user;
        const { task } = req.body;
        const result = yield ((_d = database_service_1.collections.todos) === null || _d === void 0 ? void 0 : _d.insertOne({
            userId: new mongodb_1.ObjectId(id),
            task,
            completed: false,
            canceled: false
        }));
        result ? res.status(201).send(`succesfully created with id : ${result.insertedId}`) : res.status(500).send("Failed to create a new todo");
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
// PUT
exports.todoRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const id = (_e = req === null || req === void 0 ? void 0 : req.params) === null || _e === void 0 ? void 0 : _e.id;
    try {
        const updatedTodo = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_f = database_service_1.collections.todos) === null || _f === void 0 ? void 0 : _f.updateOne(query, { $set: updatedTodo }));
        result ? res.status(200).send(`succesfully updated with id : ${id}`)
            : res.status(304).send(`todo with id:${id} not updated`);
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
// DELETE
exports.todoRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const id = (_g = req === null || req === void 0 ? void 0 : req.params) === null || _g === void 0 ? void 0 : _g.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_h = database_service_1.collections.todos) === null || _h === void 0 ? void 0 : _h.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`succesfully removed todo with id ${id}`);
        }
        else {
            res.status(400).send('failed to remove');
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
