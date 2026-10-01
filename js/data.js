/* ============================================================
   Datos de ejemplo (semilla) — Academia de Artes Marciales "Dojo Central"
   Esta es la información inicial/demo. Una vez que la app corre,
   el estado real vive en localStorage (ver js/store.js) y estos
   arreglos se mutan in-place a partir de ahí.
   ============================================================ */

const PROGRAMS = [
  { id: "karate", name: "Karate", color: "#2a78d6" },
  { id: "taekwondo", name: "Taekwondo", color: "#eb6834" },
  { id: "bjj", name: "Brazilian Jiu-Jitsu", color: "#1baf7a" },
  { id: "boxeo", name: "Boxeo", color: "#eda100" },
  { id: "muaythai", name: "Muay Thai", color: "#e34948" },
  { id: "judo", name: "Judo Infantil", color: "#4a3aa7" },
];

/* Escala de graduación propia de cada disciplina (colores/niveles reales, no categóricos) */
const BELT_SCALES = {
  karate: [
    { name: "Blanco", hex: "#f5f5f2", stroke: "#c3c2b7", textOn: "#0b0b0b", examClasses: 16 },
    { name: "Amarillo", hex: "#f2c200", stroke: null, textOn: "#0b0b0b", examClasses: 20 },
    { name: "Naranja", hex: "#eb6834", stroke: null, textOn: "#ffffff", examClasses: 24 },
    { name: "Verde", hex: "#1baf7a", stroke: null, textOn: "#ffffff", examClasses: 28 },
    { name: "Azul", hex: "#2a78d6", stroke: null, textOn: "#ffffff", examClasses: 32 },
    { name: "Marrón", hex: "#7a4a2b", stroke: null, textOn: "#ffffff", examClasses: 40 },
    { name: "Negro", hex: "#1a1a19", stroke: null, textOn: "#ffffff", examClasses: null },
  ],
  taekwondo: [
    { name: "Blanco", hex: "#f5f5f2", stroke: "#c3c2b7", textOn: "#0b0b0b", examClasses: 16 },
    { name: "Amarillo", hex: "#f2c200", stroke: null, textOn: "#0b0b0b", examClasses: 20 },
    { name: "Verde", hex: "#1baf7a", stroke: null, textOn: "#ffffff", examClasses: 24 },
    { name: "Azul", hex: "#2a78d6", stroke: null, textOn: "#ffffff", examClasses: 28 },
    { name: "Rojo", hex: "#c23030", stroke: null, textOn: "#ffffff", examClasses: 32 },
    { name: "Negro", hex: "#1a1a19", stroke: null, textOn: "#ffffff", examClasses: null },
  ],
  bjj: [
    { name: "Blanca", hex: "#f5f5f2", stroke: "#c3c2b7", textOn: "#0b0b0b", examClasses: 60 },
    { name: "Azul", hex: "#1f5fbf", stroke: null, textOn: "#ffffff", examClasses: 80 },
    { name: "Púrpura", hex: "#6b3fa0", stroke: null, textOn: "#ffffff", examClasses: 100 },
    { name: "Marrón", hex: "#7a4a2b", stroke: null, textOn: "#ffffff", examClasses: 120 },
    { name: "Negra", hex: "#1a1a19", stroke: null, textOn: "#ffffff", examClasses: null },
  ],
  judo: [
    { name: "Blanco", hex: "#f5f5f2", stroke: "#c3c2b7", textOn: "#0b0b0b", examClasses: 16 },
    { name: "Amarillo", hex: "#f2c200", stroke: null, textOn: "#0b0b0b", examClasses: 20 },
    { name: "Naranja", hex: "#eb6834", stroke: null, textOn: "#ffffff", examClasses: 24 },
    { name: "Verde", hex: "#1baf7a", stroke: null, textOn: "#ffffff", examClasses: 28 },
    { name: "Azul", hex: "#2a78d6", stroke: null, textOn: "#ffffff", examClasses: 32 },
    { name: "Marrón", hex: "#7a4a2b", stroke: null, textOn: "#ffffff", examClasses: 40 },
    { name: "Negro", hex: "#1a1a19", stroke: null, textOn: "#ffffff", examClasses: null },
  ],
  boxeo: [
    { name: "Principiante", hex: "#c3c2b7", stroke: null, textOn: "#0b0b0b", examClasses: 20 },
    { name: "Intermedio", hex: "#2a78d6", stroke: null, textOn: "#ffffff", examClasses: 30 },
    { name: "Avanzado", hex: "#eb6834", stroke: null, textOn: "#ffffff", examClasses: 40 },
    { name: "Competidor", hex: "#1a1a19", stroke: null, textOn: "#ffffff", examClasses: null },
  ],
  muaythai: [
    { name: "Principiante", hex: "#c3c2b7", stroke: null, textOn: "#0b0b0b", examClasses: 20 },
    { name: "Intermedio", hex: "#2a78d6", stroke: null, textOn: "#ffffff", examClasses: 30 },
    { name: "Avanzado", hex: "#eb6834", stroke: null, textOn: "#ffffff", examClasses: 40 },
    { name: "Competidor", hex: "#1a1a19", stroke: null, textOn: "#ffffff", examClasses: null },
  ],
};
function beltScaleFor(programId) { return BELT_SCALES[programId] || BELT_SCALES.karate; }
function currentRank(student) {
  const scale = beltScaleFor(student.program);
  const idx = Math.min(student.beltIndex || 0, scale.length - 1);
  return { ...scale[idx], index: idx, scaleLength: scale.length };
}

