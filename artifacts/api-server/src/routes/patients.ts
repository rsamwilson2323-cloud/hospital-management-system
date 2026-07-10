import { Router } from "express";
import { patients } from "../store.js";
import { CreatePatientBody, UpdatePatientBody } from "@workspace/api-zod";

const router = Router();

router.get("/patients", (req, res) => {
  const { search, bloodGroup } = req.query as Record<string, string>;
  let list = patients.all();
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(s) || p.phone.includes(s));
  }
  if (bloodGroup) list = list.filter(p => p.bloodGroup === bloodGroup);
  res.json(list);
});

router.post("/patients", (req, res) => {
  const body = CreatePatientBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const patient = patients.insert({
    name: d.name, age: d.age, gender: d.gender,
    bloodGroup: d.bloodGroup ?? "",
    address: d.address ?? "",
    phone: d.phone,
    email: d.email ?? "",
    emergencyContact: d.emergencyContact ?? "",
    diseaseHistory: d.diseaseHistory ?? "",
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(patient);
});

router.get("/patients/:id", (req, res) => {
  const patient = patients.find(Number(req.params.id));
  if (!patient) { res.status(404).json({ error: "Patient not found" }); return; }
  res.json(patient);
});

router.patch("/patients/:id", (req, res) => {
  const body = UpdatePatientBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const patient = patients.update(Number(req.params.id), body.data);
  if (!patient) { res.status(404).json({ error: "Patient not found" }); return; }
  res.json(patient);
});

router.delete("/patients/:id", (req, res) => {
  patients.remove(Number(req.params.id));
  res.status(204).send();
});

export default router;
