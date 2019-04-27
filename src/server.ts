/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import { Request, Response } from "express";
import * as express from "express";
import PromiseRouter from "express-promise-router";
import * as helmet from "helmet";
import morgan = require("morgan");
import { APP_PRODUCTION } from "./environment";
import middlewares from "./middlewares";

export const router = PromiseRouter();
export const server = express()
  .set("jsonp callback name", "cb")
  .set("port", process.env.PORT || 8042)
  .set("trust proxy", 1)
  .use(bodyParser.json({ strict: true, type: "application/json" }))
  .use(compression())
  .use(cors())
  .use(helmet())
  .use(
    morgan((tokens, req, res) => {
      let statusColor = "32m"; // green

      if (res.statusCode > 299) {
        statusColor = "36m"; // cyan
      }

      if (res.statusCode > 399) {
        statusColor = "33m"; // yellow
      }

      if (res.statusCode > 499) {
        statusColor = "31m"; // red
      }

      return [
        `\x1b[0;${statusColor}[${tokens.date(req, res)}]\x1b[0m`,
        // tokens.res(req, res, "content-length"),
        tokens.status(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens["user-agent"](req, res),
      ].join(" ");
    }),
  )
  .use(async(_, r, n) => {
    if (!APP_PRODUCTION) {
      r.set("Cache-Control", "no-store,no-cache,must-revalidate,private");
    }

    return n();
  })
  .use(router);

middlewares.forEach((mw) => router.use(mw));

export function ensureIdentity(
  req: Request,
  res: Response,
): Promise<string | Response> {
  if (req.identity) {
    return Promise.resolve("next");
  }

  return req.Forbidden(401);
}

/**
 * Import `RequestHandler`'s from the given `fileOrPath`.
 *
 * @param fileOrPath file or path inside the `routes` directory
 */
export function addRoutesFromPath(fileOrPath: string): void {
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
  //
  const { $beforeAll } = handlers;

  Object.keys(handlers).forEach((method) => {
    if ("$beforeAll" === method) {
      return true;
    }

    const handler: express.RequestHandler = handlers[method];
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

    path = `/${path.replace(/\/index$/, "")}`;

    if (!$beforeAll || typeof $beforeAll !== "function") {
      (router as any)[method](path, ensureIdentity, handler);
    } else {
      (router as any)[method](path, $beforeAll, handler);
    }
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
