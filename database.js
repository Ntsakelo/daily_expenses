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
  async function storeName(name) {
    try {
      let results = await db.oneOrNone(
        "select count(*) from users where firstname = $1",
        [name]
      );
      if (Number(results.count > 0)) {
        return;
      } else if (Number(results.count) <= 0) {
        await db.none("insert into users(firstname) values($1)", [name]);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function storeExpense(name, description, amount, date) {
    try {
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
  async function userExpenses(user) {
    try {
      let userId = await getUserId(user);
      let results = await db.manyOrNone(
        "select firstname,category,amount,expensedate from users join expenses on users.id = expenses.userid join categories on categories.id = expenses.categoryid where expenses.userid = $1",
        [userId]
      );

      console.log(dateItems);
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  return {
    getCategories,
    storeName,
    storeExpense,
    userExpenses,
  };
}
