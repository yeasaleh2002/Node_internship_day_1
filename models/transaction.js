module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: DataTypes.FLOAT,
    notes: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    shipping_dock_id: DataTypes.INTEGER,
  }, {
    underscored: true
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.order, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE' 
    });

    Transaction.belongsTo(models.shipping_dock, {
      foreignKey: 'shipping_dock_id',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE' 
    });
  };

  return Transaction;
};
