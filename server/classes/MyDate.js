class MyDate {
    constructor(connection) {
        this.connection = connection;
    }

    /* function that convert Date Object to YYYY-MM-DD string */
    getFormatDate(date) {
        let year = date.getFullYear();
        let month = 1 + date.getMonth();
        month = month < 10 ? "0" + month : month;
        let day = date.getDate();
        day = day < 10 ? "0" + day : day;
        return `${year}${month}${day}`;
    }

    getDesc() {
        return new Promise((resolve, reject) => {
            this.connection.query("DESC tbltemp", (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    deletePrevDays() {
        const today = new Date();
        let prevDay = new Date().setDate(today.getDate() - 30);
        const prevTarget = this.getToday(prevDay);
        console.log(prevTarget);
        let targetDays = {};
        let query = `ALTER table tbltemp `;
        let i;
        this.getDesc()
            .then((v) => {
                for (i = 0; i < v.length; i++) {
                    if (v[i].Field == prevTarget) {
                        break;
                    }
                    if (v[i].Field.includes("t_")) {
                        targetDays[v[i].Field] = true;
                        query += `DROP ${v[i].Field},`;
                    }
                }
                query = query.substring(0, query.length - 1);
                this.connection.query(query, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("remove sucess");
                    }
                });
            })
            .catch((e) => {
                console.log("error :  ", e);
            });
    }

    getToday(specific) {
        let today;
        if (specific) {
            today = new Date(specific);
        } else {
            today = new Date();
        }
        today = "t_" + this.getFormatDate(today);
        return today;
    }

    todayExist() {
        return new Promise((resolve, reject) => {
            let today = this.getToday();
            this.connection.query(`SELECT ${today} from tbltemp`, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    checkToday() {
        this.todayExist()
            .catch(() => {
                this.addYear()
                    .then(() => {
                        console.log("addYear Success");
                    })
                    .catch((e) => {
                        console.log("Durint addYear, error is occured : ", e);
                    });
            })
            .then(() => {
                console.log("table is exist");
            });
    }

    addYear() {
        return new Promise((resolve, reject) => {
            let query = `alter table tblTemp add( `;

            //set targetYear using current year
            let targetYear = new Date().getFullYear();

            //iterate month
            for (let i = 1; i <= 12; ++i) {
                let thisMonthLast = new Date(targetYear, i, 0).getDate(); //get last date of month
                let targetMonth = i < 10 ? "0" + i : i; //fill 0 to make 2 digits.

                //iterate date of month
                for (let j = 1; j <= thisMonthLast; ++j) {
                    let targetDate = j < 10 ? "0" + j : j; //fill 0 to make 2 digits.
                    query += `t_${targetYear}${targetMonth}${targetDate} varchar(5),`;
                }
            }
            query = query.substring(0, query.length - 1); //to delete last of query ',' character that cause issue.
            query += ")";
            this.connection.query(query, (err) => {
                if (err) {
                    console.log(err);
                    reject({ result: false });
                } else {
                    console.log("success");
                    resolve({ result: true });
                }
            });
        });
    }
}

exports.MyDate = MyDate;
