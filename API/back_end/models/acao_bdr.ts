'use strict';

import { Model } from 'sequelize';

interface IAcao_Bdr{
  oferta: number;
  preco: string;
  setor: string;
  dividend_yield: string;
  pl: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Acao_Bdr extends Model<IAcao_Bdr> implements IAcao_Bdr{
    oferta!: number;
    preco!: string;
    setor!: string;
    dividend_yield!: string;
    pl!: string;

    static associate(models: any) {
      this.belongsTo(models.Oferta, {
        foreignKey: 'oferta'
      });
    }
  };
  Acao_Bdr.init({
    oferta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    preco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    setor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dividend_yield: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Acao_Bdr',
  });
  return Acao_Bdr;
};