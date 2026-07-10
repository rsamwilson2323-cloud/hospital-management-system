import { Router } from "express";
import { patients, doctors, appointments, bills, medicines, labReports } from "../store.js";

const router = Router();

router.get("/dashboard/stats", (_req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const allBills = bills.all();
  const allAppts = appointments.all();
  const allMeds  = medicines.all();

  res.json({
    totalPatients:        patients.all().length,
    totalDoctors:         doctors.all().length,
    todayAppointments:    allAppts.filter(a => a.date === today).length,
    pendingAppointments:  allAppts.filter(a => a.status === "scheduled").length,
    completedAppointments:allAppts.filter(a => a.status === "completed").length,
    totalRevenue:         allBills.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
    pendingBills:         allBills.filter(b => b.paymentStatus === "pending").length,
    lowStockMedicines:    allMeds.filter(m => m.quantity <= 10).length,
  });
});

router.get("/dashboard/revenue", (_req, res) => {
  const paid = bills.all().filter(b => b.paymentStatus === "paid");
  const map = new Map<string, { month: string; revenue: number; bills: number }>();
  for (const bill of paid) {
    const d = new Date(bill.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short" }) + " " + d.getFullYear();
    const existing = map.get(key) ?? { month: label, revenue: 0, bills: 0 };
    existing.revenue += bill.amount;
    existing.bills   += 1;
    map.set(key, existing);
  }
  const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
  res.json(sorted.map(([, v]) => v));
});

router.get("/dashboard/appointment-trends", (_req, res) => {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const recent = appointments.all().filter(a => a.date >= cutoffStr);
  const map = new Map<string, { date: string; scheduled: number; completed: number; cancelled: number }>();
  for (const a of recent) {
    const entry = map.get(a.date) ?? { date: a.date, scheduled: 0, completed: 0, cancelled: 0 };
    if (a.status === "scheduled") entry.scheduled++;
    else if (a.status === "completed") entry.completed++;
    else if (a.status === "cancelled") entry.cancelled++;
    map.set(a.date, entry);
  }
  res.json([...map.values()].sort((a, b) => a.date.localeCompare(b.date)));
});

router.get("/dashboard/doctor-stats", (_req, res) => {
  const allDoctors = doctors.all();
  const allAppts   = appointments.all();
  const stats = allDoctors.map(d => {
    const appts = allAppts.filter(a => a.doctorId === d.id);
    const uniquePatients = new Set(appts.map(a => a.patientId)).size;
    return {
      doctorId: d.id,
      doctorName: d.name,
      specialization: d.specialization,
      totalAppointments: appts.length,
      completedAppointments: appts.filter(a => a.status === "completed").length,
      patients: uniquePatients,
    };
  });
  stats.sort((a, b) => b.totalAppointments - a.totalAppointments);
  res.json(stats.slice(0, 10));
});

router.get("/dashboard/recent-activity", (_req, res) => {
  const allPatients = patients.all().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const allAppts    = appointments.all().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const allBills    = bills.all().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const allLabs     = labReports.all().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const activities = [
    ...allPatients.map(p => ({ id: `patient-${p.id}`, type: "patient",     description: `New patient registered: ${p.name}`,             timestamp: p.createdAt,  entityId: p.id })),
    ...allAppts.map(a =>    ({ id: `appt-${a.id}`,    type: "appointment", description: `Appointment ${a.status}`,                       timestamp: a.createdAt,  entityId: a.id })),
    ...allBills.map(b =>    ({ id: `bill-${b.id}`,    type: "bill",        description: `Bill of $${b.amount.toFixed(2)} – ${b.paymentStatus}`, timestamp: b.createdAt, entityId: b.id })),
    ...allLabs.map(r =>     ({ id: `lab-${r.id}`,     type: "lab",         description: `Lab report: ${r.testName}`,                     timestamp: r.createdAt,  entityId: r.id })),
  ];
  activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  res.json(activities.slice(0, 20));
});

export default router;
