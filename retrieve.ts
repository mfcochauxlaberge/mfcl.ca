import { readFileSync } from "fs";

export type Stream = {
  stream: ReadableStream;
  type: string;
  value?: string;
};

export type Resource = {
  value: string;
  type: string;
};

export const retrieve = async (
  resource: string,
  env?: { kvNamespace?: KVNamespace }
) => {
  let stream = await retrieveStream(resource, env);
  let data = (await (
    await stream.stream.getReader().read()
  ).value) as Uint8Array;

  let dec = new TextDecoder();
  let readStr = dec.decode(data);

  stream.value = String(data);

  return {
    value: readStr,
    type: "unknown",
  } as Resource;
};

export const retrieveStream = async (
  resource: string,
  env?: { kvNamespace?: KVNamespace }
) => {
  // Bun environment
  if (typeof Bun !== "undefined") {
    let blob = Bun.file(resource);
    return {
      stream: blob.stream(),
      type: blob.type,
    } as Stream;
  }

  // Workerd environment
  if (env.kvNamespace !== undefined) {
    let { readable, writable } = new TransformStream();

    let data = await env.kvNamespace.get("index.html");
    if (data === null) {
      data = "IT WAS NULL";
    }

    let enc = new TextEncoder();
    let writer = writable.getWriter();
    writer.write(enc.encode(String(data)));

    return {
      stream: readable,
      type: "unknown",
    } as Stream;
  }

  // Node environment
  if (typeof process !== "undefined") {
    const fsPkg = "fs";
    const fs = await import(fsPkg);

    const streamPkg = "stream";
    const stream = await import(streamPkg);

    let buf = fs.readFileSync(resource);
    let rs = stream.Readable.from(buf);
    return {
      stream: rs,
      type: "unknown",
    } as Stream;
  }

  throw new Error("no compatible environment");
};
