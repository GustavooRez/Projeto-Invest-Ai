'use strict';

import { Model } from 'sequelize';

interface IFundos{
  oferta: number;
  valor_retornado: string;
  preco: string;
  tipo: string;
  patrimonio_liquido: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Fundos extends Model<IFundos> implements IFundos {
    oferta!: number;
    valor_retornado!: string;
    preco!: string;
    tipo!: string;
    patrimonio_liquido!: string;

    static associate(models: any) {
      this.belongsTo(models.Oferta, {
        foreignKey: 'oferta'
      });
    }
  };
  Fundos.init({
    oferta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    valor_retornado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patrimonio_liquido: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Fundos',
  });
  return Fundos;
};