const { sequelize } = require("../models");

const withTransaction = async (callback, transaction = null) => {

  if (transaction) {
    return callback(transaction);
  }

  const newTransaction = await sequelize.transaction();

  try {

    const result = await callback(newTransaction);

    await newTransaction.commit();

    return result;

  } catch (error) {

    await newTransaction.rollback();

    throw error;

  }
};

module.exports = {
    withTransaction,
}