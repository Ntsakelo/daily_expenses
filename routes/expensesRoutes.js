export default function ExpensesRoutes(ExpensesData) {
  async function home(req, res, next) {
    try {
      res.render("index", {
        catList: await ExpensesData.getCategories(),
      });
    } catch (err) {
      next(err);
    }
  }
  async function addExpense(req, res, next) {
    try {
      let name = req.body.name;
      let category = req.body.category;
      let date = req.body.date;
      let amount = req.body.amount;
      await ExpensesData.storeName(name);
      await ExpensesData.storeExpense(name, category, Number(amount), date);
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  return {
    home,
    addExpense,
  };
}
