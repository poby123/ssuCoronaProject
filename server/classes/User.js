const MyDate = require("./MyDate.js").MyDate;
const CryptoJS = require("crypto-js");
const AES = CryptoJS.AES;
const key = require("../config/aes_key").key;
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
                    this.decryptUser(result);
                    resolve({ result: true, content: result });
                }
            }),
        );
    }

    decryptUser(result) {
        result.forEach((element) => {
            const name = element["NAME"];
            const nameBytes = AES.decrypt(name, key);
            const decryptName = nameBytes.toString(CryptoJS.enc.Utf8);
            element["NAME"] = decryptName;

            const id = element["id"];
            const idBytes = AES.decrypt(id, key);
            const decryptId = idBytes.toString(CryptoJS.enc.Utf8);
            element["id"] = decryptId;
        });
    }

    decryptAUser(element) {
        let name = element.NAME;
        let nameBytes = AES.decrypt(name, key);
        let decryptName = nameBytes.toString(CryptoJS.enc.Utf8);
        element.NAME = decryptName;

        let id = element.id;
        const idBytes = AES.decrypt(id, key);
        const decryptId = idBytes.toString(CryptoJS.enc.Utf8);
        element.id = decryptId;
    }

    getUserWithoutTemp() {
        return new Promise((resolve, reject) => {
            let query = "SELECT NAME, nfcid, belong, id FROM tbltemp";
            this.connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    reject({ result: false });
                } else {
                    this.decryptUser(result);
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
                `SELECT NAME, belong, id,${today} FROM tblTemp where nfcid=?`,
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
                        this.decryptAUser(queryResult[0]);
                        // console.log(queryResult[0]);

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
                    params.push(AES.encrypt(element["name"], key).toString());
                    params.push(element["nfcid"]);
                    params.push(element["belong"]);
                    params.push(AES.encrypt(element["id"], key).toString());
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
