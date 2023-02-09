/**
 * User Schema
 */
const getUserModel = (sequelize, {
    DataTypes
}) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        createdAt: 'account_created',
        updatedAt: 'account_updated'
    });

    return User;
};

export default getUserModel;