import { createClient } from "@supabase/supabase-js";
import { type Request, type Response, type NextFunction } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

const ALLOWED_ROLES = new Set(["admin", "staff"]);

const WWW_AUTHENTICATE = 'Bearer realm="management-api"';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.setHeader("WWW-Authenticate", WWW_AUTHENTICATE);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      req.log.warn({ error }, "Auth token verification failed");
      res.setHeader("WWW-Authenticate", WWW_AUTHENTICATE);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const role = data.user.app_metadata?.role as string | undefined;

    if (!role || !ALLOWED_ROLES.has(role)) {
      req.log.warn(
        { userId: data.user.id, role },
        "Authenticated user lacks required role for management API",
      );
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    req.authenticatedUser = data.user;
    next();
  } catch (err) {
    req.log.error({ err }, "requireAuth: unexpected error verifying token");
    res.status(500).json({ error: "Internal server error" });
  }
}
