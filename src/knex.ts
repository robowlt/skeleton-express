/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import * as Knex from "knex";
import { APP_ENV, APP_PRODUCTION } from "./environment";

const APP_KNEX_DEFAULTS: Knex.Config = {
  asyncStackTraces: !APP_PRODUCTION,
  client: "pg",
  connection: `${process.env.DATABASE_URL}?ssl=true`,
  debug: !APP_PRODUCTION,
};

const APP_KNEX_CONFIG: { [key: string]: Knex.Config } = {
  development: Object.assign(APP_KNEX_DEFAULTS, {}),

  production: Object.assign(APP_KNEX_DEFAULTS, {
    pool: {
      max: 10,
      min: 2,
    },
  }),
};

export const knex = Knex(APP_KNEX_CONFIG[APP_ENV]);
