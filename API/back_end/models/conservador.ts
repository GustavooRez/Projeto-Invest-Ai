'use strict';

import { Model } from 'sequelize';

export interface IConservador {
  user: string;
  cdb_rentabilidade: string;
  cdb_data_resgate: string;
  cdb_aplicacao_minima: string;
  cdb_risco: string;
  tesouro_rentabilidade: string;
  tesouro_aplicacao_minima: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Conservador extends Model<IConservador> implements IConservador {
    user!: string;
    cdb_rentabilidade!: string;
    cdb_data_resgate!: string;
    cdb_aplicacao_minima!: string;
    cdb_risco!: string;
    tesouro_rentabilidade!: string;
    tesouro_aplicacao_minima!: string;

    static associate(models: any) {
      this.belongsTo(models.Usuario, {
        foreignKey: 'user'
      });
    }
  };
  Conservador.init({
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
    }
  }, {
    sequelize,
    modelName: 'Conservador',
  });
  return Conservador;
};