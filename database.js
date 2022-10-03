export default function ExpensesData(db) {
  async function getCategories() {
    try {
      let results = await db.manyOrNone("select category from categories");

      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async function getCategoryId(description) {
    try {
      return await db.oneOrNone(
        "select id from categories where category = $1",
        [description]
      );
    } catch (err) {
      console.log(err);
    }
  }
  async function storeName(firstname, lastname, email, code) {
    try {
      let results = await db.oneOrNone(
        "select count(*) from users where usercode = $1",
        [code]
      );
      if (Number(results.count > 0)) {
        return;
      } else if (Number(results.count) <= 0) {
        await db.none(
          "insert into users(firstname,lastname,email,usercode) values($1,$2,$3,$4)",
          [firstname, lastname, email, code]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function checkName(firstname, email) {
    try {
      let results = await db.oneOrNone(
        "select * from users where firstname = $1 and email = $2",
        [firstname, email]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function checkCode(code) {
    try {
      let results = await db.oneOrNone(
        "select * from users where usercode = $1",
        [code]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function storeExpense(name, description, amount, date) {
    try {
      if (name && description && amount && date) {
        let categoryId = await getCategoryId(description);
        let nameId = await db.oneOrNone(
          "select id from users where firstname = $1",
          [name]
        );
        let id = nameId.id;
        let catId = categoryId.id;

        await db.none(
          "insert into expenses(userid,categoryid,amount,expensedate) values ($1,$2,$3,$4)",
          [id, catId, amount, date]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  //show all expenses for a user;
  async function getAllExpenses(user) {
    try {
      let userId = await getUserId(user);
      let results = await db.manyOrNone(
        "select firstname,category,amount,to_char(expensedate,'DD/MM/YYYY') as expensedate from users join expenses on users.id = expenses.userid join categories on categories.id = expenses.categoryid where expenses.userid = $1 order by expensedate desc",
        [userId]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  //show expense for the past 7 days
  async function getUserId(user) {
    try {
      let results = await db.oneOrNone(
        "select id from users where firstname = $1",
        [user]
      );
      return results.id;
    } catch (err) {
      console.log(err);
    }
  }

  async function userExpenses(user, num) {
    try {
      let userId = await getUserId(user);
      let numOfDays = 7;
      if (num > 0) {
        numOfDays = num;
      }
      let upperDate = new Date();
      let lowerDate = new Date();
      lowerDate.setDate(lowerDate.getDay() - numOfDays);
      let results = await db.manyOrNone(
        "select firstname,category,amount,expensedate from users join expenses on users.id = expenses.userid join categories on categories.id = expenses.categoryid where expenses.userid = $1 and expensedate between $2 and $3",
        [userId, lowerDate, upperDate]
      );

      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function calcTotals(user, numOfDays) {
    try {
      if (!numOfDays) {
        numOfDays = 7;
      }
      let currentDate = new Date();
      let newDate = new Date();
      newDate.setDate(newDate.getDate() - numOfDays);
      let userId = await getUserId(user);
      let results = await db.manyOrNone(
        "select categoryid,category, SUM(amount) from expenses join categories on categories.id = expenses.categoryid where userid = $1 and expensedate between $2 and $3 group by categoryid,category;",
        [userId, newDate, currentDate]
      );

      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function getWeeklyExpenses(user) {
    try {
      let userId = await getUserId(user);
      let upperDate = new Date();
      let lowerDate = new Date();
      lowerDate.setDate(lowerDate.getDate() - 29);
      let currentMonth = upperDate.getMonth() + 1;

      let results = await db.manyOrNone(
        "select userid,category,expensedate,amount from expenses join categories on expenses.categoryid = categories.id join users on expenses.userid = users.id where users.id = $1 and expensedate between $2 and $3 and extract(MONTH from expensedate) = $4",
        [userId, lowerDate, upperDate, currentMonth]
      );
      // let results = await db.manyOrNone(
      //   "select userid,category,expensedate,amount from expenses join categories on expenses.categoryid = categories.id join users on expenses.userid = users.id where users.id = $1 and expensedate between $2 and $3 ",
      //   [userId, lowerDate, upperDate]
      // );

      let expenseProps = {};
      let expenseList = [];
      let week1 = [];
      results.forEach((item) => {
        let date = item.expensedate;
        let expenseDay = date.getDay();
        let expenseDate = date.getDate();
        let week = Math.ceil((expenseDate - 1 - expenseDay) / 7);
        week <= 0 ? 1 : 0;
        expenseProps = {
          category: item.category,
          amount: item.amount,
          weekNum: week,
          date: item.expensedate,
        };
        expenseList.push(expenseProps);
      });

      return expenseList;
    } catch (err) {
      console.log(err);
    }
  }
  async function summarizeExpenses(user) {
    let expenseList = await getWeeklyExpenses(user);
    let firstWeek = [];
    let week1 = {};
    let week2 = {};
    let week3 = {};
    let week4 = {};
    expenseList.forEach((item) => {
      if (item.weekNum === 1) {
        if (!week1[item.category]) {
          let category = item.category;
          let amount = item.amount;
          week1["category"] = category;
          week1["amount"] = amount;
        } else {
          week1["amount"] += amount;
        }
        firstWeek.push(week1);
      }
      //  else if (item.weekNum === 2) {
      //   if (!week2[item.category]) {
      //     week2[item.category] = item.amount;
      //   } else {
      //     week2[item.category] += item.amount;
      //   }
      // } else if (item.weekNum === 3) {
      //   if (!week3[item.category]) {
      //     week3[item.category] = item.amount;
      //   } else {
      //     week3[item.category] += item.amount;
      //   }
      // } else if (item.weekNum === 4) {
      //   if (!week4[item.category]) {
      //     week4[item.category] = item.amount;
      //   } else {
      //     week4[item.category] += item.amount;
      //   }
      // }
    });
    console.log(firstWeek);
    //return firstWeek;
    // console.log(week2);
    // console.log(week3);
    // console.log(week4);
  }
  return {
    getCategories,
    storeName,
    storeExpense,
    userExpenses,
    getAllExpenses,
    calcTotals,
    checkName,
    getWeeklyExpenses,
    summarizeExpenses,
    checkCode,
  };
}
