import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? ""
);

router.get("/properties/live", async (req, res) => {
  try {
    res.set("Cache-Control", "public, max-age=300");

    const { data, error } = await supabase
      .from("properties")
      .select("id, name, postcode, beds, monthly_revenue, photos")
      .eq("status", "live")
      .eq("service_type", "stays");

    if (error) {
      req.log.error({ error }, "Failed to fetch live properties");
      return res.status(500).json({ error: "Failed to fetch properties." });
    }

    res.json(data ?? []);
  } catch (err) {
    req.log.error({ err }, "Public properties handler error");
    res.status(500).json({ error: "Connection issue. Please try again." });
  }
});

export default router;
