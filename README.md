# skeleton-express
> Optionated skeleton for Express, Objection.js, PostgreSQL and Typescript apps

### TL;DR;
Clone this repo and start coding.

```shell
$ git clone https://github.com/douggr/skeleton-express my-app
$ cd my-app
$ yarn install


# Edit src/knex.ts and configure your database credentials;
# details at https://knexjs.org/#Installation
#
# OR
# set a DATABASE_URL env variable
$ DATABASE_URL="postgres://user:pass@host:port/example-db" yarn start
```

By default all requests requires a `Bearer` header, you can disable
it with a `$beforeAll` within your handlers:

```ts
import { Request, Response } from "express";

export const endpoint = ["example"];

export const handlers = {
  // disable authentication requirement
  async $beforeAll(req: Request, res: Response): Promise<Response> {
    return Promise.resolve("next");
  },

  /**
   * Show the example page
   *
   * ```GET /example```
   */
  async get(req: Request, res: Response): Promise<Response> {
    return res.jsonp("YO! This is the example page");
  }
};
```

In dev or staging environments, you can fake authentication
with `jane-doe` query paramenter: `http://127.0.0.1:8042/users?jane-doe&admin`;
avaiable options are described in `src/middlewares.ts`;

### Yarn scripts
#### create:model
If you're using PostgreSQL, you can create basic models with `create:model` script:

```shell
$ DATABASE_URL="postgres://user:pass@host:port/example-db" yarn create:model $tablename
```

#### format
Apply prettier and ts-lint:

```shell
$ yarn format
```

#### test
```shell
$ yarn test
```

#### build
```shell
$ yarn build
# OR skipping tests
$ yarn build:fast
```
