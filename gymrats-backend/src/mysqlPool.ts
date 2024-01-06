import mysql from "mysql2";

const sqlPool = mysql
  .createPool({
    host: "bwz4b5k0adqqdlg9rljm-mysql.services.clever-cloud.com",
    port: Number("3306"),
    user: "urtiiqouywr01bdl",
    password: "bsDgF5ORZxtADAamHR9G",
    database: "bwz4b5k0adqqdlg9rljm",
    multipleStatements: false,
  })
  .promise();

export { sqlPool };
