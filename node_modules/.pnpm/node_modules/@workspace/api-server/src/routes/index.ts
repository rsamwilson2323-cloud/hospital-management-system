import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import doctorsRouter from "./doctors";
import appointmentsRouter from "./appointments";
import medicalRecordsRouter from "./medical-records";
import billsRouter from "./bills";
import medicinesRouter from "./medicines";
import labReportsRouter from "./lab-reports";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(patientsRouter);
router.use(doctorsRouter);
router.use(appointmentsRouter);
router.use(medicalRecordsRouter);
router.use(billsRouter);
router.use(medicinesRouter);
router.use(labReportsRouter);
router.use(dashboardRouter);

export default router;
