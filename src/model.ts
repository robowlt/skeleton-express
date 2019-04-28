/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import {
  Model as ObjectionModel,
  ModelOptions,
  QueryContext,
  raw,
} from "objection";
import { DbErrors } from "objection-db-errors";

export class Model extends DbErrors(ObjectionModel) {
  /**
   * Called before a model is inserted into the database.
   *
   * You can return a promise from this function if you need to do
   * asynchronous stuff. You can also throw an exception to abort
   * the insert and reject the query. This can be useful if you
   * need to do insert specific validation.
   */
  public async $beforeInsert(
    queryContext: QueryContext,
  ): Promise<QueryContext> {
    //
    // prettier-ignore
    return Promise.resolve(this.$beforeSave(queryContext))
      .then(() => super.$beforeInsert(queryContext));
  }

  /**
   * Called before a model is updated.
   *
   * You can return a promise from this function if you need to do
   * asynchronous stuff. You can also throw an exception to abort
   * the update and reject the query. This can be useful if you
   * need to do update specific validation.
   */
  public async $beforeUpdate(
    modelOptions: ModelOptions,
    queryContext: QueryContext,
  ): Promise<QueryContext> {
    //
    // prettier-ignore
    return Promise.resolve(this.$beforeSave(queryContext, modelOptions))
      .then(() => super.$beforeUpdate(modelOptions, queryContext));
  }

  /**
   * Called as a hook before `$beforeInsert` and `$beforeUpdate`.
   *
   * You can return a promise from this function if you need to do
   * asynchronous stuff. You can also throw an exception to abort
   * the save and reject the query.
   */
  public async $beforeSave(
    queryContext: QueryContext,
    modelOptions?: ModelOptions,
  ): Promise<{ queryContext: QueryContext; modelOptions?: ModelOptions }> {
    //
    // prettier-ignore
    return Promise.resolve({ queryContext, modelOptions });
  }
}
