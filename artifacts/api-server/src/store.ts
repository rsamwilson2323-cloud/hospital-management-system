import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Data directory lives at project root /data
const DATA_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../data"
);

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read<T>(name: string, seed: T[]): T[] {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(fp, "utf-8")) as T[];
}

function write<T>(name: string, data: T[]): void {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

export class Store<T extends { id: number }> {
  constructor(
    private name: string,
    private seed: T[]
  ) {}

  all(): T[] {
    return read(this.name, this.seed);
  }

  find(id: number): T | undefined {
    return this.all().find((i) => i.id === id);
  }

  insert(data: Omit<T, "id">): T {
    const items = this.all();
    const item = { ...data, id: nextId(items) } as T;
    write(this.name, [...items, item]);
    return item;
  }

  update(id: number, data: Partial<Omit<T, "id">>): T | null {
    const items = this.all();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    write(this.name, items);
    return items[idx];
  }

  remove(id: number): boolean {
    const items = this.all();
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return false;
    write(this.name, next);
    return true;
  }
}

// ─── Types ───────────────────────────────────────────────────
export interface Patient {
  id: number; name: string; age: number; gender: string;
  bloodGroup: string; address: string; phone: string; email: string;
  emergencyContact: string; diseaseHistory: string; createdAt: string;
}
export interface Doctor {
  id: number; name: string; specialization: string; qualification: string;
  experience: number; phone: string; email: string; availability: string;
  createdAt: string;
}
export interface Appointment {
  id: number; patientId: number; doctorId: number; date: string;
  time: string; status: string; notes: string | null; createdAt: string;
}
export interface MedicalRecord {
  id: number; patientId: number; doctorId: number | null;
  diagnosis: string; prescription: string | null; treatment: string | null;
  notes: string | null; createdAt: string;
}
export interface Bill {
  id: number; patientId: number; consultationFee: number | null;
  labCharges: number | null; medicineCharges: number | null; amount: number;
  paymentStatus: string; paymentDate: string | null; description: string | null;
  createdAt: string;
}
export interface Medicine {
  id: number; name: string; quantity: number; expiryDate: string;
  price: number; manufacturer: string; category: string; createdAt: string;
}
export interface LabReport {
  id: number; patientId: number; testName: string; result: string | null;
  status: string; reportDate: string; createdAt: string;
}

// ─── Seed helpers ────────────────────────────────────────────
function daysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0];
}
function daysFromNow(n: number): string {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0];
}
function ts(daysOffset: number): string {
  const d = new Date(); d.setDate(d.getDate() - daysOffset); return d.toISOString();
}

