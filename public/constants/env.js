"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt_expires_in = exports.jwt_verify_expires_in = exports.jwt_refresh_expires_in = exports.jwt_verify_secret = exports.jwt_refresh_secret = exports.jwt_secret = exports.database_password = exports.database_uri = exports.brevo_api_key = exports.email_sender = exports.email_password = exports.email_username = exports.email_host = exports.port = exports.admin_email = exports.node_env = exports.client_dev_origin = void 0;
const getEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (value === undefined)
        throw new Error(`Environment variable ${key} not found`);
    return value;
};
exports.client_dev_origin = getEnv("CLIENT_DEV_URL");
exports.node_env = getEnv("NODE_ENV", "development");
exports.admin_email = getEnv("ADMIN_EMAIL");
exports.port = getEnv("PORT", 8080);
exports.email_host = getEnv("EMAIL_HOST");
exports.email_username = getEnv("EMAIL_USERNAME");
exports.email_password = getEnv("EMAIL_PASSWORD");
exports.email_sender = getEnv("EMAIL_SENDER");
exports.brevo_api_key = getEnv("BREVO_API_KEY");
exports.database_uri = getEnv("DATABASE_URI");
exports.database_password = getEnv("DATABASE_PASSWORD");
exports.jwt_secret = getEnv("JWT_SECRET");
exports.jwt_refresh_secret = getEnv("JWT_REFRESH_SECRET");
exports.jwt_verify_secret = getEnv("JWT_VERIFY_SECRET");
exports.jwt_refresh_expires_in = getEnv("JWT_REFRESH_EXPIRES_IN");
exports.jwt_verify_expires_in = getEnv("JWT_VERIFY_EXPIRES_IN");
exports.jwt_expires_in = getEnv("JWT_EXPIRES_IN");