const INSTRUCTORS = [
  { id: "i1", name: "Carlos Medina", title: "Sensei", program: "karate", rank: "Cinturón Negro 4º Dan", years: 18, students: 34, phone: "+51 987 101 101", email: "carlos.medina@dojocentral.com", initials: "CM", hourlyRate: 35 },
  { id: "i2", name: "Luis Herrera", title: "Profesor", program: "taekwondo", rank: "Cinturón Negro 3er Dan", years: 12, students: 27, phone: "+51 987 101 102", email: "luis.herrera@dojocentral.com", initials: "LH", hourlyRate: 30 },
  { id: "i3", name: "Ana Gómez", title: "Profesora", program: "bjj", rank: "Cinturón Negro BJJ", years: 9, students: 31, phone: "+51 987 101 103", email: "ana.gomez@dojocentral.com", initials: "AG", hourlyRate: 32 },
  { id: "i4", name: "Diego Ramírez", title: "Coach", program: "boxeo", rank: "Entrenador Certificado", years: 7, students: 22, phone: "+51 987 101 104", email: "diego.ramirez@dojocentral.com", initials: "DR", hourlyRate: 28 },
  { id: "i5", name: "Valeria Soto", title: "Coach", program: "muaythai", rank: "Instructora Certificada", years: 6, students: 18, phone: "+51 987 101 105", email: "valeria.soto@dojocentral.com", initials: "VS", hourlyRate: 28 },
  { id: "i6", name: "Marta Vidal", title: "Sensei", program: "judo", rank: "Cinturón Marrón", years: 5, students: 16, phone: "+51 987 101 106", email: "marta.vidal@dojocentral.com", initials: "MV", hourlyRate: 26 },
];

