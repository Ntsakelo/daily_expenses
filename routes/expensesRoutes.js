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
      let email = req.body.email;
      username = name;
      totals = [];
      let results = await ExpensesData.checkName(name, email);
      console.log(results);
      if (results !== null) {
        res.redirect("/addExpenses/" + name);
      } else if (results === null) {
        req.flash("login", "User not registered");
        res.redirect("/");
      }
    } catch (err) {
      next(err);
    }
  }
  async function registerPage(req, res, next) {
    try {
      res.render("register");
    } catch (err) {
      next(err);
    }
  }
  async function registerUser(req, res, next) {
    try {
      let firstName = req.body.regFirstName;
      let lastName = req.body.regLstName;
      let email = req.body.regEmail;
      let results = await ExpensesData.checkName(firstName, email);
      if (results !== null) {
        req.flash("register", "User already exists");
        res.redirect("/register");
      }
      if (results === null) {
        await ExpensesData.storeName(firstName, lastName, email);
        req.flash("register", "Successfully registered");
        res.redirect("/register");
      }
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
  async function viewAllExpenses(req, res, next) {
    res.render("overallView", {
      name: username,
      allExpenses: await ExpensesData.getAllExpenses(username),
    });
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
    viewAllExpenses,
    filterData,
    getTotals,
    registerPage,
    registerUser,
  };
}
