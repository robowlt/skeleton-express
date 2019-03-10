/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { Request, RequestHandler, Response } from "express-serve-static-core";

//
// export const endpoint = ["example", ":id(\d+)"];

export const handlers: { [method: string]: RequestHandler } = {
  async index(req: Request, res: Response): Promise<Response> {
    const { body, query } = req;

    return res.status(req.query.status || 200).jsonp({
      body,
      message: "Hello World!",
      query,
    });
  },
};
