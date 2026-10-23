-- Enable ORDS for the schema
-- Replace 'CA_ADVISOR' with your actual schema name
BEGIN
  ORDS.ENABLE_SCHEMA(
    p_enabled => TRUE,
    p_schema => 'CA_ADVISOR',
    p_url_mapping_type => 'BASE_PATH',
    p_url_mapping_pattern => 'api',
    p_auto_rest_auth => FALSE
  );
END;
/

-- Enable AutoREST for all tables
BEGIN
  ORDS.ENABLE_OBJECT(p_enabled => TRUE, p_schema => 'CA_ADVISOR', p_object => 'APP_USERS', p_object_type => 'TABLE');
  ORDS.ENABLE_OBJECT(p_enabled => TRUE, p_schema => 'CA_ADVISOR', p_object => 'USER_PROFILES', p_object_type => 'TABLE');
  ORDS.ENABLE_OBJECT(p_enabled => TRUE, p_schema => 'CA_ADVISOR', p_object => 'INCOME_ENTRIES', p_object_type => 'TABLE');
  ORDS.ENABLE_OBJECT(p_enabled => TRUE, p_schema => 'CA_ADVISOR', p_object => 'EXPENSE_ENTRIES', p_object_type => 'TABLE');
  ORDS.ENABLE_OBJECT(p_enabled => TRUE, p_schema => 'CA_ADVISOR', p_object => 'BUDGET_ALLOCATIONS', p_object_type => 'TABLE');
  ORDS.ENABLE_OBJECT(p_enabled => TRUE, p_schema => 'CA_ADVISOR', p_object => 'USER_GOALS', p_object_type => 'TABLE');
END;
/

-- Commit changes
COMMIT;
