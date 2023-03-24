-- Script to create a MySql database to store data from the container loading management application
-- V 0.1.0  24/03/2023
DROP DATABASE IF EXISTS cargo_loading;

CREATE DATABASE cargo_loading;

USE cargo_loading;

CREATE TABLE client (
  id INT AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  dateStart DATETIME NULL,
  dateFinal DATETIME NULL,
  active BOOLEAN NOT NULL,
  token VARCHAR(255) NULL,
  notes TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (code),
  UNIQUE KEY (token)
);

CREATE TABLE container (
  id INT AUTO_INCREMENT,
  clientId INT NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT NULL,
  width INT NULL,
  length INT NULL,
  height INT NULL,
  maxWeight INT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (code)
);

CREATE TABLE register (
  id INT AUTO_INCREMENT,
  date DATETIME NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destiny VARCHAR(255) NOT NULL,
  method VARCHAR(50) NOT NULL,
  status INT NOT NULL,
  requestBody TEXT NULL,
  responseData TEXT NULL,
  PRIMARY KEY (id)
);

INSERT INTO client (code, dateStart, dateFinal, active, token, notes)
SELECT 'TEST_CLIENT', now(), null, 1, 'TEST_TOKEN', 'some notes' FROM DUAL WHERE NOT EXISTS (SELECT id FROM client WHERE code = 'TEST_CLIENT' ) LIMIT 1;

INSERT INTO container (clientId, code, description, width, length, height, maxWeight) 
SELECT 1, 'TEST_CONTAINER', 'table of container', 1, 1, 1, 1 FROM DUAL WHERE NOT EXISTS (SELECT id FROM container WHERE code = 'TEST_CONTAINER' ) LIMIT 1;

INSERT INTO register (date, origin, destiny, method, status, requestBody, responseData) 
SELECT now(), 'TEST_REGISTER', 'url', 'GET', 200, 'body of register', 'Data of register' FROM DUAL WHERE NOT EXISTS (SELECT id FROM register WHERE origin = 'TEST_REGISTER' ) LIMIT 1;