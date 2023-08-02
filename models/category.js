'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Product, { foreignKey: 'categoryId' })
        }
    }
    Category.init(
        {
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: 'Title of category cannt be null!',
                    },
                },
            },
            sold_product_amount: {
                type: DataTypes.INTEGER,
                aloowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Sold product amount can't be null!",
                    },
                    isInt: {
                        args: true,
                        msg: 'Sold product amount must be number!',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'Category',
            hooks: {
                beforeCreate(category, options) {
                    category.sold_product_amount = 0
                },
            },
        }
    )
    return Category
}
