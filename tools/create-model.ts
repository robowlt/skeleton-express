/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { ensureDir, existsSync, writeFileSync } from "fs-extra";
import { basename, dirname, resolve } from "path";
import { knex } from "../src/knex";

// tslint:disable-next-line no-var-requires
const options: any = require("yargs").argv;

const queue: any = [];
const sql = `
SELECT
  /* colname      */ a.attname AS "colname",
  /* completeType */ UPPER(FORMAT_TYPE(a.atttypid, a.atttypmod)) AS "completeType",
  /* conkey       */ ARRAY_TO_STRING(co.conkey, ',') AS "conkey",
  /* contype      */ co."contype" = 'p' AS "primary",
  /* defaultValue */ d.adsrc AS "defaultValue",
  /* length       */ a.attlen AS "length",
  /* notnull      */ a.attnotnull AS "notnull",
  /* nspname      */ n."nspname",
  /* relname      */ c."relname",
  /* type         */ LOWER(t.typname) AS "type"
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

const types: any = {
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
    date: "Date",
    int4: "number",
    integer: "number",
    text: "string",
    timestamp: "Date",
    uuid: "string",
  },
};

const camelize = (str: string, ucfirstchar = false): string => {
  const result = str
    .toLowerCase()
    .replace(/^([A-Z])|[\s-_]+([\w])/g, (_, p1, p2) => {
      return p2 ? p2.toUpperCase() : p1.toLowerCase();
    });

  // prettier-ignore
  return (ucfirstchar ? ucfirst(result) : result).replace(/\s+/g, "");
};

const ucfirst = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

options._.map(async (relname: string) => {
  queue.push(generate(relname));
});

Promise.all(queue).then(() => {
  // tslint:disable-next-line
  console.log("all done.");

  process.exit(0);
});

async function generate(relname: string) {
  const filename = relname.replace(/_+/g, "_").replace("_", "/");
  const pathname = "../".repeat(filename.split("/").length);

  const pwdM = resolve(__dirname, "../src/models", dirname(filename));
  const pwdS = resolve(__dirname, "../src/schemas", dirname(filename));

  const classname = camelize(
    filename.indexOf("/") === -1 ? filename : filename.split("/")[1],
    true,
  );

  const jsonSchema: any = {
    properties: {},
  };

  const template = [
    "/**",
    " * https://dl2.dev - DL2 IT Services",
    " * Owlsome solutions. Owltstanding results.",
    " */",
    "",
    `import { Model } from '${pathname}model';`,
    `import schema from "${pathname}${pwdS.replace(
      /.+src\/(.+)/,
      "$1",
    )}/${basename(filename)}";`,
    "",
  ];

  await knex.raw(sql, [relname]).then(({ rows }) => {
    template.push(`export default class ${classname} extends Model {`);

    template.push(
      `public static readonly jsonSchema = schema;`,
      `public static readonly tableName = "${rows[0].nspname}.${relname}";\n`,
      "/**",
      " * @see [objection.js/#relations](http://vincit.github.io/objection.js/#relations)",
      " */",
      "// public static readonly relationMappings = {};\n",
    );

    rows.map((row: any) => {
      const property = camelize(row.colname);

      jsonSchema.properties[property] = {
        type: types.schema[row.type],
      };
    });

    // template.push("\npublic static readonly jsonSchema = jsonSchema");
    // template.push(JSON.stringify(jsonSchema, null, "  "));
    // template.push("");

    rows.map((row: any) => {
      const column = ["public ", camelize(row.colname)];

      if (row.type === "bool") {
        column.push(`=${row.defaultValue === "true" ? "true" : "false"}`);

        return template.push(column.join(""));
      }

      if (!row.primary && (!row.notnull || row.defaultValue)) {
        if (!["uuid"].includes(row.type)) {
          if (row.colname === "created_at") {
            column.push("!");
          } else {
            column.push("?");
          }
        }
      }

      if (row.primary || row.type === "uuid") {
        column.push("!");
      }

      if (types.typescript[row.type]) {
        if (row.type === "bool") {
          column.push(`: ${row.defaultValue === "true" ? "true" : "false"};`);
        } else {
          column.push(`: ${types.typescript[row.type]};`);
        }
      } else {
        column.push(`: "string"; // undefined type \`${row.type}\``);
      }

      template.push(column.join(""));
    });

    template.push("}");
  });

  return ensureDir(pwdS)
    .then(() => {
      return ensureDir(pwdM);
    })
    .then(() => {
      const schema = [
        "/**",
        " * https://dl2.dev - DL2 IT Services",
        " * Owlsome solutions. Owltstanding results.",
        " */",
        "",
        "export default { properties: ",
        JSON.stringify(jsonSchema.properties, null, "  // ")
          .replace(/\/\/   \/\/ "type"/g, "//   type")
          .replace(/\/\/ "([a-z]+)": \{/gi, "// $1: {"),
        ",type: 'object', }",
      ].join("\n");

      const s = resolve(pwdS, basename(filename));
      if (existsSync(`${s}.ts`)) {
        writeFileSync(`${s}.generated.ts`, schema);
      } else {
        writeFileSync(`${s}.ts`, schema);
      }

      const f = resolve(pwdM, basename(filename));
      if (existsSync(`${f}.ts`)) {
        writeFileSync(`${f}.generated.ts`, template.join("\n"));
      } else {
        writeFileSync(`${f}.ts`, template.join("\n"));
      }
    });
}
