module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    tax: DataTypes.FLOAT,
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1]]
      }
    },
  }, {
    underscored: true
  });

  Order.associate = models => {
    const { User } = models;
    if (User) {
      Order.belongsTo(User, { foreignKey: 'user_id' });
    }
  };

  return Order;
};
