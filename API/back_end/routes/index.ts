import { Express } from "express";
import { IEntityRouter, IRouter } from "./interfaces";

import UserRouter from "./UserRouter";

class Router implements IRouter{
  routers: IEntityRouter[];

  constructor(express: Express) {
    this.routers = [];
    this.routers.push(new UserRouter());
    this.routers.forEach((router) => {
      express.use(router.uri, router.router);
    });
  }
}

export default Router