/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

// tslint:disable:max-classes-per-file
declare module "objection-find" {
  import {
    Model,
    ModelClass,
    QueryBuilder,
    RelationExpression,
  } from "objection";

  export default function findQuery<M extends typeof Model>(
    ModelClass: typeof Model,
  ): FindQueryBuilder;

  export interface RegisterFilter {
    args: any;
    method: string;
  }

  /**
   * A class for building HTTP query parameter controlled find
   * queries for objection.js models.
   *
   * @see https://github.com/Vincit/objection-find
   */
  export class FindQueryBuilder {
    constructor(modelClass: typeof Model);

    /**
     * Use this method to whitelist property references.
     *
     * By default all properties and relations' properties can
     * be used in the filters and in orderBy. This method can be
     * used to whitelist only a subset of them.
     */
    public allow(...properties: string[]): FindQueryBuilder;

    /**
     * Allow all property references.
     *
     * This is true by default.
     */
    public allowAll(): FindQueryBuilder;

    /**
     * Sets/gets the allowed eager expression.
     *
     * Calls the `allowEager` method of `QueryBuilder`.
     */
    public allowEager(
      exp: string | RelationExpression,
    ): string | RelationExpression | FindQueryBuilder;

    /**
     * Builds the find query for the given query parameters.
     */
    public build(
      params: any,
      builder?: QueryBuilder<Model>,
    ): QueryBuilder<Model>;

    /**
     * Registers a filter function.
     *
     * Given a query parameter `someProp:eq=10` the `eq` part is
     * the filter. The filter name (in this case 'eq') is mapped
     * to a function that performs the filtering.
     *
     * Filter functions take in a `PropertyRef` instance of the
     * property to be filtered, the filter value and the model
     * class constructor. The filter functions must return an
     * object `{method: string, args: *}`.
     */
    public registerFilter(
      filterName: string,
      filter: (ref: PropertyRef, value: string, M?: Model) => RegisterFilter,
    ): FindQueryBuilder;

    /**
     * Give names for the special parameters.
     *
     * This can be used to rename a special parameter for example
     * if it collides with a property name.
     */
    public specialParameter(
      newName: string,
      oldName: string,
    ): FindQueryBuilder;
  }

  /**
   * Refers to a property of the model class we are building a
   * query for.
   *
   * For example property reference `firstName` refers to the
   * model class's `firstName` property and `movies.name` refers
   * to the `name` property of the model class's `movies` relation.
   */
  export class PropertyRef {
    constructor(str: string, builder: FindQueryBuilder);

    /**
     * Builds a where statement.
     */
    public buildFilter(
      param: any,
      builder: QueryBuilder<Model>,
      boolOp?: string,
    ): void;

    /**
     * Returns the full column name to be used in the queries.
     *
     * The returned string contains the appropriate table name or
     * table alias.
     *
     * For example `Person.firstName` or `Animal.name`.
     *
     * @returns {string}
     */
    public fullColumnName(): string;
  }
}
