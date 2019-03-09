/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import { createRoute, router } from "../../server";

//
// fuck you prettier!
// prettier-ignore
router.use("/", async(req, res): Promise<any> => {
  return res.jsonp({
    data: null,
    query: req.query,
    request: `/GET index`,
  });
});

createRoute(["/index", ":id"], {
  async delete(req, res): Promise<any> {
    return res.status(204).jsonp({
      data: req.body,
      query: req.query,
      request: `/DELETE index/${req.params.id}`,
    });
  },

  async get(req, res): Promise<any> {
    return res.jsonp({
      data: null,
      query: req.query,
      request: `/GET index/${req.params.id}`,
    });
  },

  async patch(req, res): Promise<any> {
    return res.jsonp({
      data: req.body,
      query: req.query,
      request: `/PATCH index/${req.params.id}`,
    });
  },

  async post(req, res): Promise<any> {
    return res.status(201).jsonp({
      data: req.body,
      query: req.query,
      request: "/POST index",
    });
  },
});
