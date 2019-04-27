/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { NextFunction, Request, Response } from "express";
import { server } from "./server";

// very basic and useless error handler :)
server.use(
  (err: Error | any, req: Request, res: Response, _: NextFunction) => {
    // tslint:disable-next-line no-console
    console.log(err);

    // from `body-parser`
    if (err.name === "SyntaxError") {
      return res
        .status(400)
        .jsonp("request body should be a valid JSON object");
    }

    // from `jsonwebtoken`
    if (err.name === "TokenExpiredError") {
      return req.UnprocessableEntity(
        "given token is either invalid or expired",
      );
    }

    // from `objectionjs`
    if (err.name === "NotFoundError") {
      return req.NotFound();
    }

    return res.status(err.statusCode || 500).jsonp(err.message);
  },
);
