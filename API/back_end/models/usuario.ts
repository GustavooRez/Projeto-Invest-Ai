'use strict';

import { Model } from 'sequelize';

export interface IUser {
  nome: string;
  data_nascimento: Date;
  cpf: string;
  rg: string;
  rua : string;
  numero_rua: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  email: string;
  senha: string;
  data_termos_condicoes: Date;
  perfil_investidor: string;
  vencimento: Date;
}


module.exports = (sequelize: any, DataTypes: any) => {
  class Usuario extends Model<IUser> implements IUser{
    nome!: string;
    data_nascimento!: Date;
    cpf!: string;
    rg!: string;
    rua!: string;
    numero_rua!: string;
    cep!: string;
    bairro!: string;
    cidade!: string;
    estado!: string;
    email!: string;
    senha!: string;
    data_termos_condicoes!: Date;
    perfil_investidor!: string;
    vencimento!: Date;

    static associate(models: any) {
      this.hasOne(models.Conservador)
      this.hasOne(models.Agressivo)
      this.hasOne(models.Moderado)
      this.belongsToMany(models.Oferta, {
        through: "Usuario_Oferta"
      })
    }
  };

  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    rua: {
      type: DataTypes.STRING
    },
    numero_rua: {
      type: DataTypes.STRING
    },
    cep: {
      type: DataTypes.STRING
    },
    bairro: {
      type: DataTypes.STRING
    },
    cidade: {
      type: DataTypes.STRING
    },
    estado: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_termos_condicoes: {
      type: DataTypes.DATE,
      allowNull: false
    },
    perfil_investidor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vencimento: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};

