import app from "./app";
import { logger } from "./lib/logger";

const missingVars = (["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const).filter(
  (v) => !process.env[v],
);
if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables for auth: ${missingVars.join(", ")}. ` +
      "The management API cannot start without a Supabase auth configuration.",
  );
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
