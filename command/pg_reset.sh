
cat api/sql/*.sql | docker exec -i findAMusician_postgres psql postgres://user:pass@postgres:5432/db
