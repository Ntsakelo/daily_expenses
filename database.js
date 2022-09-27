export default function ExpensesData(db) {
  async function getCategories() {
    try {
      let results = await db.manyOrNone("select category from categories");

      return results;
    } catch (err) {
      console.log(err);
    }
  }
  // async function getNameId(name) {
  //   try {
  //     let results = await db.oneOrNone(
  //       "select firstname from users where firstname = $1",
  //       [name]
  //     );
  //     console.log(results.firstname);
  //     if (results.firstname === null) {
  //       let id = 0;
  //       return id;
  //     } else if (results.firstname === name) {
  //       let results = await db.oneOrNone(
  //         "select id from users where firstname = $1",
  //         [name]
  //       );
  //       console.log(results.id);
  //       return results.id;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
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

  return {
    getCategories,
    storeName,
    storeExpense,
  };
}
