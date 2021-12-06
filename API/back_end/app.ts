import { IRouter } from "./routes/interfaces";
import express, { Express } from 'express'
import Router from "./routes";
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

class App {
    express: Express;
    router: IRouter;

    constructor(){
        this.express = express();
        this.middlewares();
        this.router = new Router(this.express);
    }

    middlewares(){
        this.express.use(express.json());
        this.express.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Headers", "Access, Content-Type, Authorization, Acept, Origin, X-requested-with");
            this.express.use(cors())
            next();
        })
    }
}

export default App;