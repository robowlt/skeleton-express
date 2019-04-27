/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { Request, Response } from "express";

export const endpoint = [""];

export const handlers = {
  // /**
  //  * Enrure the user is authenticated.
  //  */
  // req.EnsureIdentity = async($req: Request, $res: Response): Promise<string> => {
  //   return new Promise((resolve) => {
  //     if (!$req.identity) {
  //       return $req.Forbidden(401);
  //     }
  //
  //     resolve("next");
  //   });
  // };

  /**
   * ```GET /```
   */
  async index(req: Request, res: Response): Promise<Response> {
    return res.jsonp("Hello World");
  },
};
