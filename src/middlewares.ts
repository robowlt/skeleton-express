/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { Identity } from "@dl2/identity-interface";
import { Request, Response } from "express";
import { APP_PRODUCTION } from "./environment";

export default [
  //
  // [BEGIN fake-auth]
  async(req: Request, res: Response): Promise<string> => {
    if (APP_PRODUCTION || req.query["jane-doe"] === undefined) {
      return Promise.resolve("next");
    }

    const chance = require("chance")();
    const { token } = new Identity({
      email: req.query.email || chance.email(),
      id: req.query.id || "ac3d75d0-456c-478c-9ed5-e8ba1e93b4e5",
      isAdmin: req.query.admin !== undefined,
      isStaff: req.query.staff !== undefined,
      name: req.query.name || chance.name(),
      surname: "",
      userAgent: `${req.headers["user-agent"]}`,
      username: req.query.username || chance.twitter().slice(1),
      verified: true,
    }).sign();

    req.headers.authorization = `Bearer ${token}`;

    return Promise.resolve("next");
  },
  // [END fake-auth]

  async(req: Request, res: Response) => {
    req.BadRequest = (message: string | string[]) => {
      if (!Array.isArray(message)) {
        message = [message];
      }

      return res.status(400).jsonp(
        // tslint:disable max-line-length
        // prettier-ignore
        `value for the following field${message.length > 1 ? "s are" : " is"} either empty or invalid: ${message.join(", ")}`,
        // tslint:enable
      );
    };

    req.Forbidden = (status: number = 403, message?: string) => {
      // prettier-ignore
      message = message || [
        "the server could not verify that",
        "you are authorized to access this resource",
      ].join(" ");

      return res.status(status).jsonp(message.replace("'", "’"));
    };

    req.NotFound = () => {
      return res.status(404).jsonp("not found");
    };

    req.UnprocessableEntity = (message: string = "unprocessable entity") => {
      return res.status(422).jsonp(message.replace("'", "’"));
    };

    try {
      req.identity = Identity.fromHeader(req);
    } catch (E) {
      // don't return `req.Forbidden(401)`; it'll
      // blow up the whole flow
    }

    return Promise.resolve("next");
  },
];
