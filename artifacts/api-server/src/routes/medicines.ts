import { Router } from "express";
import { medicines } from "../store.js";
import { CreateMedicineBody, UpdateMedicineBody } from "@workspace/api-zod";

const router = Router();

router.get("/medicines", (req, res) => {
  const { search, lowStock } = req.query as Record<string, string>;
  let list = medicines.all();
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(s));
  }
  if (lowStock === "true") list = list.filter(m => m.quantity <= 10);
  list.sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

router.post("/medicines", (req, res) => {
  const body = CreateMedicineBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const med = medicines.insert({
    name: d.name, quantity: d.quantity, price: d.price,
    expiryDate: d.expiryDate ?? "",
    manufacturer: d.manufacturer ?? "",
    category: d.category ?? "",
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(med);
});

router.get("/medicines/:id", (req, res) => {
  const med = medicines.find(Number(req.params.id));
  if (!med) { res.status(404).json({ error: "Medicine not found" }); return; }
  res.json(med);
});

router.patch("/medicines/:id", (req, res) => {
  const body = UpdateMedicineBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const med = medicines.update(Number(req.params.id), body.data);
  if (!med) { res.status(404).json({ error: "Medicine not found" }); return; }
  res.json(med);
});

router.delete("/medicines/:id", (req, res) => {
  medicines.remove(Number(req.params.id));
  res.status(204).send();
});

export default router;
