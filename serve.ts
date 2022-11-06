import { Hono } from "hono";
import { retrieve, retrieveStream } from "./retrieve";

interface Env {
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  let body = await retrieve("index.html", { kvNamespace: c.env.KV });
  body.type = "text/html";

  let home = await retrieve("home.html", { kvNamespace: c.env.KV });

  body.value = body.value.replace("<!-- CONTENT -->", home.value);

  return c.newResponse(body.value, 200, { "Content-Type": "text/html" });
});

app.get("/home.html", async (c) => {
  let body = await retrieveStream("home.html", { kvNamespace: c.env.KV });
  body.type = "text/html";
  return c.newResponse(body.stream, 200, {});
});

app.get("/blog.html", async (c) => {
  let body = await retrieveStream("blog.html", { kvNamespace: c.env.KV });
  body.type = "text/html";
  return c.newResponse(body.stream, 200, {});
});

app.get("/favicon.ico", async (c) => {
  let f = Bun.file("./favicon.ico");

  return c.newResponse(f.stream(), 200, {});
});

app.get("/static/*", async (c) => {
  let url = new URL(c.req.url);
  let path = `.${url.pathname}`;
  let body = await retrieveStream(path);

  return c.newResponse(await body.stream, 200, {});
});

app.get("/debug", async (c) => {
  let body: string = "Hello world! (debug)";
  return c.text(body);
});

export default {
  port: 3000,
  fetch: app.fetch,
};
