module.exports = (sequelize, DataTypes) => {
  return sequelize.define('questboard', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    desc: {
      type: DataTypes.STRING
    },
    diff: {
      type: DataTypes.INTEGER
    },
    reward: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    enemy: {
      type: DataTypes.STRING,
    },
    max_health: {
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
  }, {
    timestamps: false,
  });
};