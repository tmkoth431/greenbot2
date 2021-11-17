module.exports = (sequelize, DataTypes) => {
  return sequelize.define('enemy', {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    max_health: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    health: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
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
    reward: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });
};