const CLASSES = [
  { id: "c1", program: "karate", instructor: "i1", day: "Lun", time: "18:00–19:00", room: "Tatami 1", capacity: 24, enrolled: 21, category: "Adultos" },
  { id: "c2", program: "karate", instructor: "i1", day: "Mié", time: "18:00–19:00", room: "Tatami 1", capacity: 24, enrolled: 19, category: "Adultos" },
  { id: "c3", program: "karate", instructor: "i1", day: "Vie", time: "18:00–19:00", room: "Tatami 1", capacity: 24, enrolled: 23, category: "Adultos" },
  { id: "c4", program: "taekwondo", instructor: "i2", day: "Lun", time: "19:00–20:00", room: "Tatami 2", capacity: 20, enrolled: 18, category: "Adultos" },
  { id: "c5", program: "taekwondo", instructor: "i2", day: "Jue", time: "19:00–20:00", room: "Tatami 2", capacity: 20, enrolled: 16, category: "Adultos" },
  { id: "c6", program: "bjj", instructor: "i3", day: "Mar", time: "19:00–20:30", room: "Tatami 1", capacity: 22, enrolled: 22, category: "Avanzados" },
  { id: "c7", program: "bjj", instructor: "i3", day: "Jue", time: "19:00–20:30", room: "Tatami 1", capacity: 22, enrolled: 20, category: "Avanzados" },
  { id: "c8", program: "bjj", instructor: "i3", day: "Sáb", time: "10:00–11:30", room: "Tatami 1", capacity: 22, enrolled: 14, category: "Avanzados" },
  { id: "c9", program: "boxeo", instructor: "i4", day: "Lun", time: "20:00–21:00", room: "Sala Ring", capacity: 16, enrolled: 15, category: "Adultos" },
  { id: "c10", program: "boxeo", instructor: "i4", day: "Mié", time: "20:00–21:00", room: "Sala Ring", capacity: 16, enrolled: 12, category: "Adultos" },
  { id: "c11", program: "boxeo", instructor: "i4", day: "Vie", time: "20:00–21:00", room: "Sala Ring", capacity: 16, enrolled: 13, category: "Adultos" },
  { id: "c12", program: "muaythai", instructor: "i5", day: "Mar", time: "20:00–21:00", room: "Sala Ring", capacity: 16, enrolled: 11, category: "Adultos" },
  { id: "c13", program: "muaythai", instructor: "i5", day: "Jue", time: "20:00–21:00", room: "Sala Ring", capacity: 16, enrolled: 9, category: "Adultos" },
  { id: "c14", program: "judo", instructor: "i6", day: "Mar", time: "17:00–18:00", room: "Tatami 2", capacity: 18, enrolled: 16, category: "Niños" },
  { id: "c15", program: "judo", instructor: "i6", day: "Sáb", time: "09:00–10:00", room: "Tatami 2", capacity: 18, enrolled: 12, category: "Niños" },
  { id: "c16", program: "karate", instructor: "i1", day: "Sáb", time: "11:00–12:00", room: "Tatami 1", capacity: 24, enrolled: 10, category: "Niños" },
];

const FIRST_NAMES = ["Mateo","Sofía","Santiago","Valentina","Diego","Camila","Gabriel","Isabella","Samuel","Renata","Lucas","Emilia","Benjamín","Martina","Tomás","Antonella","Joaquín","Victoria","Nicolás","Paula","Sebastián","Luciana","Adrián","Daniela","Iker","Julieta","Emiliano","Regina","Dante","Fernanda"];
const LAST_NAMES = ["Rodríguez","González","López","Martínez","Pérez","Sánchez","Ramírez","Torres","Flores","Rivera","Gómez","Díaz","Cruz","Morales","Reyes","Ortiz","Castro","Vargas","Romero","Alvarado"];
const INACTIVE_REASONS = ["Mudanza", "Precio", "Lesión", "Falta de tiempo", "Cambio de academia", "Otro"];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rnd = seededRandom(42);
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function randInt(min, max) { return Math.floor(rnd() * (max - min + 1)) + min; }

/* Catálogo de planes: por tiempo (vencen) o por paquete (consumen créditos de clase) */
const PLANS_CATALOG = [
  { name: "Mensual", type: "tiempo", price: 150, days: 30, color: "#2a78d6", description: "Acceso ilimitado a todas las disciplinas, mes a mes.", active: true },
  { name: "Trimestral", type: "tiempo", price: 400, days: 90, color: "#1baf7a", description: "Ahorra pagando 3 meses por adelantado.", active: true },
  { name: "Anual", type: "tiempo", price: 1400, days: 365, color: "#4a3aa7", description: "El plan más conveniente para alumnos comprometidos.", active: true },
  { name: "Paquete 10 clases", type: "paquete", price: 180, credits: 10, color: "#eb6834", description: "Ideal para horarios irregulares: paga solo por lo que entrenas.", active: true },
];
function planByName(name) { return PLANS_CATALOG.find((p) => p.name === name) || PLANS_CATALOG[0]; }
const PLAN_NAMES = PLANS_CATALOG.map((p) => p.name);

