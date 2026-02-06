CREATE SCHEMA webapp;

USE webapp;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL ,
    email VARCHAR(255) NOT NULL ,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR(255) NOT NULL ,
    description VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    privacy enum('public', 'invited', 'private') NOT NULL
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    user_id INT NOT NULL,
    room_id INT NOT NULL ,
    content VARCHAR(255) NOT NULL ,
    timestamp TIMESTAMP NOT NULL
);

CREATE TABLE roommembers (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    user_id INT NOT NULL ,
    room_id INT NOT NULL
)