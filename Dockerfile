FROM node:18

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qy libc++1

WORKDIR /app
RUN npm install workerd
COPY config.capnp serve.js cfworker.js ./

CMD ["./node_modules/.bin/workerd", "serve", "config.capnp"]
