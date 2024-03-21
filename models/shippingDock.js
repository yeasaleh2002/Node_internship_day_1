module.exports = (sequelize, DataTypes) => {
  const ShippingDock = sequelize.define(
    "shipping_dock",
    {
      shipping_dock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.ENUM('active', 'inactive'),
    },
    {
      timestamps: false,
      underscored: true,
    }
  );

  return ShippingDock;
};
