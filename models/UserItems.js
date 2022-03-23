module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user_item', {
    user_id: DataTypes.STRING,
    item_id: DataTypes.STRING,
    shop_id: DataTypes.INTEGER,
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'default',
      allowNull: false,
    },
    equipped: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    enchant: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
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
  }, {
    timestamps: false,
  });
};