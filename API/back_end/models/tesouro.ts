'use strict';

import { Model } from 'sequelize';

interface ITesouro{
  oferta: number;
  rentabilidade: string;
  aplicacao_minima: string;
  preco: string;
  prazo: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Tesouro extends Model<ITesouro> implements ITesouro {
    oferta!: number;
    rentabilidade!: string;
    aplicacao_minima!: string;
    preco!: string;
    prazo!: Date;

    static associate(models: any) {
      this.belongsTo(models.Oferta, {
        foreignKey: 'oferta'
      });
    }
  };
  Tesouro.init({
    oferta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rentabilidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aplicacao_minima: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prazo: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Tesouro',
  });
  return Tesouro;
};