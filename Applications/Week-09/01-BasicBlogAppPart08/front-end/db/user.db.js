const db = require('./db');

const TABLENAME = 'users';

class UserDb {
    static getByEmail(email) {
        const query = `SELECT * FROM ${TABLENAME} WHERE email = $1`;
        const params = [email];
        console.log(query, params);
        return db.oneOrNone(query, params);
    }

    static getOne(id) {
        const query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND id = $1`;
        const params = [id];
        console.log(query, params);
        return db.oneOrNone(query, params);
    }

    static getAll() {
        const query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false ORDER BY id DESC`;
        console.log(query);
        return db.any(query);
    }

    static updateOne(id, data) {
        const query = `UPDATE ${TABLENAME} SET username=$1, email=$2 WHERE is_deleted=false AND id = $3 RETURNING *`;
        const params = [data.username, data.email, id];
        console.log(query, params);
        return db.one(query, params);
    }

    static deleteOne(id) {
        id = parseInt(id);
        //let query = `DELETE FROM ${TABLENAME} WHERE id = ${id}`;
        let query = `UPDATE ${TABLENAME} SET is_deleted=true WHERE id = ${id}`;
        console.log(query);
        return db.result(query, [], r => r.rowCount);
    }

    static register(username, email, password) {
        let query = `INSERT into ${TABLENAME} (username, email, password) VALUES($1, $2, $3) RETURNING *`;
        let params = [username, email, password];
        console.log(query, params);
        return db.one(query, params);
    }

    static getTotal() {
        let query = `SELECT count(*) FROM ${TABLENAME}`;
        console.log(query);
        return db.one(query, [], a => +a.count);
    }

    static search(param) {
        let query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND post ILIKE '%${param}%' OR author ILIKE '%${param}%'`;
        //let query = `SELECT * FROM ${TABLENAME} WHERE is_deleted=false AND make = '${param}'`;
        console.log(query);
        return db.any(query);
    }
}

module.exports = UserDb;