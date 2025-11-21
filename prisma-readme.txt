After updating the schema, run these commands in the preventa directory:

1. npx prisma migrate dev --name init
2. npx prisma generate

This will create the SQLite database and Prisma client for your Node.js backend.