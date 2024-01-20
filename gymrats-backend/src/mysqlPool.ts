import mysql from "mysql2";

const sqlPool = mysql
  .createPool({
    host: "83.212.75.182",
    port: Number("3385"),
    user: "root",
    password: "d1kti0k3ntrik@",
    database: "gymratsDB",
    multipleStatements: false,
  })
  .promise();

export { sqlPool };
