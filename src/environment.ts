/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

// tslint:disable no-console max-line-length
export const APP_MODE = process.env.NODE_ENV || "development";
export const APP_PRODUCTION = APP_MODE === "production";
export const APP_PWD = process.cwd();
