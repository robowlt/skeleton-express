/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { Model } from "objection";
import { knex } from "./knex";
import { addRouteFromPath, server } from "./server";

import "./error-handler";

addRouteFromPath("example");

//
// here, `addRouteFromPath("example")` is the same
// as `import "./routes/example";`
// where `./routes/example` makes a call
// to `createRoute("example", { handlers })`:
//
// createRoute("example", {
//   async index(req: Request, res: Response): Promise<Response> {
//     return res.jsonp("this was called using `createRoute`");
//   }
// });
//

server.use(
  async(_, res): Promise<any> => {
    return res.status(404).jsonp({
      message: "Not Found",
    });
  },
);

Model.knex(knex);

server.listen(server.get("port"), () => {
  // tslint:disable no-console max-line-length
  // prettier-ignore
  console.log(`\x1b[1m\x1b[36mdl2ws server\x1b[0m is running in 127.0.0.1:${server.get("port")} (PID: ${process.pid})`);
  // tslint:enable
});
