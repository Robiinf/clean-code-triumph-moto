import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.test"),
});

process.env.POSTGRES_HOST = process.env.POSTGRES_HOST || "postgres";
process.env.POSTGRES_PORT = process.env.POSTGRES_PORT || "5432";
process.env.POSTGRES_USER = process.env.POSTGRES_USER || "postgres";
process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";
process.env.POSTGRES_DB = process.env.POSTGRES_DB || "my_database";

process.env.MONGO_HOST = process.env.MONGO_HOST || "mongodb";
process.env.MONGO_PORT = process.env.MONGO_PORT || "27017";
process.env.MONGO_INITDB_ROOT_USERNAME =
  process.env.MONGO_INITDB_ROOT_USERNAME || "admin";
process.env.MONGO_INITDB_ROOT_PASSWORD =
  process.env.MONGO_INITDB_ROOT_PASSWORD || "password";
