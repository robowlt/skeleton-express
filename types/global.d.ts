/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */
/// <reference types="node" />

import { Identity } from "@dl2/identity-interface";

declare global {
  namespace Express {
    interface Request {
      BadRequest: (message: string | string[]) => any;
      Forbidden: (status?: number, message?: string) => any;
      identity?: Identity;
      NotFound: () => any;
      UnprocessableEntity: (message: string) => any;
    }
  }
}