// ─── Seed data ───────────────────────────────────────────────
const PATIENTS: Patient[] = [
  { id:1,  name:"Sarah Mitchell",    age:34, gender:"Female", bloodGroup:"O+",  address:"142 Oak Street, Springfield",         phone:"555-0101", email:"sarah.mitchell@email.com",  emergencyContact:"Tom Mitchell: 555-0102",    diseaseHistory:"Hypertension",                              createdAt:ts(90)  },
  { id:2,  name:"James Thornton",    age:58, gender:"Male",   bloodGroup:"A+",  address:"89 Maple Ave, Riverside",             phone:"555-0103", email:"james.thornton@email.com",  emergencyContact:"Linda Thornton: 555-0104", diseaseHistory:"Type 2 Diabetes, High Cholesterol",         createdAt:ts(85)  },
  { id:3,  name:"Priya Patel",       age:27, gender:"Female", bloodGroup:"B+",  address:"305 Elm Drive, Lakewood",             phone:"555-0105", email:"priya.patel@email.com",     emergencyContact:"Raj Patel: 555-0106",       diseaseHistory:"Asthma",                                    createdAt:ts(80)  },
  { id:4,  name:"Marcus Johnson",    age:45, gender:"Male",   bloodGroup:"AB+", address:"77 Pine Road, Hillside",              phone:"555-0107", email:"marcus.j@email.com",        emergencyContact:"Diane Johnson: 555-0108",  diseaseHistory:"None",                                      createdAt:ts(75)  },
  { id:5,  name:"Emily Chen",        age:31, gender:"Female", bloodGroup:"O-",  address:"223 Cedar Lane, Westview",            phone:"555-0109", email:"emily.chen@email.com",      emergencyContact:"David Chen: 555-0110",     diseaseHistory:"Seasonal Allergies",                        createdAt:ts(70)  },
  { id:6,  name:"Robert Garcia",     age:62, gender:"Male",   bloodGroup:"A-",  address:"418 Birch Blvd, Northgate",           phone:"555-0111", email:"r.garcia@email.com",        emergencyContact:"Maria Garcia: 555-0112",   diseaseHistory:"COPD, Hypertension",                        createdAt:ts(65)  },
  { id:7,  name:"Aisha Williams",    age:23, gender:"Female", bloodGroup:"B-",  address:"56 Willow Way, Southpark",            phone:"555-0113", email:"aisha.w@email.com",         emergencyContact:"James Williams: 555-0114", diseaseHistory:"None",                                      createdAt:ts(60)  },
  { id:8,  name:"Thomas Brown",      age:50, gender:"Male",   bloodGroup:"O+",  address:"891 Ash Court, Eastside",             phone:"555-0115", email:"thomas.brown@email.com",    emergencyContact:"Susan Brown: 555-0116",    diseaseHistory:"Arthritis, Post-hip surgery",               createdAt:ts(55)  },
  { id:9,  name:"Fatima Al-Hassan",  age:38, gender:"Female", bloodGroup:"AB-", address:"12 Rose Garden, Midtown",             phone:"555-0117", email:"fatima.h@email.com",        emergencyContact:"Khalid Hassan: 555-0118",  diseaseHistory:"Migraines",                                 createdAt:ts(50)  },
  { id:10, name:"Daniel Park",       age:41, gender:"Male",   bloodGroup:"B+",  address:"670 Sunset Blvd, Westend",            phone:"555-0119", email:"daniel.park@email.com",     emergencyContact:"Jenny Park: 555-0120",     diseaseHistory:"Hypothyroidism",                            createdAt:ts(45)  },
  { id:11, name:"Linda Okafor",      age:55, gender:"Female", bloodGroup:"O+",  address:"3 Harbour View, Coastline",           phone:"555-0121", email:"linda.okafor@email.com",    emergencyContact:"Emeka Okafor: 555-0122",   diseaseHistory:"Breast Cancer (remission)",                 createdAt:ts(40)  },
  { id:12, name:"Ryan Kowalski",     age:29, gender:"Male",   bloodGroup:"A+",  address:"88 Central Ave, Downtown",            phone:"555-0123", email:"ryan.k@email.com",          emergencyContact:"Anna Kowalski: 555-0124",  diseaseHistory:"None",                                      createdAt:ts(35)  },
  { id:13, name:"Grace Nakamura",    age:47, gender:"Female", bloodGroup:"O-",  address:"231 Sakura Street, Garden District",  phone:"555-0125", email:"grace.n@email.com",         emergencyContact:"Kenji Nakamura: 555-0126", diseaseHistory:"Type 2 Diabetes",                           createdAt:ts(30)  },
  { id:14, name:"Carlos Rivera",     age:33, gender:"Male",   bloodGroup:"B+",  address:"19 Plaza Norte, Eastside",            phone:"555-0127", email:"c.rivera@email.com",        emergencyContact:"Ana Rivera: 555-0128",     diseaseHistory:"None",                                      createdAt:ts(20)  },
  { id:15, name:"Helen Foster",      age:70, gender:"Female", bloodGroup:"A+",  address:"5 Oak Manor Drive, Uptown",           phone:"555-0129", email:"helen.f@email.com",         emergencyContact:"Peter Foster: 555-0130",   diseaseHistory:"Heart Disease, Hypertension",               createdAt:ts(15)  },
];

