
cat api/sql/01-reset.sql | docker exec -i findAMusician_postgres psql postgres://user:pass@postgres:5432/db
