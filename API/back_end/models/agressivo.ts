'use strict';

import { Model } from 'sequelize';

export interface IAgressivo{
    user: string;
    acao_preco: string;
    acao_dividend_yield: string;
    bdr_preco: string;
    bdr_dividend_yield: string;

}

module.exports = (sequelize: any, DataTypes: any) => {
  class Agressivo extends Model<IAgressivo> implements IAgressivo {
    user!: string;
    acao_preco!: string;
    acao_dividend_yield!: string;
    bdr_preco!: string;
    bdr_dividend_yield!: string;

    static associate(models: any) {
      this.belongsTo(models.Usuario, {
        foreignKey: 'user'
      });
    }
  };
  Agressivo.init({
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    acao_preco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    acao_dividend_yield: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bdr_preco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bdr_dividend_yield: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Agressivo',
  });
  return Agressivo;
};