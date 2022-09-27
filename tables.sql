CREATE TABLE users (
    id serial primary key not null,
    firstname text not null
 
);
CREATE TABLE categories (
    id serial primary key not null,
    category text not null
);

CREATE TABLE expenses (
    id serial primary key not null,
    userId int not null,
    categoryId int not null,
    amount int not null,
    expensedate timestamp not null,
    foreign key(userId) references users(id) on delete cascade,
    foreign key(categoryId) references categories(id) on delete cascade
);

INSERT INTO categories(category) VALUES ('Travel');
INSERT INTO categories(category) VALUES ('Food');
INSERT INTO categories(category) VALUES ('Toiletries');
INSERT INTO categories(category) VALUES ('Communication');

