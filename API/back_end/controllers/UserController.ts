import { IController, IUserController } from "./interfaces";
import { Request, Response, NextFunction } from "express";
import HttpException from "../helpers/httpException";
import { IUser } from "../models/usuario"
import { IConservador } from "../models/conservador"
import { IModerado } from "../models/moderado"
import { IAgressivo } from "../models/agressivo"
import axios from "axios";
import db from "../models";
import { listeners } from "process";

export default class UserController
  implements IController, IUserController
{
    async cadastrar(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const newUser: IUser = req.body;
            await db.Usuario.create(newUser);
        } catch (e) {
            next(console.log(e));
        }
        return res.status(200).json({
            message: "Usuario cadastrado com sucesso.",
        });
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<any>{
        let tipo: string = "none";
        let userCpf: string = "";
        try {
            const {email, pass} = req.body;
            const { senha, perfil_investidor, cpf } = await db.Usuario.findOne({ attributes: ['senha', 'perfil_investidor', 'cpf'], where: { email: email } });
            if(!senha || senha != pass){
                throw new HttpException(400, "Usuario ou senhas incorretos!");
            }
            if(perfil_investidor){
                tipo = perfil_investidor;
            }
            userCpf = cpf;
        } catch (e) {
            next(console.log(e));
        }
        return res.status(200).json({
            message: "Usuario conectado com sucesso.",
            perfil: tipo,
            cpf: userCpf
        });
    }

    async alterar(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const {user, newPerfil, prefs} = req.body;
            const u = await db.Usuario.findByPk(user);
            switch(u.perfil_investidor){
                case "Conservador":
                    const c = await db.Conservador.findByPk(user);
                    c.destroy();
                    break;
                case "Moderado":
                    const m = await db.Moderado.findByPk(user);
                    m.destroy();
                    break;
                case "Agressivo":
                    const a = await db.Agressivo.findByPk(user);
                    a.destroy();
                    break;
            }    
            await axios.put(`http://localhost:8000/user/addInvestidor`, {user, perfil: newPerfil, ...prefs})

        } catch (e) {
            next(console.log(e));
        }
        return res.status(200).json({
            message: "Perfil de usuario alterado com sucesso.",
        });
    }
    
    async addInvestidor(req: Request, res: Response, next: NextFunction): Promise<any>{
        const filas: Array<string> = []
        try {
            const { user, perfil, op } = req.body
            if( perfil == "Conservador"){
                const newPerfil: IConservador = req.body;
                await db.Conservador.create(newPerfil);
                if(op ==  "cdb"){
                    filas.push("cdb/" +newPerfil.cdb_rentabilidade +"/" +newPerfil.cdb_aplicacao_minima +"/" +newPerfil.cdb_data_resgate +"/" +newPerfil.cdb_risco);
                }else if(op == "tesouro"){
                    filas.push("tesouro/" +newPerfil.tesouro_rentabilidade +"/" +newPerfil.tesouro_aplicacao_minima)
                }else{
                    filas.push("cdb/" +newPerfil.cdb_rentabilidade +"/" +newPerfil.cdb_aplicacao_minima +"/" +newPerfil.cdb_data_resgate +"/" +newPerfil.cdb_risco);
                    filas.push("tesouro/" +newPerfil.tesouro_rentabilidade +"/" +newPerfil.tesouro_aplicacao_minima)
                }
            } else if (perfil == "Agressivo"){
                const newPerfil: IAgressivo = req.body;
                await db.Agressivo.create(newPerfil);
                if(op == "acao"){
                    filas.push("acao/" +newPerfil.acao_preco +"/" +newPerfil.acao_dividend_yield)
                } else if(op == "brd"){
                    filas.push("brd/" +newPerfil.bdr_preco +"/" +newPerfil.bdr_dividend_yield)
                }else{
                    filas.push("acao/" +newPerfil.acao_preco +"/" +newPerfil.acao_dividend_yield)
                    filas.push("brd/" +newPerfil.bdr_preco +"/" +newPerfil.bdr_dividend_yield)
                }
            } else {
                const newPerfil: IModerado = req.body;
                await db.Moderado.create(newPerfil);
                if(op ==  "cdb"){
                    filas.push("cdb/" +newPerfil.cdb_rentabilidade +"/" +newPerfil.cdb_aplicacao_minima +"/" +newPerfil.cdb_data_resgate +"/" +newPerfil.cdb_risco);
                }else if(op == "tesouro"){
                    filas.push("tesouro/" +newPerfil.tesouro_rentabilidade +"/" +newPerfil.tesouro_aplicacao_minima)
                }else if(op == "fundo"){
                    filas.push("fundo/" +newPerfil.fundos_aplicacao_minima +"/" +newPerfil.fundos_valor_retornado)
                }else if(op == "acao"){
                    filas.push("acao/" +newPerfil.acao_preco +"/" +newPerfil.acao_dividend_yield)
                }else if(op == "brd"){
                    filas.push("brd/" +newPerfil.bdr_preco +"/" +newPerfil.bdr_dividend_yield)
                }else{
                    filas.push("cdb/" +newPerfil.cdb_rentabilidade +"/" +newPerfil.cdb_aplicacao_minima +"/" +newPerfil.cdb_data_resgate +"/" +newPerfil.cdb_risco);
                    filas.push("tesouro/" +newPerfil.tesouro_rentabilidade +"/" +newPerfil.tesouro_aplicacao_minima)
                    filas.push("fundo/" +newPerfil.fundos_aplicacao_minima +"/" +newPerfil.fundos_valor_retornado)
                    filas.push("acao/" +newPerfil.acao_preco +"/" +newPerfil.acao_dividend_yield)
                    filas.push("brd/" +newPerfil.bdr_preco +"/" +newPerfil.bdr_dividend_yield)
                }
            }
            await db.Usuario.update({ perfil_investidor: perfil }, {
                where: { cpf: user }
            })
        } catch (e) {
            next(console.log(e));
        }
        return res.status(200).json({
            message: "Perfil de usuario cadastrado",
            filas: filas
        });
    }
}

// await axios.post(`http://localhost:3000/criarfila`, {
//                     fila: "tesouro/" +newPerfil.tesouro_rentabilidade +"/" +newPerfil.tesouro_aplicacao_minima
//                 });