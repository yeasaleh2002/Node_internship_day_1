module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('reports', {
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shipping_dock_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      orderCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    });
  
    return Report;
  };
  