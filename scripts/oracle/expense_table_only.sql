CREATE TABLE expense_entries (
id VARCHAR2(64) PRIMARY KEY,
user_id VARCHAR2(64) NOT NULL,
category VARCHAR2(100),
amount NUMBER(18,2),
expense_date DATE,
description VARCHAR2(4000),
level VARCHAR2(16)
);
