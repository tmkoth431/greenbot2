module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    adventure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    leaderboard: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    level_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    turn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    combat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    combat_target_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    combat_target: {
      type: DataTypes.STRING,
      allowNull: true,
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
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    fish_exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    biggest_catch: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    crime_exp: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    combat_exp: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    luck: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false,
    },
    strength: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false
    },
    dexterity: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
    curse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    curse_time: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    death_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
  }, {
    timestamps: false,
  });
};