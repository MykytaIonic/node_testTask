const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("node_task", "mykyta", "pilot123", {
    host: "localhost",
    dialect: "mysql",
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
