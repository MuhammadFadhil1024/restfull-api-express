'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Category, { foreignKey: 'categoryId' })
        }
    }
    Product.init(
        {
            title: {
                type: DataTypes.STRING,
                aloowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Title can't be null!",
                    },
                },
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Price can't be null!",
                    },
                    isInt: {
                        args: true,
                        msg: 'Price must be number!',
                    },
                },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Stock can't be null!",
                    },
                    isInt: {
                        args: true,
                        msg: 'Stock must be number!',
                    },
                    max: {
                        args: [50000000],
                        msg: 'price cannot be exceeded 50000000!',
                    },
                    min: {
                        args: [0],
                        msg: 'price can not be less than 0',
                    },
                },
            },
            categoryId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Product',
        }
    )
    return Product
}
