require("dotenv").config();

module.exports = {
    "development": {
      "username": process.env.POSTGRES_USER || "postgres",
      "password": process.env.POSTGRES_PASSWORD,
      "database": process.env.POSTGRES_DB,
      "host": process.env.POSTGRES_HOST || "localhost",
      "port": process.env.POSTGRES_PORT || "5432",
      "dialect": "postgres",
    },
    "test": {
      "username": process.env.POSTGRES_USER || "postgres",
      "password": process.env.POSTGRES_PASSWORD,
      "database": 'web3-interactions-test',
      "host": process.env.POSTGRES_HOST || "localhost",
      "port": process.env.POSTGRES_PORT || "5432",
      "dialect": "postgres",
    },
    "production": {
      "username": process.env.POSTGRES_USER || "postgres",
      "password": process.env.POSTGRES_PASSWORD,
      "database": web3-interactions-prod,
      "host": process.env.POSTGRES_HOST || "localhost",
      "port": process.env.POSTGRES_PORT || "5432",
      "dialect": "postgres",
    },
};
