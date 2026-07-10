import { Router } from "express";
import { medicalRecords, patients, doctors } from "../store.js";
import { CreateMedicalRecordBody, UpdateMedicalRecordBody } from "@workspace/api-zod";

const router = Router();

function enrich(rec: ReturnType<typeof medicalRecords.all>[number]) {
  const patient = patients.find(rec.patientId);
  const doctor  = rec.doctorId ? doctors.find(rec.doctorId) : null;
  return { ...rec, patientName: patient?.name ?? null, doctorName: doctor?.name ?? null };
}

router.get("/medical-records", (req, res) => {
  const { patientId, doctorId } = req.query as Record<string, string>;
  let list = medicalRecords.all();
  if (patientId) list = list.filter(r => r.patientId === Number(patientId));
  if (doctorId)  list = list.filter(r => r.doctorId  === Number(doctorId));
  list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  res.json(list.map(enrich));
});

router.post("/medical-records", (req, res) => {
  const body = CreateMedicalRecordBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const record = medicalRecords.insert({
    patientId: d.patientId,
    doctorId: d.doctorId ?? null,
    diagnosis: d.diagnosis ?? "",
    prescription: d.prescription ?? null,
    treatment: d.treatment ?? null,
    notes: d.notes ?? null,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(enrich(record));
});

router.get("/medical-records/:id", (req, res) => {
  const record = medicalRecords.find(Number(req.params.id));
  if (!record) { res.status(404).json({ error: "Record not found" }); return; }
  res.json(enrich(record));
});

router.patch("/medical-records/:id", (req, res) => {
  const body = UpdateMedicalRecordBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const record = medicalRecords.update(Number(req.params.id), body.data);
  if (!record) { res.status(404).json({ error: "Record not found" }); return; }
  res.json(enrich(record));
});

export default router;
