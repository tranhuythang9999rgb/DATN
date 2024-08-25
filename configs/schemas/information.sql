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
    birth_date  VARCHAR(1024),
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

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY, -- Tự động tăng số ID
    customer_name VARCHAR(255), -- Tên khách hàng
    order_date VARCHAR(255), -- Ngày đặt hàng
    book_id BIGINT, -- ID sách (tham chiếu đến bảng sách)
    book_title VARCHAR(255), -- Tiêu đề sách
    book_author VARCHAR(255), -- Tên tác giả
    book_publisher VARCHAR(255), -- Nhà xuất bản
    book_published_date VARCHAR(255), -- Ngày xuất bản
    book_isbn VARCHAR(20), -- ISBN
    book_genre VARCHAR(50), -- Thể loại
    book_description TEXT, -- Mô tả
    book_language VARCHAR(50), -- Ngôn ngữ
    book_page_count INTEGER, -- Số trang
    book_dimensions VARCHAR(50), -- Kích thước
    book_weight DECIMAL(10, 2), -- Trọng lượng
    book_price DECIMAL(10, 2), -- Giá sách
    quantity INTEGER, -- Số lượng sách trong đơn hàng
    total_amount DECIMAL(10, 2), -- Tổng số tiền
    status INTEGER -- Trạng thái đơn hàng
);
