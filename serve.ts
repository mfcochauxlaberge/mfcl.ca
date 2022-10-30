import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  let f = Bun.file("./index.html");

  return c.newResponse(f.stream(), 200, {});
});

app.get("/favicon.ico", async (c) => {
  let f = Bun.file("./favicon.ico");

  return c.newResponse(f.stream(), 200, {});
});

app.get("/static/*", async (c) => {
  let url = new URL(c.req.url);

  let path = `.${url.pathname}`;
  let f = Bun.file(path);

  return c.newResponse(f.stream(), 200, {});
});

export default {
  port: 3000,
  fetch: app.fetch,
};
