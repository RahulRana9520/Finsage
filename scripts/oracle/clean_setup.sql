-- Oracle Database Setup for CA Advisor Project
-- Connect as ca_advisor user first, then run this script

-- Drop tables if they exist (optional - for clean setup)
DROP TABLE user_goals CASCADE CONSTRAINTS;
DROP TABLE budget_allocations CASCADE CONSTRAINTS;
DROP TABLE expense_entries CASCADE CONSTRAINTS;
DROP TABLE income_entries CASCADE CONSTRAINTS;
DROP TABLE user_profiles CASCADE CONSTRAINTS;
DROP TABLE app_users CASCADE CONSTRAINTS;

-- USERS TABLE
CREATE TABLE app_users (
  id VARCHAR2(64) PRIMARY KEY,
  email VARCHAR2(255) UNIQUE NOT NULL,
  password_hash VARCHAR2(128) NOT NULL,
  name VARCHAR2(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER PROFILES TABLE
CREATE TABLE user_profiles (
  user_id VARCHAR2(64) PRIMARY KEY,
  full_name VARCHAR2(255),
  age NUMBER,
  location VARCHAR2(255),
  dependents NUMBER,
  filing_status VARCHAR2(16),
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- INCOME ENTRIES TABLE
CREATE TABLE income_entries (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  source VARCHAR2(255),
  amount NUMBER(18,2),
  frequency VARCHAR2(16),
  CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- EXPENSE ENTRIES TABLE
CREATE TABLE expense_entries (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  category VARCHAR2(100),
  amount NUMBER(18,2),
  expense_date DATE,
  description VARCHAR2(4000),
  level VARCHAR2(16),
  CONSTRAINT fk_expense_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- BUDGET ALLOCATIONS TABLE
CREATE TABLE budget_allocations (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  category VARCHAR2(100),
  monthly_amount NUMBER(18,2),
  CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- USER GOALS TABLE
CREATE TABLE user_goals (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  name VARCHAR2(255),
  target_amount NUMBER(18,2),
  target_date DATE,
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_expense_user_date ON expense_entries(user_id, expense_date);
CREATE INDEX idx_income_user ON income_entries(user_id);
CREATE INDEX idx_budget_user ON budget_allocations(user_id);
CREATE INDEX idx_goals_user ON user_goals(user_id);
CREATE INDEX idx_profile_user ON user_profiles(user_id);

-- ADD SOME CONSTRAINTS FOR DATA INTEGRITY
ALTER TABLE user_profiles ADD CONSTRAINT chk_filing_status 
  CHECK (filing_status IN ('single', 'married', 'huf', 'other'));

ALTER TABLE income_entries ADD CONSTRAINT chk_frequency 
  CHECK (frequency IN ('monthly', 'weekly', 'yearly', 'one-time'));

ALTER TABLE expense_entries ADD CONSTRAINT chk_level 
  CHECK (level IN ('expensive', 'moderate', 'basic'));

-- VERIFY TABLES WERE CREATED
SELECT table_name FROM user_tables ORDER BY table_name;

-- SHOW TABLE STRUCTURES
DESCRIBE app_users;
DESCRIBE user_profiles;
DESCRIBE income_entries;
DESCRIBE expense_entries;
DESCRIBE budget_allocations;
DESCRIBE user_goals;

COMMIT;
