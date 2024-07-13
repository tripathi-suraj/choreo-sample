//const sqlite3 = require("sqlite3").verbose();
import sqlite3 from 'sqlite3';
const filepath = "../resource/power.db";
console.log("config==>",process.vars);

export const getConnection=(cb)=>{
    console.log(process.vars);
    const db =  new sqlite3.Database(filepath, (error) => {
        if (error) {
          console.error(error.message);
          return cb(error)
        }
      });
      console.log("Connection with SQLite has been established");
      createTable(db);
      cb(null,db);
}

const createTable=(db)=>{
    db.exec(`
        CREATE TABLE sharks
        (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          name   VARCHAR(50) NOT NULL,
          color   VARCHAR(50) NOT NULL,
          weight INTEGER NOT NULL
        );
    `);
}