const DOCTORS: Doctor[] = [
  { id:1, name:"Dr. Catherine Walsh",   specialization:"Cardiology",       qualification:"MD, FACC",    experience:18, phone:"555-0201", email:"c.walsh@hospital.com",    availability:"Mon-Fri 9am-5pm",  createdAt:ts(120) },
  { id:2, name:"Dr. Samuel Okafor",     specialization:"General Medicine", qualification:"MBBS, MD",    experience:12, phone:"555-0202", email:"s.okafor@hospital.com",   availability:"Mon-Sat 8am-4pm",  createdAt:ts(120) },
  { id:3, name:"Dr. Linda Nakamura",    specialization:"Neurology",        qualification:"MD, PhD",     experience:22, phone:"555-0203", email:"l.nakamura@hospital.com", availability:"Tue-Thu 10am-6pm", createdAt:ts(120) },
  { id:4, name:"Dr. Ahmed Hassan",      specialization:"Orthopedics",      qualification:"MS, FRCS",    experience:15, phone:"555-0204", email:"a.hassan@hospital.com",   availability:"Mon-Fri 8am-3pm",  createdAt:ts(120) },
  { id:5, name:"Dr. Rachel Kim",        specialization:"Pediatrics",       qualification:"MD, FAAP",    experience:9,  phone:"555-0205", email:"r.kim@hospital.com",      availability:"Mon-Fri 9am-5pm",  createdAt:ts(120) },
  { id:6, name:"Dr. Michael Torres",    specialization:"Oncology",         qualification:"MD, FASCO",   experience:20, phone:"555-0206", email:"m.torres@hospital.com",   availability:"Wed-Fri 10am-4pm", createdAt:ts(120) },
  { id:7, name:"Dr. Priya Sharma",      specialization:"Endocrinology",    qualification:"MD, DM",      experience:14, phone:"555-0207", email:"p.sharma@hospital.com",   availability:"Mon-Wed 9am-5pm",  createdAt:ts(120) },
  { id:8, name:"Dr. James Whitfield",   specialization:"Pulmonology",      qualification:"MD, FCCP",    experience:17, phone:"555-0208", email:"j.whitfield@hospital.com",availability:"Tue-Sat 8am-4pm",  createdAt:ts(120) },
];

const APPOINTMENTS: Appointment[] = [
  { id:1,  patientId:1,  doctorId:1, date:daysFromNow(0), time:"09:00", status:"scheduled", notes:"Regular cardiac checkup – BP monitoring",      createdAt:ts(2)  },
  { id:2,  patientId:2,  doctorId:7, date:daysFromNow(0), time:"10:30", status:"scheduled", notes:"HbA1c review and insulin adjustment",            createdAt:ts(2)  },
  { id:3,  patientId:13, doctorId:7, date:daysFromNow(0), time:"11:30", status:"scheduled", notes:"Thyroid & blood sugar management",               createdAt:ts(2)  },
  { id:4,  patientId:3,  doctorId:8, date:daysFromNow(0), time:"14:00", status:"scheduled", notes:"Asthma follow-up, spirometry planned",           createdAt:ts(2)  },
  { id:5,  patientId:15, doctorId:1, date:daysFromNow(0), time:"15:30", status:"scheduled", notes:"Post-cardiac event follow-up",                   createdAt:ts(1)  },
  { id:6,  patientId:4,  doctorId:4, date:daysAgo(1),     time:"09:00", status:"completed", notes:"Knee pain – X-ray ordered",                      createdAt:ts(3)  },
  { id:7,  patientId:5,  doctorId:2, date:daysAgo(1),     time:"10:00", status:"completed", notes:"Annual physical examination",                    createdAt:ts(3)  },
  { id:8,  patientId:9,  doctorId:3, date:daysAgo(1),     time:"11:00", status:"completed", notes:"Migraine – MRI results reviewed",                createdAt:ts(3)  },
  { id:9,  patientId:10, doctorId:7, date:daysAgo(1),     time:"14:00", status:"completed", notes:"Hypothyroidism – levothyroxine dose review",     createdAt:ts(3)  },
  { id:10, patientId:6,  doctorId:1, date:daysAgo(2),     time:"09:30", status:"completed", notes:"ECG and lung function test",                     createdAt:ts(4)  },
  { id:11, patientId:11, doctorId:6, date:daysAgo(2),     time:"11:00", status:"completed", notes:"Oncology follow-up – remission check",           createdAt:ts(4)  },
  { id:12, patientId:7,  doctorId:3, date:daysAgo(2),     time:"14:30", status:"cancelled", notes:"Headache – patient cancelled",                   createdAt:ts(4)  },
  { id:13, patientId:8,  doctorId:4, date:daysAgo(3),     time:"10:00", status:"completed", notes:"Post-hip surgery check-up",                      createdAt:ts(5)  },
  { id:14, patientId:12, doctorId:2, date:daysAgo(3),     time:"11:30", status:"completed", notes:"General check-up – healthy",                     createdAt:ts(5)  },
  { id:15, patientId:14, doctorId:5, date:daysAgo(3),     time:"15:00", status:"completed", notes:"Sports injury – shoulder strain",                createdAt:ts(5)  },
  { id:16, patientId:1,  doctorId:2, date:daysFromNow(1), time:"09:00", status:"scheduled", notes:"Lab results review",                             createdAt:ts(1)  },
  { id:17, patientId:2,  doctorId:6, date:daysFromNow(1), time:"11:00", status:"scheduled", notes:"Oncology consultation",                          createdAt:ts(1)  },
  { id:18, patientId:5,  doctorId:3, date:daysFromNow(2), time:"10:00", status:"scheduled", notes:"Neurology follow-up",                            createdAt:ts(1)  },
  { id:19, patientId:3,  doctorId:1, date:daysFromNow(2), time:"14:30", status:"scheduled", notes:"Chest X-ray review",                             createdAt:ts(1)  },
  { id:20, patientId:6,  doctorId:8, date:daysFromNow(3), time:"09:30", status:"scheduled", notes:"Pulmonary rehab review",                         createdAt:ts(1)  },
  { id:21, patientId:13, doctorId:2, date:daysFromNow(3), time:"11:00", status:"scheduled", notes:"General diabetes management",                    createdAt:ts(1)  },
  { id:22, patientId:15, doctorId:4, date:daysFromNow(4), time:"10:30", status:"scheduled", notes:"Joint pain assessment",                          createdAt:ts(1)  },
];