const STUDENTS = [];
for (let i = 0; i < 30; i++) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = pick(LAST_NAMES);
  const program = pick(PROGRAMS).id;
  const scale = beltScaleFor(program);
  const beltIndex = Math.min(scale.length - 1, Math.floor(rnd() * rnd() * scale.length * 1.4));
  const payStatus = rnd() < 0.72 ? "al_dia" : (rnd() < 0.6 ? "pendiente" : "vencido");
  const isInactive = rnd() < 0.08;
  const isFrozen = !isInactive && rnd() < 0.06;
  const plan = pick(PLAN_NAMES.filter((n) => planByName(n).type === "tiempo"));
  const attendance = randInt(58, 99);
  const joinYear = 2023 + (rnd() < 0.5 ? 0 : 1);
  const joinMonth = randInt(1, 12);
  const nextPayDay = randInt(1, 28);
  const lastVisitDaysAgo = rnd() < 0.15 ? randInt(8, 21) : randInt(0, 6);
  const d = new Date(); d.setDate(d.getDate() - lastVisitDaysAgo);

  STUDENTS.push({
    id: "s" + (i + 1),
    name: `${first} ${last}`,
    initials: (first[0] + last[0]).toUpperCase(),
    dni: String(randInt(10000000, 79999999)),
    photo: null,
    program,
    beltIndex,
    classesSincePromotion: randInt(0, (scale[beltIndex].examClasses || 30) - 1),
    examHistory: [],
    status: isInactive ? "Inactivo" : (isFrozen ? "Congelado" : "Activo"),
    inactiveReason: isInactive ? pick(INACTIVE_REASONS) : null,
    inactiveDate: isInactive ? "2026-09-" + String(randInt(1, 28)).padStart(2, "0") : null,
    freezeReason: isFrozen ? "Vacaciones" : null,
    freezeUntil: isFrozen ? "2026-10-15" : null,
    paymentStatus: payStatus,
    plan,
    classCredits: 0,
    attendance,
    joined: `${String(joinMonth).padStart(2, "0")}/${joinYear}`,
    nextPayment: `2026-11-${String(nextPayDay).padStart(2, "0")}`,
    lastVisit: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"),
    phone: `+51 9${randInt(10, 89)} ${randInt(100, 999)} ${randInt(100, 999)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
    medicalNotes: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    guardianId: null,
  });
}

/* Apoderados (padres/tutores) vinculados a alumnos menores — en este dojo,
   los inscritos en Judo Infantil. Dos de ellos comparten apoderado
   (hermanos) para mostrar el caso de un apoderado con varios hijos. */
const GUARDIANS = [
  { id: "g1", name: "Rosa Fernández", dni: "41234567", phone: "+51 965 111 222", email: "rosa.fernandez@mail.com" },
  { id: "g2", name: "Jorge Salazar", dni: "42345678", phone: "+51 965 222 333", email: "jorge.salazar@mail.com" },
  { id: "g3", name: "Patricia Núñez", dni: "43456789", phone: "+51 965 333 444", email: "patricia.nunez@mail.com" },
];
(function linkGuardiansToKids() {
  // Preferimos alumnos de Judo Infantil (son niños); si hubiera menos de 4
  // por el azar de la semilla, completamos con los siguientes alumnos para
  // que la demo siempre muestre el caso de un apoderado con varios hijos.
  const judoKids = STUDENTS.filter((s) => s.program === "judo");
  const others = STUDENTS.filter((s) => s.program !== "judo");
  const kids = judoKids.concat(others).slice(0, 4);
  const links = ["g1", "g1", "g2", "g3"]; // los dos primeros son hermanos
  kids.forEach((s, i) => { s.guardianId = links[i]; });
})();

/* Plantel de cada clase: alumnos reales de esa disciplina, usados en el check-in de asistencia */
CLASSES.forEach((c) => {
  const pool = STUDENTS.filter((s) => s.program === c.program).map((s) => s.id);
  const n = Math.min(c.enrolled, pool.length);
  c.roster = pool.slice(0, n);
  c.enrolled = c.roster.length;
});

const PAYMENTS = [];
let payId = 1;
STUDENTS.forEach((s) => {
  const amount = planByName(s.plan).price;
  const paidDate = `2026-09-${String(randInt(1, 28)).padStart(2, "0")}`;
  PAYMENTS.push({
    id: "p" + payId++,
    studentId: s.id,
    student: s.name,
    program: s.program,
    amount,
    plan: s.plan,
    date: s.paymentStatus === "al_dia" ? paidDate : s.nextPayment,
    method: pick(["Tarjeta (POS)", "Efectivo", "Transferencia", "Yape/Plin"]),
    operationRef: "",
    status: s.paymentStatus,
    receiptType: null,
    receiptNumber: null,
  });
});

const REVENUE_MONTHLY = [
  { label: "Feb", value: 30800 },
  { label: "Mar", value: 32600 },
  { label: "Abr", value: 34500 },
  { label: "May", value: 33800 },
  { label: "Jun", value: 37200 },
  { label: "Jul", value: 36100 },
  { label: "Ago", value: 39800 },
  { label: "Sep", value: 41600 },
];

const ENROLLMENTS_MONTHLY = [
  { label: "Abr", value: 6 },
  { label: "May", value: 9 },
  { label: "Jun", value: 5 },
  { label: "Jul", value: 11 },
  { label: "Ago", value: 8 },
  { label: "Sep", value: 13 },
];

const ATTENDANCE_WEEKLY = [
  { label: "Lun", value: 54 },
  { label: "Mar", value: 49 },
  { label: "Mié", value: 31 },
  { label: "Jue", value: 45 },
  { label: "Vie", value: 36 },
  { label: "Sáb", value: 26 },
];

const ACADEMY = {
  name: "Dojo Central",
  address: "Av. Siempre Viva 742, Lima",
  phone: "+51 987 000 100",
  timezone: "America/Lima",
  ruc: "20600123456",
  monthlyRevenueGoal: 45000,
};

/* Check-ins de asistencia: { "YYYY-MM-DD": { classId: [studentId, ...] } } */
const CHECKINS = {};

/* Turnos de caja: apertura/cierre, arqueo. Semilla: un turno semanal
   cerrado por todo septiembre, para que Caja no se vea vacía la primera
   vez. El tercero se cierra con una pequeña diferencia a propósito, para
   mostrar cómo luce un arqueo que no cuadra. */
const CASH_SHIFTS = [];
(function seedCashShifts() {
  const windows = [
    { from: "2026-09-01", to: "2026-09-07", openedBy: "Lucía Paredes" },
    { from: "2026-09-08", to: "2026-09-14", openedBy: "Mateo Rojas" },
    { from: "2026-09-15", to: "2026-09-21", openedBy: "Lucía Paredes" },
    { from: "2026-09-22", to: "2026-09-28", openedBy: "Mateo Rojas" },
  ];
  windows.forEach((w, i) => {
    const openingAmount = 100;
    const cashTotal = PAYMENTS.filter((p) => p.status === "al_dia" && p.method === "Efectivo" && p.date >= w.from && p.date <= w.to)
      .reduce((s, p) => s + p.amount, 0);
    const expected = openingAmount + cashTotal;
    const discrepancy = i === 2 ? -15 : 0;
    CASH_SHIFTS.push({
      id: "turno" + (i + 1),
      openedAt: w.from + "T09:00:00.000Z",
      openedBy: w.openedBy,
      openingAmount,
      status: "closed",
      closedAt: w.to + "T20:30:00.000Z",
      closingAmount: expected + discrepancy,
      notes: discrepancy !== 0 ? "Faltante pendiente de revisar con el equipo" : "",
    });
  });
})();

/* ============================================================
   Gastos — sueldos, gastos fijos y variables
   ============================================================ */
const EXPENSE_CATEGORIES = [
  { id: "sueldos", name: "Sueldos", type: "fijo" },
  { id: "alquiler", name: "Alquiler", type: "fijo" },
  { id: "servicios", name: "Servicios (luz/agua/internet)", type: "fijo" },
  { id: "mantenimiento", name: "Mantenimiento", type: "variable" },
  { id: "marketing", name: "Marketing", type: "variable" },
  { id: "equipamiento", name: "Equipamiento", type: "variable" },
  { id: "otros", name: "Otros", type: "variable" },
];
function expenseCategoryInfo(id) {
  return EXPENSE_CATEGORIES.find((c) => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

const EXPENSES = [];
let expId = 1;
(function seedExpenses() {
  INSTRUCTORS.forEach((i) => {
    const hours = CLASSES.filter((c) => c.instructor === i.id).reduce((s, c) => s + classDurationHours(c.time), 0);
    const monthlyPay = Math.round(hours * (i.hourlyRate || 0) * 4);
    if (monthlyPay > 0) {
      EXPENSES.push({
        id: "e" + expId++, category: "sueldos", instructorId: i.id,
        description: `Sueldo de ${i.name} (${hours}h/sem × ${fmtMoney(i.hourlyRate)})`,
        amount: monthlyPay, type: "fijo", recurring: true, date: "2026-09-28",
      });
    }
  });
  [
    { category: "alquiler", description: "Alquiler del local", amount: 4500, date: "2026-09-01" },
    { category: "servicios", description: "Luz, agua e internet", amount: 680, date: "2026-09-05" },
    { category: "mantenimiento", description: "Mantenimiento de tatamis y sala de pesas", amount: 320, date: "2026-09-12" },
    { category: "marketing", description: "Publicidad en redes sociales", amount: 450, date: "2026-09-10" },
    { category: "equipamiento", description: "Reposición de guantes y protectores", amount: 590, date: "2026-09-18" },
    { category: "otros", description: "Útiles de limpieza y recepción", amount: 150, date: "2026-09-20" },
  ].forEach((e) => {
    EXPENSES.push({
      id: "e" + expId++, category: e.category, instructorId: null,
      description: e.description, amount: e.amount,
      type: expenseCategoryInfo(e.category).type, recurring: e.category === "alquiler" || e.category === "servicios",
      date: e.date,
    });
  });
})();

/* Notificaciones (simuladas) ya marcadas como "enviadas", para no repetirlas en la cola */
const DISMISSED_NOTIFICATIONS = {};

let receiptSeq = 1000;

/* Bitácora de actividad real, alimentada por las acciones del usuario */
const ACTIVITY_LOG = [
  { ico: "user", color: "var(--series-1)", text: `Nuevo alumno inscrito: <strong>${STUDENTS[STUDENTS.length - 1].name}</strong>`, when: "2026-09-29" },
  { ico: "money", color: "var(--status-good)", text: `Pago recibido de <strong>${PAYMENTS[0].student}</strong> (${fmtMoney(PAYMENTS[0].amount)})`, when: "2026-09-28" },
  { ico: "belt", color: "var(--series-7)", text: `Promoción de grado: <strong>${STUDENTS[3].name}</strong> → ${currentRank(STUDENTS[3]).name}`, when: "2026-09-27" },
];

function programName(id) {
  return (PROGRAMS.find((p) => p.id === id) || {}).name || id;
}
function programColor(id) {
  return (PROGRAMS.find((p) => p.id === id) || {}).color || "#898781";
}
function instructorById(id) {
  return INSTRUCTORS.find((i) => i.id === id);
}
function studentById(id) {
  return STUDENTS.find((s) => s.id === id);
}
function studentByDni(dni) {
  return STUDENTS.find((s) => s.dni === dni);
}
function classById(id) {
  return CLASSES.find((c) => c.id === id);
}
function guardianById(id) {
  return GUARDIANS.find((g) => g.id === id);
}
function fmtMoney(n) {
  return "S/ " + Number(n || 0).toLocaleString("es-PE", { maximumFractionDigits: 0 });
}
function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function daysBetween(isoA, isoB) {
  return Math.round((new Date(isoB) - new Date(isoA)) / 86400000);
}
function classDurationHours(timeStr) {
  const [a, b] = timeStr.split("–");
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  return Math.max(0, (toMin(b) - toMin(a)) / 60);
}
/* Semáforo de ingreso: verde = al día, amarillo = vence pronto, rojo = vencido/moroso */
function paymentSemaphore(student) {
  if (student.paymentStatus === "vencido") return "rojo";
  if (student.paymentStatus === "pendiente") {
    const d = daysBetween(todayISO(), student.nextPayment);
    if (d <= 5) return "amarillo";
    return "verde";
  }
  const d = daysBetween(todayISO(), student.nextPayment);
  if (d <= 5) return "amarillo";
  return "verde";
}
function effectiveStatus(student) {
  if (student.status === "Activo" && student.paymentStatus === "vencido") return "Morosidad";
  return student.status;
}
