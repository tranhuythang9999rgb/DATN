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