const MEDICAL_RECORDS: MedicalRecord[] = [
  { id:1,  patientId:1,  doctorId:1, diagnosis:"Essential Hypertension Stage 1",            prescription:"Lisinopril 10mg once daily, Amlodipine 5mg",              treatment:"Low-sodium diet, aerobic exercise 30 min/day",       notes:"BP 145/92. Good compliance. Follow up 4 weeks.",              createdAt:ts(22) },
  { id:2,  patientId:2,  doctorId:7, diagnosis:"Type 2 Diabetes Mellitus with Dyslipidaemia",prescription:"Metformin 850mg BD, Atorvastatin 40mg nightly, Glipizide 5mg",treatment:"Dietary counseling, BGL monitoring twice daily", notes:"HbA1c 7.8%. Target <7.0%.",                                   createdAt:ts(17) },
  { id:3,  patientId:3,  doctorId:8, diagnosis:"Moderate Persistent Asthma",                prescription:"Salbutamol inhaler 2 puffs PRN, Fluticasone 250mcg BD",   treatment:"Breathing exercises, allergen avoidance",            notes:"Peak flow 78%. Last exacerbation 3 months ago.",              createdAt:ts(57) },
  { id:4,  patientId:4,  doctorId:4, diagnosis:"Right Knee Osteoarthritis Grade II",        prescription:"Ibuprofen 400mg TDS with food, Pantoprazole 20mg",         treatment:"Physiotherapy 2x/week, weight reduction advised",    notes:"X-ray: moderate joint space narrowing medially.",             createdAt:ts(45) },
  { id:5,  patientId:5,  doctorId:2, diagnosis:"Seasonal Allergic Rhinitis",                prescription:"Cetirizine 10mg PRN, Fluticasone nasal spray",             treatment:"Nasal irrigation, allergen avoidance plan",          notes:"Worst in spring/autumn. Symptoms controlled.",               createdAt:ts(80) },
  { id:6,  patientId:6,  doctorId:1, diagnosis:"Hypertensive Heart Disease + COPD",         prescription:"Lisinopril 10mg, Aspirin 75mg, Tiotropium inhaler",        treatment:"Pulmonary rehab, smoking cessation",                 notes:"Echo: mild LV hypertrophy. EF 55%. FEV1 62%.",               createdAt:ts(93) },
  { id:7,  patientId:7,  doctorId:3, diagnosis:"Tension-Type Headache",                     prescription:"Paracetamol 500mg QDS PRN, Amitriptyline 10mg at night",   treatment:"Stress management, sleep hygiene, hydration",        notes:"3-4 headaches/week. Neuro exam normal. MRI pending.",         createdAt:ts(3)  },
  { id:8,  patientId:8,  doctorId:4, diagnosis:"Post-op: Right Hip Replacement",            prescription:"Warfarin 5mg (INR target 2-3), Paracetamol 500mg QDS",     treatment:"Daily physio, DVT prevention, weight bearing",       notes:"INR 2.4 – therapeutic. Walking with frame.",                  createdAt:ts(9)  },
  { id:9,  patientId:9,  doctorId:3, diagnosis:"Chronic Migraine with Aura",                prescription:"Sumatriptan 50mg at onset, Topiramate 50mg BD (prevention)",treatment:"Migraine diary, trigger avoidance, regular sleep",   notes:"MRI brain normal. 12 headache days/month.",                  createdAt:ts(27) },
  { id:10, patientId:10, doctorId:7, diagnosis:"Hypothyroidism",                            prescription:"Levothyroxine 75mcg daily (fasting, 30 min before food)",   treatment:"Recheck TSH in 6 weeks.",                           notes:"TSH 6.2 mIU/L. Dose increased from 50mcg.",                  createdAt:ts(15) },
  { id:11, patientId:11, doctorId:6, diagnosis:"Breast Cancer Stage II (Remission)",        prescription:"Tamoxifen 20mg once daily (5-year course, year 3)",         treatment:"Quarterly oncology reviews, annual mammography",     notes:"No evidence of recurrence. CA-125 and CEA normal.",          createdAt:ts(37) },
  { id:12, patientId:13, doctorId:7, diagnosis:"Type 2 Diabetes Mellitus",                  prescription:"Metformin 500mg BD, Gliclazide 40mg with breakfast",        treatment:"Carb counting, exercise 4x/week",                    notes:"HbA1c 8.1%. Diet poorly controlled. Educator referral.",      createdAt:ts(12) },
  { id:13, patientId:15, doctorId:1, diagnosis:"Coronary Artery Disease – Post MI",         prescription:"Aspirin 75mg, Clopidogrel 75mg, Atorvastatin 80mg, Bisoprolol 5mg, Ramipril 5mg", treatment:"Cardiac rehab, Mediterranean diet", notes:"MI 6 months ago. EF 50%. Stress test normal.",               createdAt:ts(36) },
];

