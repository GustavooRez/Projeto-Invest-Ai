'use strict';

import { Model } from 'sequelize';

interface IOferta{
  oferta_id: number;
  nome: string;
  tipo: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Oferta extends Model<IOferta> implements IOferta {
    oferta_id!: number;
    nome!: string;
    tipo!: string;

    static associate(models: any) {
      this.hasOne(models.Acao_Bdr)
      this.hasOne(models.Tesouro)
      this.hasOne(models.Fundos)
      this.hasOne(models.Cdb)
      this.belongsToMany(models.Usuario, {
        through: "Usuario_Oferta"
      })
    }
  };
  Oferta.init({
    oferta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Oferta',
  });
  return Oferta;
};