import { Router } from "express";
import { doctors } from "../store.js";
import { CreateDoctorBody, UpdateDoctorBody } from "@workspace/api-zod";

const router = Router();

router.get("/doctors", (req, res) => {
  const { search, specialization } = req.query as Record<string, string>;
  let list = doctors.all();
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(s) || d.email.toLowerCase().includes(s));
  }
  if (specialization) {
    const sp = specialization.toLowerCase();
    list = list.filter(d => d.specialization.toLowerCase().includes(sp));
  }
  res.json(list);
});

router.post("/doctors", (req, res) => {
  const body = CreateDoctorBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const doctor = doctors.insert({
    name: d.name, specialization: d.specialization,
    qualification: d.qualification ?? "",
    experience: d.experience ?? 0,
    phone: d.phone,
    email: d.email,
    availability: d.availability ?? "",
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(doctor);
});

router.get("/doctors/:id", (req, res) => {
  const doctor = doctors.find(Number(req.params.id));
  if (!doctor) { res.status(404).json({ error: "Doctor not found" }); return; }
  res.json(doctor);
});

router.patch("/doctors/:id", (req, res) => {
  const body = UpdateDoctorBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const doctor = doctors.update(Number(req.params.id), body.data);
  if (!doctor) { res.status(404).json({ error: "Doctor not found" }); return; }
  res.json(doctor);
});

router.delete("/doctors/:id", (req, res) => {
  doctors.remove(Number(req.params.id));
  res.status(204).send();
});

export default router;
