CREATE TABLE users (
    id serial primary key not null,
    email_address text not null,
    firstname text not null,
    lastname text not null
);
CREATE TABLE categories (
    id serial primary key not null,
    description text not null
);

CREATE TABLE expenses (
    id serial primary key not null,
    userId int not null,
    categoryId int not null,
    amount decimal not null,
    expenseDate text not null,
    foreign key(userId) references users(id),
    foreign key(categoryId) references categories(id)
);

INSERT INTO categories(description) VALUES ('Travel');
INSERT INTO categories(description) VALUES ('Food');
INSERT INTO categories(description) VALUES ('Toiletries');
INSERT INTO categories(description) VALUES ('Communication');

