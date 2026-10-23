-- Step-by-Step Oracle Database Setup for CA Advisor
-- Execute these commands one by one to avoid errors

-- STEP 1: Create and setup user (Run as DBA/SYSTEM user)
CREATE USER ca_advisor IDENTIFIED BY "1234";
GRANT CONNECT, RESOURCE TO ca_advisor;
GRANT CREATE SESSION TO ca_advisor;
GRANT CREATE TABLE TO ca_advisor;
GRANT CREATE SEQUENCE TO ca_advisor;
GRANT CREATE VIEW TO ca_advisor;
ALTER USER ca_advisor QUOTA UNLIMITED ON USERS;

-- STEP 2: Connect as ca_advisor user and create tables one by one

-- Table 1: Users
CREATE TABLE app_users (
  id VARCHAR2(64) PRIMARY KEY,
  email VARCHAR2(255) UNIQUE NOT NULL,
  password_hash VARCHAR2(128) NOT NULL,
  name VARCHAR2(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: User Profiles
CREATE TABLE user_profiles (
  user_id VARCHAR2(64) PRIMARY KEY,
  full_name VARCHAR2(255),
  age NUMBER,
  location VARCHAR2(255),
  dependents NUMBER,
  filing_status VARCHAR2(16)
);

-- Add foreign key for profiles (skip if already exists)
BEGIN
  EXECUTE IMMEDIATE 'ALTER TABLE user_profiles ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -2275 THEN
      DBMS_OUTPUT.PUT_LINE('Foreign key fk_profile_user already exists - skipping');
    ELSE
      RAISE;
    END IF;
END;
/

-- Table 3: Income Entries
CREATE TABLE income_entries (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  source VARCHAR2(255),
  amount NUMBER(18,2),
  frequency VARCHAR2(16)
);

-- Add foreign key for income
ALTER TABLE income_entries 
ADD CONSTRAINT fk_income_user 
FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;

-- Table 4: Expense Entries
CREATE TABLE expense_entries (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  category VARCHAR2(100),
  amount NUMBER(18,2),
  expense_date DATE,
  description VARCHAR2(4000),
  level VARCHAR2(16)
);

-- Add foreign key for expenses
ALTER TABLE expense_entries 
ADD CONSTRAINT fk_expense_user 
FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;

-- Table 5: Budget Allocations
CREATE TABLE budget_allocations (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  category VARCHAR2(100),
  monthly_amount NUMBER(18,2)
);

-- Add foreign key for budget
ALTER TABLE budget_allocations 
ADD CONSTRAINT fk_budget_user 
FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;

-- Table 6: User Goals
CREATE TABLE user_goals (
  id VARCHAR2(64) PRIMARY KEY,
  user_id VARCHAR2(64) NOT NULL,
  name VARCHAR2(255),
  target_amount NUMBER(18,2),
  target_date DATE
);

-- Add foreign key for goals
ALTER TABLE user_goals 
ADD CONSTRAINT fk_goals_user 
FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE;

-- STEP 3: Create indexes
CREATE INDEX idx_expense_user_date ON expense_entries(user_id, expense_date);
CREATE INDEX idx_income_user ON income_entries(user_id);
CREATE INDEX idx_budget_user ON budget_allocations(user_id);
CREATE INDEX idx_goals_user ON user_goals(user_id);

-- STEP 4: Add constraints
ALTER TABLE user_profiles ADD CONSTRAINT chk_filing_status 
CHECK (filing_status IN ('single', 'married', 'huf', 'other'));

ALTER TABLE income_entries ADD CONSTRAINT chk_frequency 
CHECK (frequency IN ('monthly', 'weekly', 'yearly', 'one-time'));

ALTER TABLE expense_entries ADD CONSTRAINT chk_level 
CHECK (level IN ('expensive', 'moderate', 'basic'));

-- STEP 5: Verify everything was created
SELECT table_name FROM user_tables ORDER BY table_name;

-- STEP 6: Test with sample data (optional)
INSERT INTO app_users (id, email, password_hash, name) 
VALUES ('test-user-1', 'test@example.com', 'dummy-hash', 'Test User');

INSERT INTO user_profiles (user_id, full_name, age, location, dependents, filing_status)
VALUES ('test-user-1', 'Test User', 30, 'Mumbai', 0, 'single');

-- Verify sample data
SELECT * FROM app_users;
SELECT * FROM user_profiles;

-- Clean up test data
DELETE FROM user_profiles WHERE user_id = 'test-user-1';
DELETE FROM app_users WHERE id = 'test-user-1';

COMMIT;
