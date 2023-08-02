'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Transactionhistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Product, { foreignKey: 'productId' })
            this.belongsTo(models.Users, { foreignKey: 'userId' })
        }
    }
    Transactionhistory.init(
        {
            productId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Quantity can't be null!",
                    },
                    isInt: {
                        args: true,
                        msg: 'Quantity must be number!',
                    },
                },
            },
            totalPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Total price can't be null!",
                    },
                    isInt: {
                        args: true,
                        msg: 'Total price must be number!',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'Transactionhistory',
        }
    )
    return Transactionhistory
}
