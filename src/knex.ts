/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import * as Knex from "knex";
import { knexSnakeCaseMappers } from "objection";
import { APP_MODE, APP_PRODUCTION } from "./environment";

// const { postProcessResponse } = knexSnakeCaseMappers();
// const APP_COLUMNS_CACHE: { [column: string]: string } = {};

const APP_KNEX_DEFAULTS: Knex.Config = {
  ...knexSnakeCaseMappers(),
  asyncStackTraces: !APP_PRODUCTION,
  client: "pg",
  connection: `${process.env.DATABASE_URL}?ssl=true`,
  debug: !APP_PRODUCTION,
};

// prettier-ignore
const APP_KNEX_CONFIG: { [env: string]: Knex.Config } = {
  development: APP_KNEX_DEFAULTS,

  production: {
    ...APP_KNEX_DEFAULTS,
    pool: {
      max: 10,
      min: 2,
    },
  },
};

export const knex = Knex(APP_KNEX_CONFIG[APP_MODE]);
