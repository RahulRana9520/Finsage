-- Safe Oracle Setup - Checks for existing objects
-- This script can be run multiple times safely

-- Enable output to see messages
SET SERVEROUTPUT ON;

-- Check if tables exist and create them if they don't
DECLARE
  table_count NUMBER;
BEGIN
  -- Check if app_users table exists
  SELECT COUNT(*) INTO table_count FROM user_tables WHERE table_name = 'APP_USERS';
  
  IF table_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE TABLE app_users (
      id VARCHAR2(64) PRIMARY KEY,
      email VARCHAR2(255) UNIQUE NOT NULL,
      password_hash VARCHAR2(128) NOT NULL,
      name VARCHAR2(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )';
    DBMS_OUTPUT.PUT_LINE('Created app_users table');
  ELSE
    DBMS_OUTPUT.PUT_LINE('app_users table already exists');
  END IF;
END;
/

DECLARE
  table_count NUMBER;
BEGIN
  -- Check if user_profiles table exists
  SELECT COUNT(*) INTO table_count FROM user_tables WHERE table_name = 'USER_PROFILES';
  
  IF table_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE TABLE user_profiles (
      user_id VARCHAR2(64) PRIMARY KEY,
      full_name VARCHAR2(255),
      age NUMBER,
      location VARCHAR2(255),
      dependents NUMBER,
      filing_status VARCHAR2(16)
    )';
    DBMS_OUTPUT.PUT_LINE('Created user_profiles table');
  ELSE
    DBMS_OUTPUT.PUT_LINE('user_profiles table already exists');
  END IF;
END;
/

DECLARE
  table_count NUMBER;
BEGIN
  -- Check if income_entries table exists
  SELECT COUNT(*) INTO table_count FROM user_tables WHERE table_name = 'INCOME_ENTRIES';
  
  IF table_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE TABLE income_entries (
      id VARCHAR2(64) PRIMARY KEY,
      user_id VARCHAR2(64) NOT NULL,
      source VARCHAR2(255),
      amount NUMBER(18,2),
      frequency VARCHAR2(16)
    )';
    DBMS_OUTPUT.PUT_LINE('Created income_entries table');
  ELSE
    DBMS_OUTPUT.PUT_LINE('income_entries table already exists');
  END IF;
END;
/

DECLARE
  table_count NUMBER;
BEGIN
  -- Check if expense_entries table exists
  SELECT COUNT(*) INTO table_count FROM user_tables WHERE table_name = 'EXPENSE_ENTRIES';
  
  IF table_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE TABLE expense_entries (
      id VARCHAR2(64) PRIMARY KEY,
      user_id VARCHAR2(64) NOT NULL,
      category VARCHAR2(100),
      amount NUMBER(18,2),
      expense_date DATE,
      description VARCHAR2(4000),
      level VARCHAR2(16)
    )';
    DBMS_OUTPUT.PUT_LINE('Created expense_entries table');
  ELSE
    DBMS_OUTPUT.PUT_LINE('expense_entries table already exists');
  END IF;
END;
/

DECLARE
  table_count NUMBER;
BEGIN
  -- Check if budget_allocations table exists
  SELECT COUNT(*) INTO table_count FROM user_tables WHERE table_name = 'BUDGET_ALLOCATIONS';
  
  IF table_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE TABLE budget_allocations (
      id VARCHAR2(64) PRIMARY KEY,
      user_id VARCHAR2(64) NOT NULL,
      category VARCHAR2(100),
      monthly_amount NUMBER(18,2)
    )';
    DBMS_OUTPUT.PUT_LINE('Created budget_allocations table');
  ELSE
    DBMS_OUTPUT.PUT_LINE('budget_allocations table already exists');
  END IF;
END;
/

DECLARE
  table_count NUMBER;
BEGIN
  -- Check if user_goals table exists
  SELECT COUNT(*) INTO table_count FROM user_tables WHERE table_name = 'USER_GOALS';
  
  IF table_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE TABLE user_goals (
      id VARCHAR2(64) PRIMARY KEY,
      user_id VARCHAR2(64) NOT NULL,
      name VARCHAR2(255),
      target_amount NUMBER(18,2),
      target_date DATE
    )';
    DBMS_OUTPUT.PUT_LINE('Created user_goals table');
  ELSE
    DBMS_OUTPUT.PUT_LINE('user_goals table already exists');
  END IF;
END;
/

-- Add foreign keys safely
DECLARE
  constraint_count NUMBER;
BEGIN
  -- Check if foreign key for user_profiles exists
  SELECT COUNT(*) INTO constraint_count 
  FROM user_constraints 
  WHERE table_name = 'USER_PROFILES' AND constraint_name = 'FK_PROFILE_USER';
  
  IF constraint_count = 0 THEN
    EXECUTE IMMEDIATE 'ALTER TABLE user_profiles ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE';
    DBMS_OUTPUT.PUT_LINE('Added foreign key constraint for user_profiles');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Foreign key constraint for user_profiles already exists');
  END IF;
END;
/

DECLARE
  constraint_count NUMBER;
BEGIN
  -- Check if foreign key for income_entries exists
  SELECT COUNT(*) INTO constraint_count 
  FROM user_constraints 
  WHERE table_name = 'INCOME_ENTRIES' AND constraint_name = 'FK_INCOME_USER';
  
  IF constraint_count = 0 THEN
    EXECUTE IMMEDIATE 'ALTER TABLE income_entries ADD CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE';
    DBMS_OUTPUT.PUT_LINE('Added foreign key constraint for income_entries');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Foreign key constraint for income_entries already exists');
  END IF;
END;
/

DECLARE
  constraint_count NUMBER;
BEGIN
  -- Check if foreign key for expense_entries exists
  SELECT COUNT(*) INTO constraint_count 
  FROM user_constraints 
  WHERE table_name = 'EXPENSE_ENTRIES' AND constraint_name = 'FK_EXPENSE_USER';
  
  IF constraint_count = 0 THEN
    EXECUTE IMMEDIATE 'ALTER TABLE expense_entries ADD CONSTRAINT fk_expense_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE';
    DBMS_OUTPUT.PUT_LINE('Added foreign key constraint for expense_entries');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Foreign key constraint for expense_entries already exists');
  END IF;
END;
/

DECLARE
  constraint_count NUMBER;
BEGIN
  -- Check if foreign key for budget_allocations exists
  SELECT COUNT(*) INTO constraint_count 
  FROM user_constraints 
  WHERE table_name = 'BUDGET_ALLOCATIONS' AND constraint_name = 'FK_BUDGET_USER';
  
  IF constraint_count = 0 THEN
    EXECUTE IMMEDIATE 'ALTER TABLE budget_allocations ADD CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE';
    DBMS_OUTPUT.PUT_LINE('Added foreign key constraint for budget_allocations');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Foreign key constraint for budget_allocations already exists');
  END IF;
END;
/

DECLARE
  constraint_count NUMBER;
BEGIN
  -- Check if foreign key for user_goals exists
  SELECT COUNT(*) INTO constraint_count 
  FROM user_constraints 
  WHERE table_name = 'USER_GOALS' AND constraint_name = 'FK_GOALS_USER';
  
  IF constraint_count = 0 THEN
    EXECUTE IMMEDIATE 'ALTER TABLE user_goals ADD CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE';
    DBMS_OUTPUT.PUT_LINE('Added foreign key constraint for user_goals');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Foreign key constraint for user_goals already exists');
  END IF;
END;
/

-- Create indexes safely
DECLARE
  index_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO index_count FROM user_indexes WHERE index_name = 'IDX_EXPENSE_USER_DATE';
  IF index_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE INDEX idx_expense_user_date ON expense_entries(user_id, expense_date)';
    DBMS_OUTPUT.PUT_LINE('Created index idx_expense_user_date');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Index idx_expense_user_date already exists');
  END IF;
END;
/

-- Show final status
DBMS_OUTPUT.PUT_LINE('=== SETUP COMPLETE ===');
DBMS_OUTPUT.PUT_LINE('Tables created:');
SELECT table_name FROM user_tables ORDER BY table_name;

COMMIT;
