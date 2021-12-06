import { Request, Response, NextFunction } from "express";

export interface IController {}

export interface IUserController {
  cadastrar(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE [X]
  login(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE []
  alterar(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE []
  addInvestidor(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE [X]
  //preferências investidoras????
}

// export interface IOfertaController {
//     cadastrar(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE []
//     consultarByUser(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE []
//     consultarByFilter(req: Request, res: Response, next: NextFunction): Promise<any>; //TO BE DONE []
//     //avaliação de ofertas????  
//     //preferencias do sistema????
// }