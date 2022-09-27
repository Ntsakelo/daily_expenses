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

      await ExpensesData.storeExpense(name, category, Number(amount), date);
      res.redirect("/addExpenses/" + name);
    } catch (err) {
      next(err);
    }
  }
  async function viewExpenses(req, res, next) {
    try {
      res.render("viewExpenses", {
        name: username,
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
  };
}
