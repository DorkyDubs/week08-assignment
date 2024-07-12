`CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE

);``CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    post_text TEXT NOT NULL,
    likes INT,
    category_id INT REFERENCES categories (id)
);``CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    post_text TEXT NOT NULL,
    likes INT,
    post_id INT REFERENCES posts (id)
);`;