const BILLS: Bill[] = [
  { id:1,  patientId:1,  consultationFee:150, labCharges:85,  medicineCharges:45,  amount:280,   paymentStatus:"paid",    paymentDate:"2026-05-15", description:"Cardiology consultation + ECG",               createdAt:ts(22)  },
  { id:2,  patientId:2,  consultationFee:120, labCharges:210, medicineCharges:38.5,amount:368.5, paymentStatus:"paid",    paymentDate:"2026-05-20", description:"Diabetes + HbA1c + lipid panel",              createdAt:ts(17)  },
  { id:3,  patientId:3,  consultationFee:100, labCharges:75,  medicineCharges:22,  amount:197,   paymentStatus:"paid",    paymentDate:"2026-04-10", description:"Asthma follow-up + spirometry",               createdAt:ts(57)  },
  { id:4,  patientId:4,  consultationFee:200, labCharges:150, medicineCharges:52,  amount:402,   paymentStatus:"paid",    paymentDate:"2026-04-22", description:"Orthopedic consultation + X-ray",             createdAt:ts(45)  },
  { id:5,  patientId:5,  consultationFee:100, labCharges:45,  medicineCharges:12,  amount:157,   paymentStatus:"paid",    paymentDate:"2026-03-18", description:"Annual physical + allergy screen",            createdAt:ts(80)  },
  { id:6,  patientId:6,  consultationFee:150, labCharges:320, medicineCharges:75.5,amount:545.5, paymentStatus:"paid",    paymentDate:"2026-03-05", description:"Cardiology + Echo + spirometry",              createdAt:ts(93)  },
  { id:7,  patientId:7,  consultationFee:100, labCharges:0,   medicineCharges:0,   amount:100,   paymentStatus:"pending", paymentDate:null,         description:"Neurology consultation",                      createdAt:ts(1)   },
  { id:8,  patientId:8,  consultationFee:200, labCharges:180, medicineCharges:55,  amount:435,   paymentStatus:"paid",    paymentDate:"2026-05-28", description:"Post-op hip review + INR",                    createdAt:ts(9)   },
  { id:9,  patientId:9,  consultationFee:150, labCharges:220, medicineCharges:30,  amount:400,   paymentStatus:"paid",    paymentDate:"2026-05-10", description:"Neurology + MRI brain",                       createdAt:ts(27)  },
  { id:10, patientId:10, consultationFee:120, labCharges:65,  medicineCharges:18.5,amount:203.5, paymentStatus:"paid",    paymentDate:"2026-05-22", description:"Endocrinology + thyroid tests",               createdAt:ts(15)  },
  { id:11, patientId:11, consultationFee:200, labCharges:150, medicineCharges:22,  amount:372,   paymentStatus:"paid",    paymentDate:"2026-04-30", description:"Oncology review + tumour markers",            createdAt:ts(37)  },
  { id:12, patientId:12, consultationFee:100, labCharges:0,   medicineCharges:0,   amount:100,   paymentStatus:"paid",    paymentDate:"2026-06-04", description:"General consultation",                        createdAt:ts(3)   },
  { id:13, patientId:13, consultationFee:120, labCharges:90,  medicineCharges:28,  amount:238,   paymentStatus:"paid",    paymentDate:"2026-05-25", description:"Diabetes management + HbA1c",                 createdAt:ts(12)  },
  { id:14, patientId:14, consultationFee:100, labCharges:55,  medicineCharges:15,  amount:170,   paymentStatus:"paid",    paymentDate:"2026-06-04", description:"Sports injury + shoulder X-ray",              createdAt:ts(3)   },
  { id:15, patientId:15, consultationFee:200, labCharges:280, medicineCharges:95,  amount:575,   paymentStatus:"paid",    paymentDate:"2026-05-01", description:"Cardiology + stress ECG + echo",              createdAt:ts(36)  },
  { id:16, patientId:1,  consultationFee:100, labCharges:0,   medicineCharges:15.75,amount:115.75,paymentStatus:"pending", paymentDate:null,        description:"Medication refill",                           createdAt:ts(0)   },
  { id:17, patientId:3,  consultationFee:100, labCharges:75,  medicineCharges:18.5,amount:193.5, paymentStatus:"pending", paymentDate:null,         description:"Asthma review + spirometry",                  createdAt:ts(0)   },
  { id:18, patientId:15, consultationFee:150, labCharges:0,   medicineCharges:95,  amount:245,   paymentStatus:"pending", paymentDate:null,         description:"Cardiac medication refill",                   createdAt:ts(1)   },
];

