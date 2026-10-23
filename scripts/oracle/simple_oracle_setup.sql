-- Simple Oracle Setup for CA Advisor
-- Username: ca_advisor, Password: 1234
-- Run these commands in your Oracle SQL environment

-- Connect as ca_advisor user first, then run:

-- Create all tables at once (safe version)
CREATE TABLE app_users (
  id VARCHAR2(64) PRIMARY KEY,
  email VARCHAR2(255) UNIQUE NOT NULL,
  password_hash VARCHAR2(128) NOT NULL,
  name VARCHAR2(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
  user_id VARCHAR2(64) PRIMARY KEY,
  full_name VARCHAR2(255),
  age NUMBER,
  location VARCHAR2(255),
  dependents NUMBER,
  filing_status VARCHAR2(16),
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE TABLE income_entries (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  source VARCHAR2(255),
  amount NUMBER(18,2),
  frequency VARCHAR2(16),
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE TABLE expense_entries (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  category VARCHAR2(100),
  amount NUMBER(18,2),
  expense_date DATE,
  description VARCHAR2(4000),
  level VARCHAR2(16),
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE TABLE budget_allocations (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  category VARCHAR2(100),
  monthly_amount NUMBER(18,2),
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE TABLE user_goals (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  name VARCHAR2(255),
  target_amount NUMBER(18,2),
  target_date DATE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_expense_user_date ON expense_entries(user_id, expense_date);
CREATE INDEX idx_income_user ON income_entries(user_id);
CREATE INDEX idx_budget_user ON budget_allocations(user_id);
CREATE INDEX idx_goals_user ON user_goals(user_id);

-- Verify tables
SELECT table_name FROM user_tables ORDER BY table_name;

COMMIT;
