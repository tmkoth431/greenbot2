module.exports = (sequelize, DataTypes) => {
  return sequelize.define('shop', {
    name: {
      type: DataTypes.STRING,
      unique: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enchant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    damage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attribute: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scale: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ecost: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    desc: {
      type: DataTypes.STRING,
      defaultValue: 'no description provided',
      allowNull: false,
    },
    buyable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};