/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

// tslint:disable:max-classes-per-file
declare module "objection-db-errors" {
  import { Model } from "objection";

  export function DbErrors<M extends typeof Model>(
    ModelClass: typeof Model,
  ): M;

  export function wrapError(err: any): void;

  export class DBError {
    public client?: any;
    public column?: string;
    public columns?: string[];
    public constraint?: string;
    public name?: any;
    public nativeError: Error;
    public table?: string;
  }

  export class CheckViolationError extends DBError {}
  export class ConstraintViolationError extends DBError {}
  export class DataError extends DBError {}
  export class ForeignKeyViolationError extends DBError {}
  export class NotNullViolationError extends DBError {}
  export class UniqueViolationError extends DBError {}
}
