/* ============================================================
   Store — persistencia en localStorage + mutaciones de datos.
   Todas las altas/ediciones/bajas de la app pasan por aquí.
   ============================================================ */

const STORAGE_KEY = "dojoCentralState.v2";

/* Copias de la semilla (data.js) para Apoderados, Caja y Gastos, tomadas
   ANTES de que applyState() pueda reemplazarlas por lo persistido. Estas
   tres secciones son nuevas: una sesión guardada ANTES de que existieran
   quedó con esas listas vacías, y un simple reemplazo nunca las llenaría
   de nuevo. backfillNewDemoContent() las restaura solo si siguen vacías
   (si el usuario ya creó/editó algo ahí, eso tiene prioridad y no se toca). */
const SEED_GUARDIANS = JSON.parse(JSON.stringify(GUARDIANS));
const SEED_CASH_SHIFTS = JSON.parse(JSON.stringify(CASH_SHIFTS));
const SEED_EXPENSES = JSON.parse(JSON.stringify(EXPENSES));

function addDaysISO(days, fromISO) {
  const d = fromISO ? new Date(fromISO) : new Date();
  d.setDate(d.getDate() + days);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function genId(prefix, arr) {
  let max = 0;
  arr.forEach((x) => {
    const m = /(\d+)$/.exec(x.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return prefix + (max + 1);
}

function initialsOf(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

/* ---------- Snapshot / persistencia ---------- */
function serializeState() {
  return {
    students: STUDENTS,
    payments: PAYMENTS,
    classes: CLASSES,
    instructors: INSTRUCTORS,
    guardians: GUARDIANS,
    plansCatalog: PLANS_CATALOG,
    beltScales: BELT_SCALES,
    expenses: EXPENSES,
    academy: ACADEMY,
    checkins: CHECKINS,
    activity: ACTIVITY_LOG,
    cashShifts: CASH_SHIFTS,
    dismissedNotifications: DISMISSED_NOTIFICATIONS,
    receiptSeq,
    revenueMonthly: REVENUE_MONTHLY,
    enrollmentsMonthly: ENROLLMENTS_MONTHLY,
  };
}

/* Si `source` es undefined o le faltan claves (el campo, o una sub-clave,
   no existía todavía cuando se guardó un snapshot más viejo), lo que falte
   se conserva tal como está en memoria (la semilla por defecto) en vez de
   borrarse: así una versión nueva de la app nunca destruye datos por
   agregar un campo. Para los objetos esto es un *merge*, no un reemplazo:
   las claves que ya existían en `target` y no vienen en `source` quedan
   intactas (p. ej. una disciplina sin escala guardada, o un ajuste nuevo
   en ACADEMY que un snapshot viejo no tiene). */
function replaceArrayContents(target, source) {
  if (source === undefined) return;
  target.length = 0;
  (source || []).forEach((x) => target.push(x));
}
function replaceObjectContents(target, source) {
  if (!source) return;
  Object.assign(target, source);
}

function applyState(saved) {
  replaceArrayContents(STUDENTS, saved.students);
  replaceArrayContents(PAYMENTS, saved.payments);
  replaceArrayContents(CLASSES, saved.classes);
  replaceArrayContents(INSTRUCTORS, saved.instructors);
  replaceArrayContents(GUARDIANS, saved.guardians);
  replaceArrayContents(PLANS_CATALOG, saved.plansCatalog);
  replaceArrayContents(EXPENSES, saved.expenses);
  replaceArrayContents(ACTIVITY_LOG, saved.activity);
  replaceArrayContents(CASH_SHIFTS, saved.cashShifts);
  replaceArrayContents(REVENUE_MONTHLY, saved.revenueMonthly);
  replaceArrayContents(ENROLLMENTS_MONTHLY, saved.enrollmentsMonthly);
  replaceObjectContents(ACADEMY, saved.academy);
  replaceObjectContents(CHECKINS, saved.checkins);
  replaceObjectContents(BELT_SCALES, saved.beltScales);
  replaceObjectContents(DISMISSED_NOTIFICATIONS, saved.dismissedNotifications);
  receiptSeq = saved.receiptSeq || 1000;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState()));
  } catch (e) {
    console.error("No se pudo guardar en localStorage", e);
  }
}

function initStore() {
  let saved = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (e) {
    saved = null;
  }
  if (saved) {
    applyState(saved);
    if (backfillNewDemoContent()) persist();
  } else {
    persist(); // primera vez: guarda la semilla tal cual
  }
}

/* Rellena Apoderados / Caja / Gastos en sesiones que ya habían quedado
   guardadas (vacías) antes de que estas secciones existieran. Vincula los
   apoderados de respaldo a los primeros alumnos sin apoderado, igual que
   hace la semilla en data.js, para que el ejemplo se vea completo. */
function backfillNewDemoContent() {
  let changed = false;
  if (!GUARDIANS.length && SEED_GUARDIANS.length) {
    replaceArrayContents(GUARDIANS, SEED_GUARDIANS);
    const judoKids = STUDENTS.filter((s) => s.program === "judo" && !s.guardianId);
    const others = STUDENTS.filter((s) => s.program !== "judo" && !s.guardianId);
    const links = ["g1", "g1", "g2", "g3"];
    judoKids.concat(others).slice(0, links.length).forEach((s, i) => { s.guardianId = links[i]; });
    changed = true;
  }
  if (!CASH_SHIFTS.length && SEED_CASH_SHIFTS.length) {
    replaceArrayContents(CASH_SHIFTS, SEED_CASH_SHIFTS);
    changed = true;
  }
  if (!EXPENSES.length && SEED_EXPENSES.length) {
    replaceArrayContents(EXPENSES, SEED_EXPENSES);
    changed = true;
  }
  return changed;
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* ---------- Actividad ---------- */
function logActivity(ico, color, text, when) {
  ACTIVITY_LOG.unshift({ ico, color, text, when: when || todayISO() });
  if (ACTIVITY_LOG.length > 40) ACTIVITY_LOG.length = 40;
}

/* ---------- Alumnos ---------- */
function createStudent(data) {
  const student = {
    id: genId("s", STUDENTS),
    name: data.name.trim(),
    initials: initialsOf(data.name),
    dni: data.dni || "",
    photo: data.photo || null,
    program: data.program,
    beltIndex: 0,
    classesSincePromotion: 0,
    examHistory: [],
    status: "Activo",
    inactiveReason: null, inactiveDate: null,
    freezeReason: null, freezeUntil: null,
    paymentStatus: "pendiente",
    plan: data.plan,
    classCredits: 0,
    attendance: 0,
    joined: (() => { const d = new Date(); return String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear(); })(),
    nextPayment: todayISO(),
    lastVisit: null,
    phone: data.phone || "",
    email: data.email.trim(),
    medicalNotes: data.medicalNotes || "",
    emergencyContactName: data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyContactPhone || "",
    guardianId: data.guardianId || null,
  };
  STUDENTS.push(student);
  logActivity("user", "var(--series-1)", `Nuevo alumno inscrito: <strong>${student.name}</strong>`);
  persist();
  return student;
}
function updateStudent(id, data) {
  const s = studentById(id);
  if (!s) return;
  Object.assign(s, data, { initials: initialsOf(data.name || s.name) });
  persist();
}
function deleteStudent(id) {
  const idx = STUDENTS.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const [removed] = STUDENTS.splice(idx, 1);
  CLASSES.forEach((c) => {
    const ri = c.roster.indexOf(id);
    if (ri > -1) { c.roster.splice(ri, 1); c.enrolled = c.roster.length; }
  });
  Object.values(CHECKINS).forEach((byClass) => {
    Object.keys(byClass).forEach((classId) => {
      byClass[classId] = byClass[classId].filter((sid) => sid !== id);
    });
  });
  logActivity("user", "var(--status-critical)", `Alumno eliminado: <strong>${removed.name}</strong>`);
  persist();
}
function freezeStudent(id, { reason, until }) {
  const s = studentById(id);
  if (!s) return;
  s.status = "Congelado";
  s.freezeReason = reason;
  s.freezeUntil = until;
  logActivity("freeze", "var(--series-4)", `Membresía congelada: <strong>${s.name}</strong> hasta ${until}`);
  persist();
}
function deactivateStudent(id, { reason }) {
  const s = studentById(id);
  if (!s) return;
  s.status = "Inactivo";
  s.inactiveReason = reason;
  s.inactiveDate = todayISO();
  logActivity("user", "var(--status-critical)", `Alumno dado de baja: <strong>${s.name}</strong> (${reason})`);
  persist();
}
function reactivateStudent(id) {
  const s = studentById(id);
  if (!s) return;
  s.status = "Activo";
  s.freezeReason = null; s.freezeUntil = null;
  s.inactiveReason = null; s.inactiveDate = null;
  logActivity("user", "var(--status-good)", `Alumno reactivado: <strong>${s.name}</strong>`);
  persist();
}
function examEligible(student) {
  const rank = currentRank(student);
  return rank.examClasses != null && student.classesSincePromotion >= rank.examClasses;
}
function promoteBelt(id, { evaluator, date } = {}) {
  const s = studentById(id);
  if (!s) return { ok: false };
  const scale = beltScaleFor(s.program);
  if (s.beltIndex >= scale.length - 1) return { ok: false, reason: "max" };
  const fromIndex = s.beltIndex;
  s.beltIndex += 1;
  s.classesSincePromotion = 0;
  s.examHistory.push({ date: date || todayISO(), evaluator: evaluator || "—", fromIndex, toIndex: s.beltIndex });
  const rank = currentRank(s);
  logActivity("belt", "var(--series-7)", `Promoción de grado: <strong>${s.name}</strong> → ${rank.name}`);
  persist();
  return { ok: true, rank };
}

/* ---------- Apoderados ---------- */
function createGuardian(data) {
  const g = { id: genId("g", GUARDIANS), name: data.name.trim(), dni: data.dni || "", phone: data.phone || "", email: data.email || "" };
  GUARDIANS.push(g);
  persist();
  return g;
}
function updateGuardian(id, data) {
  const g = guardianById(id);
  if (!g) return;
  Object.assign(g, data);
  persist();
}
function deleteGuardian(id) {
  STUDENTS.forEach((s) => { if (s.guardianId === id) s.guardianId = null; });
  const idx = GUARDIANS.findIndex((g) => g.id === id);
  if (idx > -1) GUARDIANS.splice(idx, 1);
  persist();
}

/* ---------- Pagos ---------- */
function applyPaymentEffects(student, payment) {
  if (!student || payment.status !== "al_dia") return;
  const plan = planByName(payment.plan);
  student.plan = payment.plan;
  student.paymentStatus = "al_dia";
  if (plan.type === "paquete") {
    student.classCredits = (student.classCredits || 0) + plan.credits;
  } else {
    student.nextPayment = addDaysISO(plan.days || 30);
  }
}
function registerPayment({ studentId, plan, amount, method, date, status, operationRef }) {
  const student = studentById(studentId);
  const payment = {
    id: genId("p", PAYMENTS),
    studentId,
    student: student ? student.name : "",
    program: student ? student.program : "",
    amount: Number(amount),
    plan,
    date: date || todayISO(),
    method,
    operationRef: operationRef || "",
    status: status || "al_dia",
    receiptType: null,
    receiptNumber: null,
  };
  PAYMENTS.push(payment);
  applyPaymentEffects(student, payment);
  logActivity("money", "var(--status-good)", `Pago recibido de <strong>${payment.student}</strong> (${fmtMoney(payment.amount)})`);
  persist();
  return payment;
}
function markPaymentPaid(paymentId) {
  const p = PAYMENTS.find((x) => x.id === paymentId);
  if (!p) return;
  p.status = "al_dia";
  p.date = todayISO();
  applyPaymentEffects(studentById(p.studentId), p);
  logActivity("money", "var(--status-good)", `Pago confirmado de <strong>${p.student}</strong> (${fmtMoney(p.amount)})`);
  persist();
}
function issueReceipt(paymentId, type) {
  const p = PAYMENTS.find((x) => x.id === paymentId);
  if (!p) return null;
  receiptSeq += 1;
  const series = type === "factura" ? "F001" : "B001";
  p.receiptType = type;
  p.receiptNumber = `${series}-${receiptSeq}`;
  persist();
  return p;
}

/* ---------- Clases ---------- */
function createClass(data) {
  const c = {
    id: genId("c", CLASSES),
    program: data.program,
    instructor: data.instructor,
    day: data.day,
    time: data.time,
    room: data.room,
    category: data.category || "Adultos",
    capacity: Number(data.capacity),
    enrolled: 0,
    roster: [],
  };
  CLASSES.push(c);
  logActivity("calendar", "var(--series-2)", `Nueva clase creada: <strong>${programName(c.program)}</strong> (${c.day} ${c.time})`);
  persist();
  return c;
}
function updateClass(id, data) {
  const c = classById(id);
  if (!c) return;
  Object.assign(c, data, { capacity: Number(data.capacity ?? c.capacity) });
  persist();
}
function deleteClass(id) {
  const idx = CLASSES.findIndex((c) => c.id === id);
  if (idx === -1) return;
  CLASSES.splice(idx, 1);
  Object.values(CHECKINS).forEach((byClass) => delete byClass[id]);
  persist();
}
function addStudentToRoster(classId, studentId) {
  const c = classById(classId);
  if (!c || c.roster.includes(studentId)) return;
  c.roster.push(studentId);
  c.enrolled = c.roster.length;
  persist();
}

/* ---------- Instructores ---------- */
function createInstructor(data) {
  const i = {
    id: genId("i", INSTRUCTORS),
    name: data.name.trim(),
    initials: initialsOf(data.name),
    title: data.title,
    program: data.program,
    rank: data.rank,
    years: Number(data.years) || 0,
    students: 0,
    hourlyRate: Number(data.hourlyRate) || 0,
    phone: data.phone || "",
    email: data.email || "",
  };
  INSTRUCTORS.push(i);
  logActivity("user", "var(--series-1)", `Nuevo instructor: <strong>${i.name}</strong>`);
  persist();
  return i;
}
function updateInstructor(id, data) {
  const i = instructorById(id);
  if (!i) return;
  Object.assign(i, data, { initials: initialsOf(data.name || i.name) });
  persist();
}
function deleteInstructor(id) {
  if (CLASSES.some((c) => c.instructor === id)) {
    return { ok: false, reason: "Tiene clases asignadas. Reasígnalas o elimínalas primero." };
  }
  const idx = INSTRUCTORS.findIndex((i) => i.id === id);
  if (idx === -1) return { ok: false };
  INSTRUCTORS.splice(idx, 1);
  persist();
  return { ok: true };
}

/* ---------- Asistencia (check-in) ---------- */
function getCheckinList(dateKey, classId) {
  return (CHECKINS[dateKey] && CHECKINS[dateKey][classId]) || [];
}
function toggleCheckin(dateKey, classId, studentId) {
  if (!CHECKINS[dateKey]) CHECKINS[dateKey] = {};
  if (!CHECKINS[dateKey][classId]) CHECKINS[dateKey][classId] = [];
  const list = CHECKINS[dateKey][classId];
  const idx = list.indexOf(studentId);
  const student = studentById(studentId);
  const nowPresent = idx === -1;
  if (idx > -1) list.splice(idx, 1);
  else list.push(studentId);

  if (student && dateKey === todayISO()) {
    if (nowPresent) {
      student.lastVisit = dateKey;
      student.classesSincePromotion = (student.classesSincePromotion || 0) + 1;
      if (planByName(student.plan).type === "paquete" && student.classCredits > 0) student.classCredits -= 1;
    } else {
      student.classesSincePromotion = Math.max(0, (student.classesSincePromotion || 0) - 1);
      if (planByName(student.plan).type === "paquete") student.classCredits += 1;
    }
  }
  persist();
  return list;
}

/* ---------- Caja ---------- */
function currentOpenShift() {
  return CASH_SHIFTS.find((s) => s.status === "open") || null;
}
function openShift({ openedBy, openingAmount }) {
  const shift = {
    id: genId("turno", CASH_SHIFTS),
    openedAt: new Date().toISOString(),
    openedBy,
    openingAmount: Number(openingAmount) || 0,
    status: "open",
    closedAt: null,
    closingAmount: null,
    notes: "",
  };
  CASH_SHIFTS.push(shift);
  persist();
  return shift;
}
function closeShift(shiftId, { closingAmount, notes }) {
  const shift = CASH_SHIFTS.find((s) => s.id === shiftId);
  if (!shift) return;
  shift.status = "closed";
  shift.closedAt = new Date().toISOString();
  shift.closingAmount = Number(closingAmount) || 0;
  shift.notes = notes || "";
  persist();
}
function paymentsDuringShift(shift) {
  if (!shift) return [];
  const start = shift.openedAt;
  const end = shift.closedAt || new Date().toISOString();
  return PAYMENTS.filter((p) => p.status === "al_dia" && p.date >= start.slice(0, 10) && p.date <= end.slice(0, 10));
}

/* ---------- Notificaciones (simuladas) ---------- */
function dismissNotification(key) {
  DISMISSED_NOTIFICATIONS[key] = todayISO();
  persist();
}

/* ---------- Configuración ---------- */
function saveAcademy(data) {
  Object.assign(ACADEMY, data);
  persist();
}

/* ---------- Planes de membresía ---------- */
function addPlan(data) {
  if (PLANS_CATALOG.some((p) => p.name.toLowerCase() === data.name.trim().toLowerCase())) {
    return { ok: false, reason: "Ya existe un plan con ese nombre." };
  }
  const plan = {
    name: data.name.trim(),
    type: data.type,
    price: Number(data.price),
    days: data.type === "tiempo" ? Number(data.days) : undefined,
    credits: data.type === "paquete" ? Number(data.credits) : undefined,
    color: data.color || "#2a78d6",
    description: data.description || "",
    active: true,
  };
  PLANS_CATALOG.push(plan);
  logActivity("tag", "var(--series-3)", `Nuevo plan de membresía: <strong>${plan.name}</strong>`);
  persist();
  return { ok: true, plan };
}
function updatePlan(name, data) {
  const p = planByName(name);
  Object.assign(p, {
    price: data.price !== undefined ? Number(data.price) : p.price,
    days: p.type === "tiempo" ? Number(data.days ?? p.days) : p.days,
    credits: p.type === "paquete" ? Number(data.credits ?? p.credits) : p.credits,
    color: data.color ?? p.color,
    description: data.description ?? p.description,
  });
  persist();
}
function setPlanActive(name, active) {
  const p = planByName(name);
  p.active = !!active;
  persist();
}
function deletePlan(name) {
  const idx = PLANS_CATALOG.findIndex((p) => p.name === name);
  if (idx === -1) return { ok: false };
  if (STUDENTS.some((s) => s.plan === name)) return { ok: false, reason: "Hay alumnos usando este plan. Desactívalo en vez de eliminarlo." };
  PLANS_CATALOG.splice(idx, 1);
  persist();
  return { ok: true };
}
function planStats(name) {
  const students = STUDENTS.filter((s) => s.plan === name && s.status !== "Inactivo");
  const revenue = PAYMENTS.filter((p) => p.plan === name && p.status === "al_dia").reduce((s, p) => s + p.amount, 0);
  return { studentCount: students.length, revenue };
}

/* ---------- Escalas de graduación ---------- */
function addBeltLevel(program, data) {
  const scale = beltScaleFor(program);
  if (scale.length && scale[scale.length - 1].examClasses == null) {
    scale[scale.length - 1].examClasses = Number(data.previousExamClasses) || 20;
  }
  scale.push({
    name: data.name.trim(),
    hex: data.hex || "#2a78d6",
    stroke: data.hex && data.hex.toLowerCase() === "#ffffff" ? "#c3c2b7" : null,
    textOn: data.textOn || "#ffffff",
    examClasses: null,
  });
  logActivity("belt", "var(--series-7)", `Nuevo nivel de graduación: <strong>${data.name}</strong> (${programName(program)})`);
  persist();
  return { ok: true };
}
function updateBeltLevel(program, index, data) {
  const scale = beltScaleFor(program);
  const level = scale[index];
  if (!level) return { ok: false };
  Object.assign(level, {
    name: data.name?.trim() || level.name,
    hex: data.hex || level.hex,
    examClasses: level.examClasses == null ? null : (data.examClasses !== undefined ? Number(data.examClasses) : level.examClasses),
  });
  persist();
  return { ok: true };
}
function deleteBeltLevel(program, index) {
  const scale = beltScaleFor(program);
  if (index !== scale.length - 1) return { ok: false, reason: "Solo puedes eliminar el último nivel de la escala." };
  if (scale.length <= 1) return { ok: false, reason: "La escala debe tener al menos un nivel." };
  if (STUDENTS.some((s) => s.program === program && (s.beltIndex || 0) === index)) {
    return { ok: false, reason: "Hay alumnos actualmente en este nivel." };
  }
  scale.pop();
  scale[scale.length - 1].examClasses = null;
  persist();
  return { ok: true };
}
function levelStudentCount(program, index) {
  return STUDENTS.filter((s) => s.program === program && (s.beltIndex || 0) === index && s.status !== "Inactivo").length;
}

/* ---------- Gastos ---------- */
function createExpense(data) {
  const category = expenseCategoryInfo(data.category);
  const expense = {
    id: genId("e", EXPENSES),
    category: data.category,
    instructorId: data.instructorId || null,
    description: data.description.trim(),
    amount: Number(data.amount),
    type: data.type || category.type,
    recurring: !!data.recurring,
    date: data.date || todayISO(),
  };
  EXPENSES.push(expense);
  logActivity("money", "var(--status-critical)", `Nuevo gasto registrado: <strong>${expense.description}</strong> (${fmtMoney(expense.amount)})`);
  persist();
  return expense;
}
function updateExpense(id, data) {
  const e = EXPENSES.find((x) => x.id === id);
  if (!e) return;
  Object.assign(e, {
    category: data.category || e.category,
    description: data.description ? data.description.trim() : e.description,
    amount: data.amount !== undefined ? Number(data.amount) : e.amount,
    type: data.type || e.type,
    recurring: data.recurring !== undefined ? !!data.recurring : e.recurring,
    date: data.date || e.date,
  });
  persist();
}
function deleteExpense(id) {
  const idx = EXPENSES.findIndex((x) => x.id === id);
  if (idx === -1) return;
  EXPENSES.splice(idx, 1);
  persist();
}
/* Genera (o actualiza) el gasto de "Sueldos" del mes en curso para cada
   instructor, a partir de sus horas semanales × su tarifa, sin duplicar
   si ya se generó antes para este mes. */
function generateMonthlySalaries() {
  const monthPrefix = todayISO().slice(0, 7);
  let created = 0, updated = 0;
  INSTRUCTORS.forEach((i) => {
    const hours = CLASSES.filter((c) => c.instructor === i.id).reduce((s, c) => s + classDurationHours(c.time), 0);
    const amount = Math.round(hours * (i.hourlyRate || 0) * 4);
    if (amount <= 0) return;
    const existing = EXPENSES.find((e) => e.category === "sueldos" && e.instructorId === i.id && e.date.slice(0, 7) === monthPrefix);
    if (existing) {
      existing.amount = amount;
      existing.description = `Sueldo de ${i.name} (${hours}h/sem × ${fmtMoney(i.hourlyRate)})`;
      updated++;
    } else {
      EXPENSES.push({
        id: genId("e", EXPENSES), category: "sueldos", instructorId: i.id,
        description: `Sueldo de ${i.name} (${hours}h/sem × ${fmtMoney(i.hourlyRate)})`,
        amount, type: "fijo", recurring: true, date: todayISO(),
      });
      created++;
    }
  });
  if (created || updated) {
    logActivity("money", "var(--status-critical)", `Sueldos del mes generados: ${created} nuevo(s), ${updated} actualizado(s)`);
    persist();
  }
  return { created, updated };
}

initStore();