const MEDICINES: Medicine[] = [
  { id:1,  name:"Amoxicillin 500mg",     quantity:250, expiryDate:"2026-09-30", price:12.99, manufacturer:"PharmaCo",       category:"Antibiotic",        createdAt:ts(60) },
  { id:2,  name:"Metformin 850mg",       quantity:6,   expiryDate:"2026-06-30", price:8.50,  manufacturer:"GenMed",         category:"Antidiabetic",      createdAt:ts(60) },
  { id:3,  name:"Lisinopril 10mg",       quantity:180, expiryDate:"2026-12-31", price:15.75, manufacturer:"CardioPharm",    category:"Antihypertensive",  createdAt:ts(60) },
  { id:4,  name:"Atorvastatin 40mg",     quantity:4,   expiryDate:"2025-12-31", price:22.00, manufacturer:"LipidCare",      category:"Statin",            createdAt:ts(60) },
  { id:5,  name:"Salbutamol Inhaler",    quantity:45,  expiryDate:"2026-08-31", price:18.50, manufacturer:"BreathEasy",     category:"Bronchodilator",    createdAt:ts(60) },
  { id:6,  name:"Ibuprofen 400mg",       quantity:500, expiryDate:"2027-01-31", price:6.25,  manufacturer:"PainRelief Inc", category:"NSAID",             createdAt:ts(60) },
  { id:7,  name:"Omeprazole 20mg",       quantity:300, expiryDate:"2026-11-30", price:9.99,  manufacturer:"GastroCare",     category:"PPI",               createdAt:ts(60) },
  { id:8,  name:"Paracetamol 500mg",     quantity:750, expiryDate:"2027-06-30", price:4.50,  manufacturer:"BasicMed",       category:"Analgesic",         createdAt:ts(60) },
  { id:9,  name:"Warfarin 5mg",          quantity:5,   expiryDate:"2026-03-31", price:35.00, manufacturer:"BloodCare",      category:"Anticoagulant",     createdAt:ts(60) },
  { id:10, name:"Levothyroxine 75mcg",   quantity:120, expiryDate:"2026-10-31", price:11.25, manufacturer:"ThyroMed",       category:"Thyroid Hormone",   createdAt:ts(60) },
  { id:11, name:"Amlodipine 5mg",        quantity:200, expiryDate:"2027-02-28", price:13.50, manufacturer:"CardioPharm",    category:"Antihypertensive",  createdAt:ts(60) },
  { id:12, name:"Tamoxifen 20mg",        quantity:60,  expiryDate:"2026-07-31", price:48.00, manufacturer:"OncoMed",        category:"Anticancer",        createdAt:ts(60) },
  { id:13, name:"Sumatriptan 50mg",      quantity:90,  expiryDate:"2026-09-30", price:28.75, manufacturer:"NeuroCare",      category:"Antimigraine",      createdAt:ts(60) },
  { id:14, name:"Fluticasone Inhaler",   quantity:8,   expiryDate:"2026-08-31", price:32.00, manufacturer:"BreathEasy",     category:"Corticosteroid",    createdAt:ts(60) },
  { id:15, name:"Ciprofloxacin 500mg",   quantity:90,  expiryDate:"2026-08-31", price:16.75, manufacturer:"PharmaCo",       category:"Antibiotic",        createdAt:ts(60) },
  { id:16, name:"Aspirin 75mg",          quantity:400, expiryDate:"2027-03-31", price:5.99,  manufacturer:"BasicMed",       category:"Antiplatelet",      createdAt:ts(60) },
  { id:17, name:"Bisoprolol 5mg",        quantity:7,   expiryDate:"2026-05-31", price:19.50, manufacturer:"CardioPharm",    category:"Beta Blocker",      createdAt:ts(60) },
  { id:18, name:"Topiramate 50mg",       quantity:80,  expiryDate:"2027-01-31", price:24.00, manufacturer:"NeuroCare",      category:"Anticonvulsant",    createdAt:ts(60) },
  { id:19, name:"Cetirizine 10mg",       quantity:350, expiryDate:"2027-04-30", price:7.25,  manufacturer:"AllergyMed",     category:"Antihistamine",     createdAt:ts(60) },
  { id:20, name:"Clopidogrel 75mg",      quantity:30,  expiryDate:"2026-09-30", price:31.00, manufacturer:"CardioPharm",    category:"Antiplatelet",      createdAt:ts(60) },
];

