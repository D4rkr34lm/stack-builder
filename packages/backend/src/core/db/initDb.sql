CREATE TABLE database_history(
  version INT,
  migrator TEXT,
  migration_date DATE,
);

INSERT INTO TABLE database_history(1, "Manuel Frohn", GETDATE());