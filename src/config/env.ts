process.env.DB_USER = process.env.DB_USER || "postgres";
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_PORT = process.env.DB_PORT || "5445";
process.env.DB_NAME = process.env.DB_NAME || "test";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "password";

export default process.env;
