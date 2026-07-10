import { Router } from "express";
import { appointments, patients, doctors } from "../store.js";
import { CreateAppointmentBody, UpdateAppointmentBody } from "@workspace/api-zod";

const router = Router();

function enrich(appt: ReturnType<typeof appointments.all>[number]) {
  const patient = patients.find(appt.patientId);
  const doctor  = doctors.find(appt.doctorId);
  return { ...appt, patientName: patient?.name ?? null, doctorName: doctor?.name ?? null };
}

router.get("/appointments", (req, res) => {
  const { patientId, doctorId, status, date } = req.query as Record<string, string>;
  let list = appointments.all();
  if (patientId) list = list.filter(a => a.patientId === Number(patientId));
  if (doctorId)  list = list.filter(a => a.doctorId  === Number(doctorId));
  if (status)    list = list.filter(a => a.status    === status);
  if (date)      list = list.filter(a => a.date      === date);
  list.sort((a, b) => a.date.localeCompare(b.date));
  res.json(list.map(enrich));
});

router.post("/appointments", (req, res) => {
  const body = CreateAppointmentBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const appt = appointments.insert({
    patientId: d.patientId, doctorId: d.doctorId,
    date: d.date, time: d.time,
    status: "scheduled",
    notes: d.notes ?? null,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(enrich(appt));
});

router.get("/appointments/:id", (req, res) => {
  const appt = appointments.find(Number(req.params.id));
  if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
  res.json(enrich(appt));
});

router.patch("/appointments/:id", (req, res) => {
  const body = UpdateAppointmentBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const appt = appointments.update(Number(req.params.id), body.data);
  if (!appt) { res.status(404).json({ error: "Appointment not found" }); return; }
  res.json(enrich(appt));
});

router.delete("/appointments/:id", (req, res) => {
  appointments.remove(Number(req.params.id));
  res.status(204).send();
});

export default router;
