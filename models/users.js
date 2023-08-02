'use strict'
const { Model } = require('sequelize')
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Users.init(
        {
            fullName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: "Name can't be null!",
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Email must be unique',
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: 'Format email not valid!',
                    },
                    notNull: {
                        args: true,
                        msg: "Email can't be null!",
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Password can't be null!",
                    },
                    len: {
                        args: [6, 10],
                        masg: 'Password lengtt 6-10 character!',
                    },
                },
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Gender can't be null",
                    },
                    isIn: {
                        args: [['male', 'female']],
                        msg: 'Gender has to be male or female!',
                    },
                },
            },
            role: {
                type: DataTypes.STRING,
                validate: {
                    isEmpty: {
                        args: true,
                        msg: "Roles can't be null!",
                    },
                    isIn: {
                        args: [['customer', 'admin']],
                        msg: 'Role has to be ADMIN or CUSTOMER!',
                    },
                },
            },
            balance: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: {
                        args: true,
                        msg: "Balance can't be empty!",
                    },
                    isNumeric: {
                        args: true,
                        msg: 'Balance must be a number!',
                    },
                    min: {
                        args: [0],
                        msg: "Balance can't below 0",
                    },
                    max: {
                        args: [100000000],
                        msg: 'Balance max is 100000000',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'Users',
            hooks: {
                beforeCreate(user, options) {
                    user.password = hashPassword(user.password)
                    user.role = 'customer'
                    user.balance = 0
                },
            },
        }
    )
    return Users
}
