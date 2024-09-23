-- Active: 1726675047873@@127.0.0.1@5432@shoe_shop
create table if not exists users
(
    id           bigint       not null
        primary key,
    username     varchar(255) not null
        unique,
    password     varchar(255) not null,
    email        varchar(255) not null
        unique,
    full_name    varchar(255),
    address      text,
    phone_number varchar(50),
    avatar       varchar(255),
    role         integer
);

alter table users
    owner to postgres;

create table if not exists cities
(
    name          text,
    code          text,
    district      text,
    district_code text,
    commune       text,
    commune_code  text,
    level         text
);

alter table cities
    owner to postgres;

create table if not exists books
(
    id             bigserial
        primary key,
    title          text,
    author_name    text,
    publisher      text,
    published_date text,
    isbn           text,
    genre          text,
    description    text,
    language       text,
    page_count     bigint,
    dimensions     text,
    weight         numeric,
    price          numeric,
    discount_price numeric,
    stock          bigint,
    notes          text,
    is_active      boolean,
    opening_status bigint
);

alter table books
    owner to postgres;

create table if not exists file_storages
(
    id         bigserial
        primary key,
    any_id     bigint,
    url        text,
    created_at bigint
);

alter table file_storages
    owner to postgres;

create table if not exists type_books
(
    id        bigint       not null
        primary key,
    name      varchar(255) not null,
    is_active boolean      not null
);

alter table type_books
    owner to postgres;

create table if not exists publishers
(
    id             serial
        primary key,
    name           varchar(255) not null,
    address        text,
    contact_number varchar(50),
    website        varchar(255),
    is_active      boolean
);

alter table publishers
    owner to postgres;

create table if not exists authors
(
    id          bigint       not null
        primary key,
    name        varchar(255) not null,
    biography   text,
    birth_date  varchar(1024),
    nationality varchar(100)
);

alter table authors
    owner to postgres;

create table if not exists orders
(
    id                  bigserial
        primary key,
    customer_name       varchar(255),
    order_date          varchar(255),
    book_id             bigint,
    book_title          varchar(255),
    book_author         varchar(255),
    book_publisher      varchar(255),
    book_published_date varchar(255),
    book_isbn           varchar(20),
    book_genre          varchar(50),
    book_description    text,
    book_language       varchar(50),
    book_page_count     integer,
    book_dimensions     varchar(50),
    book_weight         numeric(10, 2),
    book_price          numeric(10, 2),
    quantity            integer,
    total_amount        numeric(10, 2),
    status              integer
);

alter table orders
    owner to postgres;

ALTER TABLE books 
    ALTER COLUMN weight TYPE VARCHAR(255);

ALTER TABLE books ALTER COLUMN price TYPE DECIMAL USING price::DECIMAL;


CREATE TABLE  if not exists delivery_addresses
(
    id BIGINT PRIMARY KEY,
    order_id BIGINT,
    email VARCHAR(1024),
    user_name VARCHAR(1024),
    phone_number VARCHAR(255),
    province VARCHAR(255),
    district VARCHAR(255),
    commune VARCHAR(255), 
    detailed VARCHAR(255),
    otp INT
);

ALTER TABLE orders 
    ALTER COLUMN book_weight TYPE VARCHAR(255);

ALTER TABLE books 
    ALTER COLUMN stock TYPE INTEGER;
-- change column name
ALTER TABLE books 
    RENAME COLUMN stock TO quantity;

COMMENT ON COLUMN books.genre IS 'Loại sách';

ALTER TABLE books 
  ADD COLUMN quantity_origin int DEFAULT 10;

COMMENT ON COLUMN books.quantity_origin IS 'Số  lượng sách ban đầu';

UPDATE books
SET quantity_origin = 100
WHERE quantity_origin < 100;

CREATE TABLE  if not exists carts(
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    book_id BIGINT,
    quantity INTEGER
);

ALTER TABLE carts 
  ADD COLUMN create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE orders 
  ADD COLUMN type_payment INT;
COMMENT ON COLUMN orders.type_payment IS 'loại hình thức thanh toán , oneline, thanh toán khi nhận hàng';

ALTER TABLE delivery_addresses 
  ADD COLUMN default_address INT;
COMMENT ON COLUMN delivery_addresses.default_address IS 'địa chỉ nhận hàng mặc định';

ALTER TABLE orders 
  ADD COLUMN create_time timestamp with time zone DEFAULT NOW();


ALTER TABLE orders 
  ADD COLUMN create_order INTEGER;

ALTER TABLE books 
ADD COLUMN create_time timestamp with time zone DEFAULT NOW();


CREATE TABLE  if not exists  order_items (
    id BIGINT PRIMARY KEY,
    order_id BIGINT,
    book_id BIGINT,
    quantity INTEGER,
    price NUMERIC(10,2)
);

ALTER TABLE authors 
  ADD COLUMN avatar VARCHAR(255);


ALTER TABLE publishers 
  ADD COLUMN avatar VARCHAR(255);

ALTER TABLE orders 
  ADD COLUMN address_id BIGINT;
COMMENT ON COLUMN orders.address_id IS 'thông tin địa chỉ giao hàng';

CREATE TABLE  if not exists  favorites (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);


ALTER TABLE orders 
  ADD COLUMN items TEXT;
COMMENT ON COLUMN orders.items IS 'danh sách sản phẩm';


CREATE TABLE loyalty_points (
  loyalty_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  points INT NOT NULL DEFAULT 0,
  last_updated INTEGER
);

ALTER TABLE users 
  ADD COLUMN create_time INT;


DROP TRIGGER IF EXISTS tsvectorupdate ON books;
