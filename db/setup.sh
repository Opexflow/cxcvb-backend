echo "Enter The Database Passsword: "
read;
pg_password=${REPLY}
psql -f install.sql -U postgres
PGPASSWORD=$pg_password psql -d cxcvb -f application/schemas/database.sql -U cxcvb_admin
PGPASSWORD=$pg_password psql -d cxcvb -f structure.sql -U cxcvb_admin
PGPASSWORD=$pg_password psql -d cxcvb -f data.sql -U cxcvb_admin