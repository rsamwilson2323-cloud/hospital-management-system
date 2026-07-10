import { Router } from "express";
import { bills, patients } from "../store.js";
import { CreateBillBody, UpdateBillBody } from "@workspace/api-zod";

const router = Router();

function enrich(bill: ReturnType<typeof bills.all>[number]) {
  const patient = patients.find(bill.patientId);
  return { ...bill, patientName: patient?.name ?? null };
}

router.get("/bills", (req, res) => {
  const { patientId, paymentStatus } = req.query as Record<string, string>;
  let list = bills.all();
  if (patientId)     list = list.filter(b => b.patientId     === Number(patientId));
  if (paymentStatus) list = list.filter(b => b.paymentStatus === paymentStatus);
  list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  res.json(list.map(enrich));
});

router.post("/bills", (req, res) => {
  const body = CreateBillBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const d = body.data;
  const bill = bills.insert({
    patientId: d.patientId,
    consultationFee: d.consultationFee ?? null,
    labCharges: d.labCharges ?? null,
    medicineCharges: d.medicineCharges ?? null,
    amount: d.amount,
    paymentStatus: "pending",
    paymentDate: null,
    description: d.description ?? null,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(enrich(bill));
});

router.get("/bills/:id", (req, res) => {
  const bill = bills.find(Number(req.params.id));
  if (!bill) { res.status(404).json({ error: "Bill not found" }); return; }
  res.json(enrich(bill));
});

router.patch("/bills/:id", (req, res) => {
  const body = UpdateBillBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const bill = bills.update(Number(req.params.id), body.data);
  if (!bill) { res.status(404).json({ error: "Bill not found" }); return; }
  res.json(enrich(bill));
});

export default router;