const LAB_REPORTS: LabReport[] = [
  { id:1,  patientId:1,  testName:"ECG (12-lead)",              result:"Sinus rhythm. LVH pattern. No acute ST changes.",                                          status:"completed", reportDate:daysAgo(22), createdAt:ts(22) },
  { id:2,  patientId:1,  testName:"Lipid Panel",                result:"Total Chol: 198, LDL: 120, HDL: 52, TG: 130. All within target.",                         status:"completed", reportDate:daysAgo(22), createdAt:ts(22) },
  { id:3,  patientId:2,  testName:"HbA1c",                      result:"7.8% (target <7.0%)",                                                                      status:"completed", reportDate:daysAgo(17), createdAt:ts(17) },
  { id:4,  patientId:2,  testName:"Fasting Glucose",            result:"9.2 mmol/L (high)",                                                                        status:"completed", reportDate:daysAgo(17), createdAt:ts(17) },
  { id:5,  patientId:2,  testName:"Lipid Panel",                result:"Total Chol: 245, LDL: 168, HDL: 42, TG: 175. LDL elevated.",                              status:"completed", reportDate:daysAgo(17), createdAt:ts(17) },
  { id:6,  patientId:3,  testName:"Spirometry",                 result:"FEV1: 72% predicted, FEV1/FVC: 0.74. Mild obstruction.",                                   status:"completed", reportDate:daysAgo(57), createdAt:ts(57) },
  { id:7,  patientId:4,  testName:"X-Ray Right Knee",           result:"Grade II OA. Moderate joint space narrowing medially. No fracture.",                       status:"completed", reportDate:daysAgo(45), createdAt:ts(45) },
  { id:8,  patientId:5,  testName:"Full Blood Count",           result:"WBC: 6.8, RBC: 4.6, Hgb: 13.9, Plt: 260. All normal.",                                    status:"completed", reportDate:daysAgo(80), createdAt:ts(80) },
  { id:9,  patientId:6,  testName:"Echocardiogram",             result:"Mild LV hypertrophy. EF: 55%. No wall motion abnormalities.",                              status:"completed", reportDate:daysAgo(93), createdAt:ts(93) },
  { id:10, patientId:6,  testName:"Spirometry",                 result:"FEV1/FVC: 0.62 (moderate obstructive pattern). FEV1: 58% predicted.",                     status:"completed", reportDate:daysAgo(93), createdAt:ts(93) },
  { id:11, patientId:8,  testName:"PT/INR",                     result:"INR: 2.4 (therapeutic range 2.0-3.0)",                                                     status:"completed", reportDate:daysAgo(9),  createdAt:ts(9)  },
  { id:12, patientId:9,  testName:"MRI Brain",                  result:"No space-occupying lesion. No acute infarct. Mild periventricular changes.",               status:"completed", reportDate:daysAgo(27), createdAt:ts(27) },
  { id:13, patientId:10, testName:"Thyroid Function (TSH/T4)",  result:"TSH: 6.2 mIU/L (high). Free T4: 12.1 pmol/L (low normal). Consistent with hypothyroidism.",status:"completed", reportDate:daysAgo(15), createdAt:ts(15) },
  { id:14, patientId:11, testName:"CA-125 Tumour Marker",       result:"18 U/mL (normal <35 U/mL). No evidence of recurrence.",                                   status:"completed", reportDate:daysAgo(37), createdAt:ts(37) },
  { id:15, patientId:11, testName:"CEA",                        result:"2.1 ng/mL (normal <5 ng/mL).",                                                             status:"completed", reportDate:daysAgo(37), createdAt:ts(37) },
  { id:16, patientId:13, testName:"HbA1c",                      result:"8.1% (poorly controlled)",                                                                 status:"completed", reportDate:daysAgo(12), createdAt:ts(12) },
  { id:17, patientId:15, testName:"Stress ECG",                 result:"No ischaemic changes at target HR. Functional capacity good.",                             status:"completed", reportDate:daysAgo(36), createdAt:ts(36) },
  { id:18, patientId:15, testName:"Echocardiogram",             result:"EF: 50%. Mild inferior wall hypokinesia. No significant valvular disease.",                status:"completed", reportDate:daysAgo(36), createdAt:ts(36) },
  { id:19, patientId:1,  testName:"Renal Function Panel",       result:null,                                                                                        status:"pending",   reportDate:daysFromNow(0), createdAt:ts(0)  },
  { id:20, patientId:7,  testName:"MRI Brain",                  result:null,                                                                                        status:"pending",   reportDate:daysFromNow(0), createdAt:ts(0)  },
  { id:21, patientId:3,  testName:"IgE Allergy Panel",          result:null,                                                                                        status:"pending",   reportDate:daysFromNow(1), createdAt:ts(0)  },
  { id:22, patientId:14, testName:"X-Ray Right Shoulder",       result:null,                                                                                        status:"pending",   reportDate:daysFromNow(0), createdAt:ts(0)  },
];

// ─── Exported stores ─────────────────────────────────────────
export const patients      = new Store<Patient>("patients", PATIENTS);
export const doctors       = new Store<Doctor>("doctors", DOCTORS);
export const appointments  = new Store<Appointment>("appointments", APPOINTMENTS);
export const medicalRecords= new Store<MedicalRecord>("medical-records", MEDICAL_RECORDS);
export const bills         = new Store<Bill>("bills", BILLS);
export const medicines     = new Store<Medicine>("medicines", MEDICINES);
export const labReports    = new Store<LabReport>("lab-reports", LAB_REPORTS);
