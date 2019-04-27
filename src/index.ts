/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { Request, Response } from "express";
import "full-icu";
import { Model } from "objection";
import "./error-handler";
import { knex } from "./knex";
import { addRoutesFromPath, server } from "./server";

addRoutesFromPath("index");

//
// handle 404 errors
server.use(
  async(req: Request, _: Response): Promise<Response> => {
    return req.NotFound();
  },
);

Model.knex(knex);

server.listen(server.get("port"), () => {
  // tslint:disable no-console max-line-length
  // prettier-ignore
  console.log(`\x1b[1m\x1b[36mdl2ws server\x1b[0m is running in 127.0.0.1:${server.get("port")} (PID: ${process.pid})`);
  // tslint:enable
});
