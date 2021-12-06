'use strict';

import { Model } from 'sequelize';

interface ICdb{
  oferta: number;
  rentabilidade: string;
  aplicacao_minima: string;
  resgate: string;
  risco: string;
  fgc: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Cdb extends Model<ICdb> implements ICdb {
    oferta!: number;
    rentabilidade!: string;
    aplicacao_minima!: string;
    resgate!: string;
    risco!: string;
    fgc!: string;

    static associate(models: any) {
      this.belongsTo(models.Oferta, {
        foreignKey: 'oferta'
      });
    }
  };
  Cdb.init({
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
    resgate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    risco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fgc: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cdb',
  });
  return Cdb;
};