CREATE TABLE IF NOT EXISTS users
(
    id           bigint       NOT NULL
        PRIMARY KEY,
    username     varchar(255) NOT NULL
        UNIQUE,
    password     varchar(255) NOT NULL,
    email        varchar(255) NOT NULL
        UNIQUE,
    full_name    varchar(255),
    address      text,
    phone_number varchar(50),
    avatar       varchar(255),
    role         integer
);

ALTER TABLE users
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS cities
(
    name          text,
    code          text,
    district      text,
    district_code text,
    commune       text,
    commune_code  text,
    level         text
);

ALTER TABLE cities
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS publishers
(
    id             serial
        PRIMARY KEY,
    name           varchar(255) NOT NULL,
    address        text,
    contact_number varchar(50),
    website        varchar(255),
    is_active bool
);

ALTER TABLE publishers
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS authors
(
    id          bigint       NOT NULL
        PRIMARY KEY,
    name        varchar(255) NOT NULL,
    biography   text,
    birth_date  date,
    nationality varchar(100)
);

ALTER TABLE authors
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS books
(
    id             bigserial
        PRIMARY KEY,
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
    purchase_price numeric,
    stock          bigint,
    notes          text,
    is_active      boolean,
    opening_status bigint
);

ALTER TABLE books
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS file_storages
(
    id         bigserial
        PRIMARY KEY,
    any_id     bigint,
    url        text,
    created_at bigint
);

ALTER TABLE file_storages
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS type_books
(
    id        bigint       NOT NULL
        PRIMARY KEY,
    name      varchar(255) NOT NULL,
    is_active boolean      NOT NULL
);

ALTER TABLE type_books
    OWNER TO postgres;
