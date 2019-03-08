/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { NextFunction, Request, Response } from "express";
import { server } from "./server";

// very basic and useless error handler :)
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // tslint:disable-next-line no-console
  console.log(err);

  return res.jsonp(err);
});
