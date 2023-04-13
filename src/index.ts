import express,{Express} from "express";
import { connectToDatabase } from "./services/database.service";
import { todoRouter } from "./routes/todos.router";
import { authRouter } from "./routes/auth.routes";
import cookieParser from 'cookie-parser'
import { verifyToken } from "./middleware/verifyToken";
import logoutRouter from './routes/logout.route';
import completeRouter from './routes/complete.routes'
import cancelRouter from './routes/cancel.routes'
import cors from 'cors'


const app = express()

const port = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use("/auth", authRouter);
app.use(verifyToken)
app.use("/todos",todoRouter);
app.use('/todos/complete',completeRouter);
app.use('/todos/cancel',cancelRouter);
app.use('/logout',logoutRouter)



connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`server started at ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error(`Databased connection failed ${error}`);
    process.exit();
  });
