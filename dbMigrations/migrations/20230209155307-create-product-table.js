'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 0,
      },
      owner_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date_added: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      date_last_updated: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    }, {
      timestamps: true,
      createdAt: 'date_added',
      updatedAt: 'date_last_updated'
    });

    await queryInterface.sequelize.query(
      `CREATE TRIGGER update_updated_on_product_task
      BEFORE UPDATE
      ON
      products
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_on_product_task();`);
    // await queryInterface.sequelize.query(
    //   `CREATE FUNCTION update_updated_on_user_task()
    //   RETURNS TRIGGER AS $$
    //   BEGIN
    //   NEW.account_updated = now();
    //   RETURN NEW;
    //   END;
    //   $$ language 'plpgsql';`
    // )

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.dropTable('products');
  }
};