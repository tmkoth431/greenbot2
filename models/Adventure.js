module.exports = (sequelize, DataTypes) => {
  return sequelize.define('adventure', {
    user_id: {
      type: DataTypes.STRING,
    },
    adventure_id: {
      type: DataTypes.INTEGER
    },
    act: {
      type: DataTypes.INTEGER,
    },
    scene: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false,
  });
};