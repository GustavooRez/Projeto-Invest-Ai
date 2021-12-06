import { Router } from "express";
import { UserController } from "../controllers";
import { IEntityRouter } from "./interfaces";
import { IController, IUserController } from "../controllers/interfaces";

export default class UserRouter implements IEntityRouter {
  uri: string;
  router: Router;
  controller: IController & IUserController;

  constructor() {
    this.uri = "/user";
    this.router = Router();
    this.controller = new UserController();
    this.routes();
  }

  routes() {
    this.router.post("/cadastrar", this.controller.cadastrar);
    this.router.post("/login", this.controller.login);
    this.router.post("/alterar", this.controller.alterar);
    this.router.put("/addInvestidor", this.controller.addInvestidor);
  }
}
