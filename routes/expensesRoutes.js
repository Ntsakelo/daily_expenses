import ShortUniqueId from "short-unique-id";
let uid = new ShortUniqueId({ length: 5 });

export default function ExpensesRoutes(ExpensesData) {
  let userCode = "";
  let num = 0;
  let messages = [];
  let daysArr = [];
  async function home(req, res, next) {
    try {
      userCode = "";
      res.render("index");
    } catch (err) {
      next(err);
    }
  }
  async function expenses(req, res, next) {
    try {
      messages = await ExpensesData.notify(req.session.user.firstname);
      res.render("expense", {
        name: req.session.user.firstname,
        catList: await ExpensesData.getCategories(),
        count: messages.length,
      });
    } catch (err) {
      next(err);
    }
  }
  async function login(req, res, next) {
    try {
      let userCode = req.body.login;

      totals = [];
      num = 0;
      let user = await ExpensesData.checkCode(userCode);
      req.session.user = user;
      if (req.session.user) {
        let username = req.session.user.firstname;
        res.redirect("/addExpenses/" + username);
      } else {
        res.redirect("/");
      }
    } catch (err) {
      next(err);
    }
  }
  async function registerPage(req, res, next) {
    try {
      res.render("register", {
        code: userCode,
      });
    } catch (err) {
      next(err);
    }
  }
  async function registerUser(req, res, next) {
    try {
      let firstName = req.body.regFirstName;
      let lastName = req.body.regLstName;
      let email = req.body.regEmail;
      let code = uid();
      userCode = code;
      let results = await ExpensesData.checkName(firstName, email);
      if (results !== null) {
        userCode = "";
        req.flash("register", "User already exists");
        res.redirect("/register");
      }
      if (results === null) {
        await ExpensesData.storeName(firstName, lastName, email, code);

        res.redirect("/register");
      }
    } catch (err) {
      next(err);
    }
  }
  async function addExpense(req, res, next) {
    try {
      let name = req.params.name;

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
  async function filterData(req, res, next) {
    try {
      let numOfDays = req.body.daysNo;
      num = numOfDays;
      res.redirect("/viewExpenses");
    } catch (err) {
      next(err);
    }
  }
  let totals = [];

  async function getTotals(req, res, next) {
    try {
      let username = req.session.user.firstname;
      let results = await ExpensesData.calcTotals(username, num);
      totals = results;
      res.redirect("/viewExpenses");
    } catch (err) {
      next(err);
    }
  }
  async function viewAllExpenses(req, res, next) {
    try {
      let username = req.session.user.firstname;

      res.render("overallView", {
        name: username,
        allExpenses: await ExpensesData.getAllExpenses(username),
        count: messages.length,
      });
    } catch (err) {
      next(err);
    }
  }
  async function viewExpenses(req, res, next) {
    daysArr = [];
    let username = req.session.user.firstname;
    let upperRange = new Date();
    let lowerRange = new Date();
    if (num === 0) {
      num = 7;
    }
    lowerRange.setDate(upperRange.getDate() - num);
    let lowerFormat = `${lowerRange.getDate()}/${
      lowerRange.getMonth() + 1
    }/${lowerRange.getFullYear()}`;
    let upperFormat = `${upperRange.getDate()}/${
      upperRange.getMonth() + 1
    }/${upperRange.getFullYear()}`;
    let dates = { lowerFormat, upperFormat };

    daysArr.push(dates);
    try {
      res.render("viewExpenses", {
        name: username,
        userExpenses: await ExpensesData.userExpenses(username, Number(num)),
        filterNum: num,
        totalList: totals,
        days: daysArr,
        count: messages.length,
      });
    } catch (err) {
      next(err);
    }
  }
  async function viewWeeklyExpenses(req, res, next) {
    try {
      let username = req.session.user.firstname;

      res.render("weekly", {
        name: username,
        weeklyData: await ExpensesData.summarizeExpenses(username),
        count: messages.length,
      });
    } catch (err) {
      next(err);
    }
  }
  async function logOut(req, res, next) {
    try {
      delete req.session.user;
      // messages = [];
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  async function notifications(req, res, next) {
    try {
      res.render("notifications", {
        name: req.session.user.firstname,
        count: messages.length,
        myMessages: messages,
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
    viewWeeklyExpenses,
    logOut,
    notifications,
  };
}
