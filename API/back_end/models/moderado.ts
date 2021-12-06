'use strict';

import { Model } from 'sequelize';

export interface IModerado {
  user: string;
  cdb_rentabilidade: string;
  cdb_data_resgate: string;
  cdb_aplicacao_minima: string;
  cdb_risco: string;
  tesouro_rentabilidade: string;
  tesouro_aplicacao_minima: string;
  fundos_valor_retornado: String;
  fundos_aplicacao_minima: string;
  acao_preco: string;
  acao_dividend_yield: string;
  bdr_preco: string;
  bdr_dividend_yield: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Moderado extends Model<IModerado> implements IModerado {
    user!: string;
    cdb_rentabilidade!: string;
    cdb_data_resgate!: string;
    cdb_aplicacao_minima!: string;
    cdb_risco!: string;
    tesouro_rentabilidade!: string;
    tesouro_aplicacao_minima!: string;
    fundos_valor_retornado!: String;
    fundos_aplicacao_minima!: string;
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
  Moderado.init({
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    cdb_rentabilidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cdb_data_resgate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cdb_aplicacao_minima: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cdb_risco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tesouro_rentabilidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tesouro_aplicacao_minima: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fundos_valor_retornado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fundos_aplicacao_minima: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'Moderado',
  });
  return Moderado;
};