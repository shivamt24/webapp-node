/**
 * Product Schema
 */
const getImageModel = (sequelize, {
    DataTypes
}) => {
    const Image = sequelize.define('images', {
        image_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        s3_bucket_path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        createdAt: 'date_created',
        updatedAt: false,
    });

    return Image;
};

export default getImageModel;