/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { ensureDir, writeFileSync } from "fs-extra";
import { basename, dirname, resolve } from "path";
import { knex } from "../src/knex";
import { camelize } from "../src/string";

// tslint:disable: max-line-length no-console no-var-requires
const options: any = require("yargs").argv;

const queue: any = [];
const sql = `
SELECT
  a.attname AS "colname",
  UPPER(FORMAT_TYPE(a.atttypid, a.atttypmod)) AS "complete_type",
  ARRAY_TO_STRING(co.conkey, ',') AS "conkey",
  co."contype" = 'p' AS "primary",
  d.adsrc AS "default_value",
  a.attlen AS "length",
  a.attnotnull AS "notnull",
  n."nspname",
  c."relname",
  LOWER(t.typname) AS "type"
FROM pg_attribute AS a
  JOIN
    pg_class AS c ON a.attrelid = c.oid
  JOIN
    pg_namespace AS n ON c.relnamespace = n.oid
  JOIN
    pg_type AS t ON a.atttypid = t.oid
  LEFT OUTER JOIN
    pg_constraint AS co ON (co.conrelid = c.oid AND a.attnum = ANY(co.conkey) AND co.contype = 'p')
  LEFT OUTER JOIN pg_attrdef AS d ON d.adrelid = c.oid AND d.adnum = a.attnum
WHERE
  a.attnum > 0 AND c.relname = ?
ORDER BY
  a.attname`;

// prettier-ignore
options._.map(async(relname: string) => {
  queue.push(generate(relname));
});

Promise.all(queue).then(() => {
  console.log("ALL DONE");

  process.exit(0);
});

interface Row {
  colname: string;
  complete_type: string;
  conkey?: string;
  default_value: any;
  length: number;
  notnull: boolean;
  nspname?: string;
  primary: boolean;
  relname: string;
  type: string;
}

const TYPES: any = {
  schema: {
    bool: "boolean",
    date: "string",
    int4: "number",
    integer: "number",
    text: "string",
    timestamp: "string",
    uuid: "string",
  },
  typescript: {
    bool: "boolean",
    date: "Date | Raw",
    int4: "number",
    integer: "number",
    text: "string",
    timestamp: "Date | Raw | string",
    uuid: "string",
  },
};

// prettier-ignore
async function generate(relname: string) {
  const filename = relname.replace(/_+/g, "_").replace("_", "/");
  const pathname = "../".repeat(filename.split("/").length);

  const pwdM = resolve(__dirname, "../src/models", dirname(filename));
  const pwdS = resolve(__dirname, "../src/json-schema", dirname(filename));

  const jsonpath = pwdS.replace(/.+src\/(.+)/, "$1");

  const classname = camelize(
    filename.indexOf("/") === -1 ? filename : filename.split("/")[1],
    true,
  );

  const template = [
    "/**",
    " * https://dl2.dev - DL2 IT Services",
    " * Owlsome solutions. Owltstanding results.",
    " */",
    "",
  ];

  await knex.raw(sql, [relname]).then(({ rows }: { rows: Row[] }) => {
    const schemaname = rows[0].nspname === "public" ? "" : `${rows[0].nspname}.`;

    template.push(`
      import {
        JsonSchema,
        ModelOptions,
        QueryBuilder,
        QueryContext,
        Raw,
        raw,
        RelationMappings,
      } from "objection";
      import schema from '${pathname}${jsonpath}/${basename(filename)}';
      import { Model } from '${pathname}model';

      export class ${classname} extends Model {
      /** @inheritdoc */
      public static readonly jsonSchema: JsonSchema = schema;

      /** @inheritdoc */
      public static readonly relationMappings: RelationMappings = {};

      /** @inheritdoc */
      public static readonly tableName = "${schemaname}${relname}";

      /** @inheritdoc */
      public static readonly virtualAttributes: string[] = [];
    `),

    template.push(`// [BEGIN columns]`);
    let hasUpdatingTimespamp = false;

    rows.forEach((row) => {
      const $rowname = camelize(row.colname);
      const $rowtype = [];

      if ("updatedAt" === $rowname) {
        hasUpdatingTimespamp = true;
      }

      if (row.type === "bool") {
        $rowtype.push("boolean");
      } else {
        if (TYPES.typescript[row.type]) {
          $rowtype.push(TYPES.typescript[row.type]);

          if (!row.notnull) {
            $rowtype.push("|null");
          }
        } else {
          $rowtype.push(`string|null; // undefined type "${row.type}"`);
        }
      }

      template.push(`public ${$rowname}!: ${$rowtype.join("")};`);
    });

    template.push(`// [END columns]`);
    template.push(`
      /**
       * @inheritdoc
       */
      public async $beforeInsert(
        queryContext: QueryContext,
      ): Promise<QueryContext> {
        //
        return super.$beforeInsert(queryContext);
      }

      /**
       * @inheritdoc
       */
      public async $beforeUpdate(
        modelOptions: ModelOptions,
        queryContext: QueryContext,
      ): Promise<QueryContext> {
        //
        return super.$beforeUpdate(modelOptions, queryContext);
      }

      /**
       * @inheritdoc
       */
      public async $beforeSave(
        queryContext: QueryContext,
        modelOptions?: ModelOptions,
      ): Promise<{ queryContext: QueryContext; modelOptions?: ModelOptions }> {
        //${hasUpdatingTimespamp ? '\nthis.updatedAt = raw("CLOCK_TIMESTAMP()")\n' : ""}
        // prettier-ignore
        return super.$beforeSave(queryContext, modelOptions);
      }
      }
    `);
  });

  return ensureDir(pwdS).then(() => ensureDir(pwdM)).then(() => {
    writeFileSync(
      `${resolve(pwdM, basename(filename))}.ts`,
      template.join("\n"),
    );

    const jsontemplate = [
      "/**",
      " * https://dl2.dev - DL2 IT Services",
      " * Owlsome solutions. Owltstanding results.",
      " */",
      "",
      "export default {",
      "  //",
      "}",
    ];

    writeFileSync(
      `${resolve(pwdS, basename(filename))}.ts`,
      jsontemplate.join("\n"),
    );
  });
}
