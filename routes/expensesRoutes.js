export default function ExpensesRoutes(ExpensesData) {
  let username;
  let firstname;
  async function home(req, res, next) {
    try {
      res.render("index");
    } catch (err) {
      next(err);
    }
  }
  async function expenses(req, res, next) {
    try {
      username = req.params.name;
      res.render("expense", {
        name: username,
        catList: await ExpensesData.getCategories(),
      });
    } catch (err) {
      next(err);
    }
  }
  async function login(req, res, next) {
    try {
      let name = req.body.login;
      username = name;

      await ExpensesData.storeName(name);
      res.redirect("/addExpenses/" + name);
    } catch (err) {
      next(err);
    }
  }
  async function addExpense(req, res, next) {
    try {
      let name = req.params.name;
      firstname = name;
      let category = req.body.category;
      let date = req.body.date;
      let amount = req.body.amount;
      if (!name || !category || !date || !amount) {
        res.redirect("/addExpenses/" + name);
      }
      await ExpensesData.storeExpense(name, category, Number(amount), date);
      res.redirect("/addExpenses/" + name);
    } catch (err) {
      next(err);
    }
  }
  let num = 0;
  async function filterData(req, res, next) {
    let numOfDays = req.body.daysNo;
    num = numOfDays;
    res.redirect("/viewExpenses");
  }
  let totals = [];
  async function getTotals(req, res, next) {
    let results = await ExpensesData.calcTotals(username, num);
    totals = results;
    res.redirect("/viewExpenses");
  }
  async function viewExpenses(req, res, next) {
    try {
      res.render("viewExpenses", {
        name: username,
        userExpenses: await ExpensesData.userExpenses(username, Number(num)),
        filterNum: num,
        totalList: totals,
      });
    } catch (err) {
      next(err);
    }
  }
  return {
    home,
    login,
    expenses,
    addExpense,
    viewExpenses,
    filterData,
    getTotals,
  };
}
