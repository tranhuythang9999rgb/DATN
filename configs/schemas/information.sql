-- Active: 1724172274110@@127.0.0.1@5432@shoe_shop@public
CREATE TABLE books(
    id SERIAL NOT NULL,
    title text,
    author_name text,
    publisher text,
    published_date text,
    isbn text,
    genre text,
    description text,
    language text,
    page_count bigint,
    dimensions text,
    weight numeric,
    price numeric,
    discount_price numeric,
    purchase_price numeric,
    stock bigint,
    notes text,
    is_active boolean,
    opening_status bigint,
    PRIMARY KEY(id)
);

CREATE TABLE file_storages(
    id SERIAL NOT NULL,
    any_id bigint,
    url text,
    created_at bigint,
    PRIMARY KEY(id)
);