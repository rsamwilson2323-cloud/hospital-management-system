import { Router } from "express";
import { labReports, patients } from "../store.js";
import { CreateLabReportBody, UpdateLabReportBody } from "@workspace/api-zod";

const router = Router();

function enrich(rep: ReturnType<typeof labReports.all>[number]) {
  const patient = patients.find(rep.patientId);
  return { ...rep, patientName: patient?.name ?? null };
}

router.get("/lab-reports", (req, res) => {
  const { patientId } = req.query as Record<string, string>;
  let list = labReports.all();
  if (patientId) list = list.filter(r => r.patientId === Number(patientId));
  list.sort((a, b) => a.reportDate.localeCompare(b.reportDate));
  res.json(list.map(enrich));
});

router.post("/lab-reports", (req, res) => {
  const body = CreateLabReportBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const report = labReports.insert({
    patientId: d.patientId,
    testName: d.testName,
    result: d.result ?? null,
    status: d.status ?? "pending",
    reportDate: d.reportDate,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(enrich(report));
});

router.get("/lab-reports/:id", (req, res) => {
  const report = labReports.find(Number(req.params.id));
  if (!report) { res.status(404).json({ error: "Lab report not found" }); return; }
  res.json(enrich(report));
});

router.patch("/lab-reports/:id", (req, res) => {
  const body = UpdateLabReportBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const report = labReports.update(Number(req.params.id), body.data);
  if (!report) { res.status(404).json({ error: "Lab report not found" }); return; }
  res.json(enrich(report));
});

export default router;
