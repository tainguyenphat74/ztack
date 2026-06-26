import { serve } from "@hono/node-server";

import { createApp } from "./app";
import { env } from "./lib/env";

const app = createApp();

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
