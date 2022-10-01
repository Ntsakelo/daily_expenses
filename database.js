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
  async function storeName(firstname, lastname, email) {
    try {
      let results = await db.oneOrNone(
        "select count(*) from users where firstname = $1 and lastname = $2 and email = $3",
        [firstname, lastname, email]
      );
      if (Number(results.count > 0)) {
        return;
      } else if (Number(results.count) <= 0) {
        await db.none(
          "insert into users(firstname,lastname,email) values($1,$2,$3)",
          [firstname, lastname, email]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function checkName(firstname, email) {
    try {
      let results = await db.oneOrNone(
        "select id from users where firstname = $1 and email = $2",
        [firstname, email]
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
      let results = await db.manyOrNone(
        "select firstname,category,amount,expensedate from users join expenses on users.id = expenses.userid join categories on categories.id = expenses.categoryid where expenses.userid = $1",
        [userId]
      );
      let items = [];
      results.forEach((item) => {
        let numOfDays = 7;
        if (num > 0) {
          numOfDays = num;
        }
        let date = item.expensedate;
        let expenseDay = date.getDate();
        let newDate = new Date();
        let dateDiff = newDate.setDate(newDate.getDate() - numOfDays);
        let currentDate = new Date();
        if (
          date.getTime() >= dateDiff &&
          date.getTime() <= currentDate.getTime()
        ) {
          items.push(item);
        }
      });

      return items;
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
      let results = await db.manyOrNone(
        "select firstname,category,amount,to_char(expensedate, 'DD/MM/YYYY'),extract(WEEK FROM expensedate) as week from expenses join categories on expenses.categoryid = categories.id join users on expenses.userid = users.id where users.id = 3;"
      );
    } catch (err) {
      console.log(err);
    }
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
  };
}
