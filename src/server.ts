/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import PromiseRouter from "express-promise-router";
import { existsSync } from "fs";
import * as helmet from "helmet";
import morgan = require("morgan");
import { APP_PWD } from "./environment";

export const router = PromiseRouter();
export const server = express()
  .set("jsonp callback name", "cb")
  .set("port", process.env.PORT || 8042)
  .set("trust proxy", 1)
  .use(bodyParser.json({ strict: true, type: "application/json" }))
  .use(compression())
  .use(helmet())
  .use(morgan("dev"))
  .use(router);

if (existsSync(`${APP_PWD}/src/middlewares.js`)) {
  // tslint:disable-next-line no-var-requires
  const mws: express.RequestHandler[] = require(`${APP_PWD}/src/middlewares.js`);

  mws.forEach((mw) => router.use(mw));
}

/**
 * Import `RequestHandler`'s from the given `fileOrPath`.
 *
 * @param fileOrPath file or path inside the `routes` directory
 */
export function addRouteFromPath(fileOrPath: string): void {
  const { endpoint, handlers } = importHandlers(fileOrPath);

  return createRoute(endpoint || fileOrPath, handlers);
}

/**
 * Add the given `RequestHandler`'s within `endpoit`.
 *
 * @param endpoint
 * @param handlers
 */
export function createRoute(
  endpoint: string | string[],
  handlers: { [method: string]: express.RequestHandler },
) {
  Object.keys(handlers).forEach((method) => {
    const handler = handlers[method];
    let path = endpoint;

    if (!Array.isArray(path)) {
      path = [path, ":id"];
    }

    if (["delete", "get", "patch"].includes(method)) {
      path = path.join("/");
    } else {
      path = path[0];
    }

    if (method === "index") {
      method = "get";
    }

    //
    // implicitly cast to `any` because type 'Router' has no
    // index signature
    (router as any)[method](`/${path.replace(/\/index$/, "")}`, handler);
  });
}

/**
 * @internal
 */
function importHandlers(
  filename: string,
): {
  endpoint?: string | string[];
  handlers: { [method: string]: express.RequestHandler };
} {
  return require(`./routes/${filename}`);
}
