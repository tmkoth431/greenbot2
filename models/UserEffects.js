module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user_effects', {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    burn: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    poison: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    necrofire: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });
};