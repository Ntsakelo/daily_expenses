import express from "express";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "express-flash";
import pgPromise from "pg-promise";
import ExpensesRoutes from "./routes/expensesRoutes.js";
import ExpensesData from "./database.js";
// import Waiters from "./waiters.js";

const pgp = pgPromise();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/daily_expenses";

const config = {
  connectionString: DATABASE_URL,
};

if (process.env.NODE_ENV == "production") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const db = pgp(config);

const app = express();

app.use(
  session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));

const expensesData = ExpensesData(db);
const expensesRoutes = ExpensesRoutes(expensesData);
app.get("/", expensesRoutes.home);
app.post("/login", expensesRoutes.login);
app.get("/addExpenses/:name", expensesRoutes.expenses);
app.post("/addExpenses/:name", expensesRoutes.addExpense);
app.get("/viewExpenses", expensesRoutes.viewExpenses);
app.post("/filter", expensesRoutes.filterData);
app.post("/totals", expensesRoutes.getTotals);
app.get("/allExpenses", expensesRoutes.viewAllExpenses);
app.get("/register", expensesRoutes.registerPage);
app.post("/register", expensesRoutes.registerUser);
app.get("/weeklyExpenses", expensesRoutes.viewWeeklyExpenses);
var PORT = process.env.PORT || 3045;

app.listen(PORT, function () {
  console.log("app started at port: ", PORT);
});
