module.exports = (sequelize, DataTypes) => {
  return sequelize.define('pshop', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enchant: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    heal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });
};