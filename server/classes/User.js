const MyDate = require("./MyDate.js").MyDate;
class User {
    constructor(connection) {
        this.connection = connection;
        this.myDate = new MyDate(connection);
    }

    getUserAll() {
        return new Promise((resolve, reject) =>
            this.connection.query("SELECT * FROM tbltemp", (err, result) => {
                if (err) {
                    console.log(err);
                    reject({ result: false });
                } else {
                    resolve({ result: true, content: result });
                }
            }),
        );
    }

    getUserWithoutTemp() {
        return new Promise((resolve, reject) => {
            let query = "SELECT name, nfcid, belong, id FROM tbltemp";
            this.connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    reject({ result: false });
                } else {
                    // console.log(result);
                    resolve({ result: true, content: result });
                }
            });
        });
    }

    identify(nfcid) {
        return new Promise((resolve, reject) => {
            let today = new Date();
            today = "t_" + this.myDate.getFormatDate(today);
            this.connection.query(
                `SELECT name, belong, id,${today} FROM tblTemp where nfcid=?`,
                [nfcid],
                (err, queryResult) => {
                    if (err) {
                        console.log(err);
                        reject({ result: false });
                    } else if (queryResult.length > 0) {
                        let temperature = null;
                        if (queryResult[0][`${today}`]) {
                            temperature = queryResult[0][`${today}`];
                        }
                        resolve({ result: true, obj: queryResult[0] });
                    } else {
                        reject({ result: false, obj: null });
                    }
                },
            );
        });
    }

    addUser(target) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(target)) {
                target = Array(target);
            }
            // console.log("/addUser target: ", target);
            let query = "INSERT INTO tblTemp (name, nfcid, belong,id) VALUES ";
            let params = [];
            target.forEach((element) => {
                if (element["name"] != "" && element["nfcid"] != "") {
                    params.push(element["name"]);
                    params.push(element["nfcid"]);
                    params.push(element["belong"]);
                    params.push(element["id"]);
                    query += "(?,?,?,?),";
                }
            });
            query = query.substring(0, query.length - 1); //delete last , character
            this.connection.query(query, params, (err) => {
                if (err) {
                    console.log(err);
                    reject({ result: false });
                } else {
                    resolve({ result: true });
                }
            });
        });
    }

    deleteUser(target) {
        return new Promise((resolve, reject) => {
            let query = "DELETE FROM tblTemp where ";
            let params = [];
            target = [0, ...target];
            const size = target.length;

            for (let i = 1; i < size; ++i) {
                query += " nfcid=? ";
                params.push(target[i]);
                if (i != size - 1) {
                    query += " or ";
                }
            }
            this.connection.query(query, params, (err) => {
                if (err) {
                    console.log(err);
                    reject({ result: false });
                } else {
                    resolve({ result: true });
                }
            });
        });
    }

    addTempData(nfcid, temperature) {
        return new Promise((resolve, reject) => {
            let now = new Date();
            now = "t_" + this.myDate.getFormatDate(now);
            this.connection.query(
                `UPDATE tbltemp SET ${now} = ? WHERE nfcid = ?`,
                [temperature, nfcid],
                (err, result) => {
                    if (err || result["affectedRows"] == 0) {
                        console.log(err);
                        reject({ result: false });
                    } else {
                        resolve({ result: true });
                    }
                },
            );
        });
    }
}

module.exports = User;
