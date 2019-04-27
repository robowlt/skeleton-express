/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { sign, verify } from "jsonwebtoken";
import { APP_JWT_SECRET } from "./environment";

export const camelize = (str: string, ucfirstchar = false): string => {
  const result = str
    .toLowerCase()
    .replace(/^([A-Z])|[\s-_]+([\w])/g, (_, p1, p2) => {
      return p2 ? p2.toUpperCase() : p1.toLowerCase();
    });

  // prettier-ignore
  return (ucfirstchar ? ucfirst(result) : result).replace(/\s+/g, "");
};

export const token = {
  /**
   * Creates a token using a strong one-way hashing algorithm.
   */
  create: (
    data: object,
    expiresIn?: string,
    secret: string = APP_JWT_SECRET,
  ): string => {
    if (expiresIn) {
      return sign(data, secret, { expiresIn });
    }

    return sign(data, secret).replace("/", "$");
  },

  /**
   * Verifies a token.
   */
  verify: (str: string, secret: string = APP_JWT_SECRET): any => {
    return verify(str.replace("$", "/"), secret);
  },
};

const ucfirst = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};
