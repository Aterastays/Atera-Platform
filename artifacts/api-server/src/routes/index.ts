import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customersRouter from "./customers";
import devicesRouter from "./devices";
import alertsRouter from "./alerts";
import ticketsRouter from "./tickets";
import dashboardRouter from "./dashboard";
import enquiryRouter from "./enquiry";
import publicPropertiesRouter from "./publicProperties";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiryRouter);
router.use(publicPropertiesRouter);
router.use(customersRouter);
router.use(devicesRouter);
router.use(alertsRouter);
router.use(ticketsRouter);
router.use(dashboardRouter);

export default router;
