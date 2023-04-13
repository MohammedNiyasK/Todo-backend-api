"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_service_1 = require("./services/database.service");
const todos_router_1 = require("./routes/todos.router");
const auth_routes_1 = require("./routes/auth.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const verifyToken_1 = require("./middleware/verifyToken");
const logout_route_1 = __importDefault(require("./routes/logout.route"));
const complete_routes_1 = __importDefault(require("./routes/complete.routes"));
const cancel_routes_1 = __importDefault(require("./routes/cancel.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8080;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use("/auth", auth_routes_1.authRouter);
app.use(verifyToken_1.verifyToken);
app.use("/todos", todos_router_1.todoRouter);
app.use('/todos/complete', complete_routes_1.default);
app.use('/todos/cancel', cancel_routes_1.default);
app.use('/logout', logout_route_1.default);
(0, database_service_1.connectToDatabase)()
    .then(() => {
    app.listen(port, () => {
        console.log(`server started at ${port}`);
    });
})
    .catch((error) => {
    console.error(`Databased connection failed ${error}`);
    process.exit();
});
