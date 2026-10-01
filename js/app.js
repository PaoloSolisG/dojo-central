/* ============================================================
   Lógica de la aplicación — navegación, tablas, filtros, CRUD,
   check-in de asistencia, búsqueda, recepción, caja, reportes,
   notificaciones y configuración.
   ============================================================ */

/* Todos los íconos declaran width/height explícitos: sin eso, un <svg>
   con solo viewBox no tiene tamaño intrínseco fiable y, dentro de un
   contenedor que no sea flex (p. ej. .chip-btn), el navegador puede
   inflarlo a su tamaño por defecto — por eso antes se veían gigantes. */
const ICONS = {
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
  minus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10.1a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2z"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  belt: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.2L21 10l-5 4.2L17.4 21 12 17.3 6.6 21 8 14.2 3 10l6.6-1.8z"/></svg>',
  money: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5a2.5 2.5 0 0 1 2.5-1 2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 2.5-1"/></svg>',
  calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
  edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  ban: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M5.5 5.5l13 13"/></svg>',
  refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>',
  camera: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  receipt: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12v19l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6"/></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>',
  family: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"/><path d="M15.5 14.2A4 4 0 0 1 21 18v1"/></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.4 6.2L21 10l-5 4.2L17.4 21 12 17.3 6.6 21 8 14.2 3 10l6.6-1.8z"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  arrowUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  tag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 12.3L12.7 20a2 2 0 0 1-2.8 0l-8-8A2 2 0 0 1 2 10.5V4a2 2 0 0 1 2-2h6.5a2 2 0 0 1 1.4.6l8.6 8.6a2 2 0 0 1 0 2.9z"/><circle cx="7.5" cy="7.5" r="1.3"/></svg>',
};

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const OCCUPANCY_SLOTS = [
  { label: "Mañana", test: (h) => h >= 6 && h < 12 },
  { label: "Tarde", test: (h) => h >= 12 && h < 18 },
  { label: "Noche", test: (h) => h >= 18 && h < 23 },
];
function buildOccupancyMatrix() {
  return OCCUPANCY_SLOTS.map((slot) => DAYS.map((day) => {
    const matches = CLASSES.filter((c) => c.day === day && c.capacity && slot.test(Number(c.time.split(":")[0])));
    if (!matches.length) return null;
    const avg = matches.reduce((s, c) => s + (c.enrolled / c.capacity) * 100, 0) / matches.length;
    return Math.round(avg);
  }));
}
const STUDENTS_PAGE_SIZE = 8;
const PAYMENTS_PAGE_SIZE = 10;
const EXPENSES_PAGE_SIZE = 10;
let studentsPage = 1;
let paymentsPage = 1;
let expensesPage = 1;

function paymentBadge(status) {
  if (status === "al_dia") return `<span class="badge badge-good">${ICONS.check}Al día</span>`;
  if (status === "pendiente") return `<span class="badge badge-warning">${ICONS.clock}Pendiente</span>`;
  return `<span class="badge badge-critical">${ICONS.alert}Vencido</span>`;
}
function statusBadge(student) {
  const st = effectiveStatus(student);
  if (st === "Activo") return `<span class="badge badge-good">${ICONS.check}Activo</span>`;
  if (st === "Morosidad") return `<span class="badge badge-critical">${ICONS.alert}Morosidad</span>`;
  if (st === "Congelado") return `<span class="badge badge-frozen">${ICONS.pause}Congelado</span>`;
  return `<span class="badge badge-neutral">${ICONS.minus}Inactivo</span>`;
}
function avatarColor(seedStr) {
  const colors = PROGRAMS.map((p) => p.color);
  let h = 0;
  for (const c of seedStr) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}
function avatarHtml(entity, size) {
  const sz = size || 32;
  if (entity.photo) return `<div class="avatar" style="width:${sz}px;height:${sz}px;padding:0;overflow:hidden"><img src="${entity.photo}" style="width:100%;height:100%;object-fit:cover" /></div>`;
  return `<div class="avatar" style="width:${sz}px;height:${sz}px;background:${avatarColor(entity.name)}">${entity.initials}</div>`;
}
function optionsHtml(items, valueFn, labelFn, selected) {
  return items.map((it) => `<option value="${valueFn(it)}" ${String(valueFn(it)) === String(selected) ? "selected" : ""}>${labelFn(it)}</option>`).join("");
}
function assignablePlans(currentName) {
  return PLANS_CATALOG.filter((p) => p.active || p.name === currentName);
}
function beltIndexOptionsHtml(program, selectedIndex) {
  return beltScaleFor(program).map((r, idx) => `<option value="${idx}" ${idx === selectedIndex ? "selected" : ""}>${r.name}</option>`).join("");
}
function todayAbbr() {
  const map = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return map[new Date().getDay()];
}

/* ============================================================
   Navegación
   ============================================================ */
const VIEW_META = {
  dashboard: { title: "Resumen", sub: () => `Visión general de la academia — hoy, ${formatToday()}` },
  reportes: { title: "Reportes", sub: () => "Deserción, ingresos y clases populares" },
  recepcion: { title: "Recepción", sub: () => "Marcaje rápido por DNI" },
  alumnos: { title: "Alumnos", sub: () => `${STUDENTS.length} alumnos registrados en el sistema` },
  apoderados: { title: "Apoderados", sub: () => `${GUARDIANS.length} apoderados registrados` },
  clases: { title: "Clases y horario", sub: () => `${CLASSES.length} clases programadas esta semana` },
  asistencia: { title: "Asistencia", sub: () => `Seguimiento de check-in — hoy ${todayAbbr()}` },
  instructores: { title: "Instructores", sub: () => `${INSTRUCTORS.length} instructores activos` },
  pagos: { title: "Pagos y membresías", sub: () => `Estado de cuenta de todos los alumnos` },
  caja: { title: "Caja", sub: () => "Apertura, arqueo y cierre de turno" },
  gastos: { title: "Gastos", sub: () => `${EXPENSES.length} gastos registrados` },
  planes: { title: "Planes y Grados", sub: () => `${PLANS_CATALOG.length} planes · escalas de graduación por disciplina` },
  notificaciones: { title: "Notificaciones", sub: () => "Cola de mensajes simulada" },
  configuracion: { title: "Configuración", sub: () => "Datos generales de la academia" },
};
const VIEW_RENDERERS = {
  dashboard: renderDashboard,
  reportes: renderReports,
  recepcion: renderReception,
  alumnos: () => renderStudentsTable(),
  apoderados: renderGuardians,
  clases: renderSchedule,
  asistencia: renderAttendanceView,
  instructores: renderInstructors,
  pagos: () => { renderPaymentsKpis(); renderPaymentsTable(); },
  caja: renderCaja,
  gastos: renderExpenses,
  planes: renderPlanesGrados,
  notificaciones: renderNotifications,
  configuracion: renderSettings,
};
function formatToday() {
  return new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + viewId).classList.add("active");
  document.querySelectorAll(".nav-link").forEach((n) => n.classList.toggle("active", n.dataset.view === viewId));
  const meta = VIEW_META[viewId];
  document.getElementById("topbarTitle").textContent = meta.title;
  document.getElementById("topbarSub").textContent = meta.sub();
  document.getElementById("sidebar").classList.remove("open");
  VIEW_RENDERERS[viewId]();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});
document.getElementById("hamburgerBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

/* ============================================================
   Tema claro / oscuro
   ============================================================ */
(function initTheme() {
  const saved = localStorage.getItem("dojo-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentlyDark = current ? current === "dark" : prefersDark;
    const next = currentlyDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("dojo-theme", next);
  });
})();

/* ============================================================
   Búsqueda global (topbar)
   ============================================================ */
(function initGlobalSearch() {
  const input = document.getElementById("globalSearch");
  const panel = document.getElementById("searchResults");

  function renderResults(q) {
    const query = q.trim().toLowerCase();
    if (query.length < 1) { panel.hidden = true; panel.innerHTML = ""; return; }

    const students = STUDENTS.filter((s) => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query) || s.dni.includes(query)).slice(0, 5);
    const instructors = INSTRUCTORS.filter((i) => i.name.toLowerCase().includes(query)).slice(0, 4);
    const classes = CLASSES.filter((c) => programName(c.program).toLowerCase().includes(query)).slice(0, 4);

    if (!students.length && !instructors.length && !classes.length) {
      panel.innerHTML = `<div class="sr-empty">Sin resultados para "${q}"</div>`;
      panel.hidden = false;
      return;
    }

    let html = "";
    if (students.length) {
      html += `<div class="sr-group-label">Alumnos</div>` + students.map((s) => `
        <div class="sr-item" data-type="student" data-id="${s.id}"><span>${s.name}</span><span class="sr-sub">${programName(s.program)}</span></div>`).join("");
    }
    if (instructors.length) {
      html += `<div class="sr-group-label">Instructores</div>` + instructors.map((i) => `
        <div class="sr-item" data-type="instructor" data-id="${i.id}"><span>${i.name}</span><span class="sr-sub">${programName(i.program)}</span></div>`).join("");
    }
    if (classes.length) {
      html += `<div class="sr-group-label">Clases</div>` + classes.map((c) => `
        <div class="sr-item" data-type="class" data-id="${c.id}"><span>${programName(c.program)}</span><span class="sr-sub">${c.day} · ${c.time}</span></div>`).join("");
    }
    panel.innerHTML = html;
    panel.hidden = false;

    panel.querySelectorAll(".sr-item").forEach((el) => {
      el.addEventListener("click", () => {
        const { type, id } = el.dataset;
        panel.hidden = true;
        input.value = "";
        if (type === "student") { switchView("alumnos"); openStudentModal(id); }
        else if (type === "instructor") { switchView("instructores"); }
        else if (type === "class") { switchView("clases"); }
      });
    });
  }

  input.addEventListener("input", () => renderResults(input.value));
  input.addEventListener("focus", () => { if (input.value.trim()) renderResults(input.value); });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) panel.hidden = true;
  });
})();

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const activeStudents = STUDENTS.filter((s) => s.status === "Activo").length;
  const monthRevenue = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 1].value;
  const prevRevenue = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 2].value;
  const revenueDelta = (((monthRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1);

  const todayClasses = CLASSES.filter((c) => c.day === todayAbbr());
  const todayRoster = todayClasses.reduce((s, c) => s + c.roster.length, 0);
  const todayPresent = todayClasses.reduce((s, c) => s + getCheckinList(todayISO(), c.id).length, 0);

  const pendingPayments = PAYMENTS.filter((p) => p.status !== "al_dia");
  const pendingAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const kpis = [
    { label: "Alumnos activos", value: activeStudents, delta: `${STUDENTS.length} en total`, up: true, neutral: true },
    { label: "Ingresos del mes", value: fmtMoney(monthRevenue), delta: `${revenueDelta > 0 ? "+" : ""}${revenueDelta}% vs. mes anterior`, up: revenueDelta >= 0, sparkId: "kpiSparkRevenue" },
    { label: "Check-in de hoy", value: todayRoster ? `${todayPresent}/${todayRoster}` : "—", delta: todayClasses.length + " clases hoy", up: true, neutralDelta: true, sparkId: "kpiSparkAttendance" },
    { label: "Pagos pendientes", value: pendingPayments.length, delta: `${fmtMoney(pendingAmount)} por cobrar`, up: false },
  ];
  document.getElementById("kpiGrid").innerHTML = kpis.map((k) => `
    <div class="kpi-tile">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-delta ${k.neutralDelta || k.neutral ? "" : k.up ? "up" : "down"}">${k.delta}</div>
      ${k.sparkId ? `<div class="kpi-sparkline" id="${k.sparkId}"></div>` : ""}
    </div>`).join("");

  renderSparkline(document.getElementById("kpiSparkRevenue"), REVENUE_MONTHLY, { seriesVar: "--series-1", valueFmt: fmtMoney });
  renderSparkline(document.getElementById("kpiSparkAttendance"), ATTENDANCE_WEEKLY, { seriesVar: "--series-2", valueFmt: (v) => v + " asistencias" });

  renderLineChart(document.getElementById("revenueChart"), REVENUE_MONTHLY, {
    seriesVar: "--series-1", valueFmt: fmtMoney, cardActions: document.getElementById("revenueActions"),
  });
  const goal = ACADEMY.monthlyRevenueGoal || monthRevenue;
  const metGoal = monthRevenue >= goal;
  renderMeter(document.getElementById("revenueGoalMeter"), {
    value: monthRevenue, max: goal, formatValue: fmtMoney,
    fillVar: metGoal ? "--status-good" : "--series-1",
    footnote: metGoal ? "¡Meta alcanzada!" : `faltan ${fmtMoney(goal - monthRevenue)}`,
  });
  renderBarChart(document.getElementById("enrollChart"), ENROLLMENTS_MONTHLY, {
    seriesVar: "--series-3", valueFmt: (v) => v + " alumnos", cardActions: document.getElementById("enrollActions"),
  });
  renderBarChart(document.getElementById("attendanceChart"), ATTENDANCE_WEEKLY, {
    seriesVar: "--series-2", valueFmt: (v) => v + " asistencias", cardActions: document.getElementById("attendanceActions"),
  });
  renderHeatmap(document.getElementById("occupancyHeatmap"), document.getElementById("occupancyActions"), {
    rows: OCCUPANCY_SLOTS.map((s) => s.label), cols: DAYS, matrix: buildOccupancyMatrix(), valueFmt: (v) => v + "%",
  });
  renderBeltDistribution(document.getElementById("beltChart"), document.getElementById("beltActions"));
  renderProgramDistribution(document.getElementById("programDistChart"), document.getElementById("programDistActions"));

  const atRisk = STUDENTS.filter((s) => s.status !== "Inactivo" && s.paymentStatus !== "al_dia").slice(0, 5);
  document.getElementById("alertList").innerHTML = atRisk.map((s) => {
    const critical = s.paymentStatus === "vencido";
    return `<div class="alert-item">
      <span class="dot" style="background:${critical ? "var(--status-critical)" : "var(--status-warning)"}"></span>
      <div>
        <div class="title">${s.name}</div>
        <div class="meta">${critical ? "Membresía vencida" : "Pago pendiente"} · vence ${s.nextPayment}</div>
      </div>
    </div>`;
  }).join("") || `<div class="alert-item"><span class="dot" style="background:var(--status-good)"></span><div class="title">Todo al día</div></div>`;

  document.getElementById("activityList").innerHTML = ACTIVITY_LOG.slice(0, 8).map((a) => `
    <div class="activity-item">
      <div class="ico" style="background:color-mix(in srgb, ${a.color} 16%, transparent); color:${a.color}">${ICONS[a.ico] || ICONS.user}</div>
      <div><div>${a.text}</div><div class="when">${a.when}</div></div>
    </div>`).join("") || `<div style="color:var(--text-muted);font-size:12px">Sin actividad todavía.</div>`;
}

/* ============================================================
   REPORTES
   ============================================================ */
function renderReports() {
  const thisMonthPrefix = todayISO().slice(0, 7);
  const inactiveThisMonth = STUDENTS.filter((s) => s.status === "Inactivo" && s.inactiveDate && s.inactiveDate.slice(0, 7) === thisMonthPrefix);
  const activeNow = STUDENTS.filter((s) => s.status !== "Inactivo").length;
  const churnRate = (activeNow + inactiveThisMonth.length) ? Math.round((inactiveThisMonth.length / (activeNow + inactiveThisMonth.length)) * 100) : 0;

  const paidTotal = PAYMENTS.filter((p) => p.status === "al_dia").reduce((s, p) => s + p.amount, 0);
  const unpaidTotal = PAYMENTS.filter((p) => p.status !== "al_dia").reduce((s, p) => s + p.amount, 0);

  document.getElementById("reportsKpiGrid").innerHTML = [
    { label: "Tasa de deserción (mes)", value: churnRate + "%", delta: `${inactiveThisMonth.length} baja(s) este mes` },
    { label: "Alumnos activos", value: activeNow, delta: `${STUDENTS.length} en el histórico` },
    { label: "Ingresos cobrados", value: fmtMoney(paidTotal), delta: "pagos al día" },
    { label: "Por cobrar", value: fmtMoney(unpaidTotal), delta: "pendiente + vencido" },
  ].map((k) => `
    <div class="kpi-tile">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-delta">${k.delta}</div>
    </div>`).join("");

  renderBarChart(document.getElementById("reportRevenueChart"), [
    { label: "Cobrado", value: paidTotal }, { label: "Por cobrar", value: unpaidTotal },
  ], { seriesVar: "--series-1", valueFmt: fmtMoney });

  const reasonCounts = INACTIVE_REASONS.map((r) => ({ label: r, value: STUDENTS.filter((s) => s.status === "Inactivo" && s.inactiveReason === r).length })).filter((r) => r.value > 0);
  const churnEl = document.getElementById("churnReasonsChart");
  if (reasonCounts.length) renderBarChart(churnEl, reasonCounts, { seriesVar: "--series-8", valueFmt: (v) => v + " alumno(s)" });
  else churnEl.innerHTML = `<p style="color:var(--text-muted);font-size:12px">Sin bajas registradas todavía.</p>`;

  const ranked = [...CLASSES].sort((a, b) => (b.enrolled / b.capacity) - (a.enrolled / a.capacity)).slice(0, 8);
  document.getElementById("popularClassesList").innerHTML = ranked.map((c) => {
    const pct = Math.round((c.enrolled / c.capacity) * 100);
    return `<div class="class-card" style="--card-accent:${programColor(c.program)};margin-bottom:10px">
      <div class="program">${programName(c.program)} <span style="color:var(--text-muted);font-weight:400;font-size:11px">· ${c.day} ${c.time}</span></div>
      <div class="capacity-track"><div class="capacity-fill" style="width:${Math.min(pct, 100)}%;${pct > 100 ? "background:var(--status-critical)" : ""}"></div></div>
      <div class="capacity-text">${c.enrolled}/${c.capacity} inscritos (${pct}%)</div>
    </div>`;
  }).join("") || `<p style="color:var(--text-muted);font-size:12px">Aún no hay clases.</p>`;
}

/* ============================================================
   RECEPCIÓN — marcaje rápido por DNI + semáforo
   ============================================================ */
function renderReception() {
  document.getElementById("receptionDni").focus();
}
document.getElementById("receptionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const dniInput = document.getElementById("receptionDni");
  const dni = dniInput.value.trim();
  const result = document.getElementById("receptionResult");
  const s = studentByDni(dni);

  if (!dni) return;
  if (!s) {
    result.innerHTML = `<div class="semaforo-panel rojo">
      <div class="sem-status">DNI no encontrado</div>
      <div class="sem-detail">Verifica el número o registra al alumno en Alumnos.</div>
    </div>`;
    dniInput.value = "";
    return;
  }

  const color = paymentSemaphore(s);
  const rank = currentRank(s);
  const todaysClass = CLASSES.find((c) => c.day === todayAbbr() && c.program === s.program);
  let checkinNote = "";
  if (effectiveStatus(s) !== "Inactivo" && effectiveStatus(s) !== "Congelado" && todaysClass) {
    if (!todaysClass.roster.includes(s.id)) addStudentToRoster(todaysClass.id, s.id);
    const list = getCheckinList(todayISO(), todaysClass.id);
    if (!list.includes(s.id)) toggleCheckin(todayISO(), todaysClass.id, s.id);
    checkinNote = `<div class="sem-detail">Asistencia registrada en ${programName(todaysClass.program)} (${todaysClass.time})</div>`;
  }

  const statusLabel = effectiveStatus(s) === "Congelado" ? "Membresía congelada"
    : effectiveStatus(s) === "Inactivo" ? "Alumno inactivo"
    : color === "verde" ? "Acceso permitido"
    : color === "amarillo" ? "Acceso permitido — pago próximo a vencer"
    : "Acceso bloqueado — membresía vencida";
  const panelColor = effectiveStatus(s) === "Congelado" || effectiveStatus(s) === "Inactivo" ? "amarillo" : color;

  result.innerHTML = `<div class="semaforo-panel ${panelColor}">
    <div class="sem-avatar">${s.photo ? `<img src="${s.photo}" />` : s.initials}</div>
    <div class="sem-name">${s.name}</div>
    <div class="sem-sub">${programName(s.program)} · ${rank.name}</div>
    <div class="sem-status">${statusLabel}</div>
    <div class="sem-detail">${s.paymentStatus === "vencido" ? `Vencido desde ${s.nextPayment}` : `Próximo pago: ${s.nextPayment}`}</div>
    ${checkinNote}
  </div>`;
  dniInput.value = "";
  dniInput.focus();
});

/* ============================================================
   ALUMNOS
   ============================================================ */
function populateProgramFilter() {
  const sel = document.getElementById("filterProgram");
  sel.innerHTML = `<option value="">Todas las disciplinas</option>` + optionsHtml(PROGRAMS, (p) => p.id, (p) => p.name);
}

function filteredStudents() {
  const search = document.getElementById("studentSearch").value.trim().toLowerCase();
  const program = document.getElementById("filterProgram").value;
  const payStatus = document.getElementById("filterPaymentStatus").value;
  const lifecycle = document.getElementById("filterLifecycleStatus").value;
  return STUDENTS.filter((s) =>
    (!search || s.name.toLowerCase().includes(search) || s.dni.includes(search)) &&
    (!program || s.program === program) &&
    (!payStatus || s.paymentStatus === payStatus) &&
    (!lifecycle || effectiveStatus(s) === lifecycle)
  );
}

function renderStudentsTable() {
  const filtered = filteredStudents();
  const { items, page, totalPages, total } = paginate(filtered, studentsPage, STUDENTS_PAGE_SIZE);
  studentsPage = page;

  document.getElementById("studentsTableBody").innerHTML = items.length ? items.map((s) => {
    const rank = currentRank(s);
    return `<tr data-student="${s.id}">
      <td><div class="row-person">
        ${avatarHtml(s)}
        <div><div class="name">${s.name}</div><div class="sub">${s.email}</div></div>
      </div></td>
      <td class="tnum">${s.dni || "—"}</td>
      <td>${programName(s.program)}</td>
      <td><span class="belt-dot"><span class="dot" style="background:${rank.hex};border-color:${rank.stroke || "transparent"}"></span>${rank.name}</span></td>
      <td>${s.plan}</td>
      <td>${paymentBadge(s.paymentStatus)}</td>
      <td class="tnum">${s.attendance}%</td>
      <td>${statusBadge(s)}</td>
    </tr>`;
  }).join("") : `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:28px">No se encontraron alumnos con esos filtros.</td></tr>`;

  renderPaginationControls(document.getElementById("studentsPagination"), {
    page, totalPages, total, pageSize: STUDENTS_PAGE_SIZE,
    onChange: (p) => { studentsPage = p; renderStudentsTable(); },
  });

  document.querySelectorAll("#studentsTableBody tr[data-student]").forEach((row) => {
    row.addEventListener("click", () => openStudentModal(row.dataset.student));
  });
}

["studentSearch", "filterProgram", "filterPaymentStatus", "filterLifecycleStatus"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => { studentsPage = 1; renderStudentsTable(); });
  document.getElementById(id).addEventListener("change", () => { studentsPage = 1; renderStudentsTable(); });
});

document.getElementById("btnExportStudents").addEventListener("click", () => {
  const rows = filteredStudents().map((s) => [s.name, s.dni, s.email, s.phone, programName(s.program), currentRank(s).name, s.plan, s.paymentStatus, s.attendance + "%", effectiveStatus(s), s.nextPayment]);
  exportCSV("alumnos.csv", ["Nombre", "DNI", "Email", "Teléfono", "Disciplina", "Nivel", "Plan", "Estado de pago", "Asistencia", "Estado", "Próximo pago"], rows);
});

function studentFormFields(s) {
  return `
    <div class="photo-upload" style="margin-bottom:16px">
      <div class="photo-preview" id="photoPreview">${s && s.photo ? `<img src="${s.photo}" />` : ICONS.camera}</div>
      <div>
        <input type="file" accept="image/*" id="fldPhotoFile" style="font-size:11px" />
        <input type="hidden" name="photo" id="fldPhotoHidden" value="${s && s.photo ? s.photo : ""}" />
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Foto del alumno (opcional)</div>
      </div>
    </div>
    <div class="form-row"><label>Nombre completo</label><input type="text" name="name" required value="${s ? s.name : ""}" /></div>
    <div class="modal-grid" style="margin-bottom:0">
      <div class="form-row"><label>DNI</label><input type="text" name="dni" maxlength="8" value="${s ? s.dni : ""}" /></div>
      <div class="form-row"><label>Email</label><input type="email" name="email" required value="${s ? s.email : ""}" /></div>
      <div class="form-row"><label>Teléfono</label><input type="text" name="phone" value="${s ? s.phone : "+51 "}" /></div>
      <div class="form-row"><label>Disciplina</label><select name="program" id="fldProgram">${optionsHtml(PROGRAMS, (p) => p.id, (p) => p.name, s ? s.program : PROGRAMS[0].id)}</select></div>
      ${s ? `<div class="form-row"><label>Nivel actual</label><select name="beltIndex" id="fldBeltIndex">${beltIndexOptionsHtml(s.program, s.beltIndex)}</select></div>` : ""}
      <div class="form-row"><label>Plan</label><select name="plan">${optionsHtml(assignablePlans(s ? s.plan : null), (p) => p.name, (p) => `${p.name} (${fmtMoney(p.price)}${p.type === "paquete" ? ` · ${p.credits} clases` : ""})`, s ? s.plan : PLANS_CATALOG[0].name)}</select></div>
      <div class="form-row"><label>Apoderado (opcional)</label>
        <select name="guardianId">
          <option value="" ${!s || !s.guardianId ? "selected" : ""}>— Sin apoderado —</option>
          ${optionsHtml(GUARDIANS, (g) => g.id, (g) => g.name, s ? s.guardianId : "")}
        </select>
      </div>
      <div class="form-row"><label>Contacto de emergencia</label><input type="text" name="emergencyContactName" value="${s ? s.emergencyContactName : ""}" /></div>
      <div class="form-row"><label>Tel. de emergencia</label><input type="text" name="emergencyContactPhone" value="${s ? s.emergencyContactPhone : ""}" /></div>
    </div>
    <div class="form-row"><label>Ficha médica (lesiones / condiciones)</label><textarea name="medicalNotes" rows="2" style="width:100%;padding:9px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface-1);color:var(--text-primary);font:inherit">${s ? s.medicalNotes : ""}</textarea></div>`;
}
function wireStudentFormExtras(form, initialProgram) {
  const fileInput = form.querySelector("#fldPhotoFile");
  const hiddenPhoto = form.querySelector("#fldPhotoHidden");
  const preview = form.querySelector("#photoPreview");
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    hiddenPhoto.value = url;
    preview.innerHTML = `<img src="${url}" />`;
  });
  const programSel = form.querySelector("#fldProgram");
  const beltSel = form.querySelector("#fldBeltIndex");
  if (beltSel) {
    programSel.addEventListener("change", () => {
      beltSel.innerHTML = beltIndexOptionsHtml(programSel.value, 0);
    });
  }
}
function sanitizeStudentData(data) {
  return { ...data, guardianId: data.guardianId || null, beltIndex: data.beltIndex !== undefined ? Number(data.beltIndex) : undefined };
}

document.getElementById("btnNewStudent").addEventListener("click", () => {
  const modal = openFormModal({
    title: "Nuevo alumno",
    bodyHtml: studentFormFields(null),
    submitLabel: "Crear alumno",
    onSubmit: (data) => {
      if (!data.name.trim() || !data.email.trim()) { toast("Nombre y email son obligatorios", "error"); return false; }
      const s = createStudent(sanitizeStudentData(data));
      toast(`Alumno "${s.name}" creado`);
      renderStudentsTable();
    },
  });
  wireStudentFormExtras(modal.form);
});

/* ---------- Modal de alumno ---------- */
function openStudentModal(id) {
  const s = studentById(id);
  if (!s) return;
  const rank = currentRank(s);
  const pct = rank.examClasses ? Math.min(100, Math.round((s.classesSincePromotion / rank.examClasses) * 100)) : 100;
  const eligible = examEligible(s);
  const history = PAYMENTS.filter((p) => p.studentId === id).sort((a, b) => b.date.localeCompare(a.date));
  const guardian = s.guardianId ? guardianById(s.guardianId) : null;
  const plan = planByName(s.plan);

  const lifecycleActions = [];
  if (s.status === "Activo") lifecycleActions.push(`<button type="button" class="chip-btn" id="actFreeze">${ICONS.pause} Congelar</button>`);
  if (s.status === "Congelado" || s.status === "Inactivo") lifecycleActions.push(`<button type="button" class="chip-btn" id="actReactivate">${ICONS.refresh} Reactivar</button>`);
  if (s.status !== "Inactivo") lifecycleActions.push(`<button type="button" class="chip-btn" id="actDeactivate" style="color:var(--status-critical)">${ICONS.ban} Dar de baja</button>`);

  document.getElementById("studentModal").innerHTML = `
    <div class="modal-header">
      <div class="modal-student-id">
        ${avatarHtml(s, 52)}
        <div>
          <div class="name">${s.name}</div>
          <div class="sub">${programName(s.program)} · ${rank.name}</div>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${statusBadge(s)} ${paymentBadge(s.paymentStatus)} ${eligible ? `<span class="badge badge-good">${ICONS.star} Elegible para examen</span>` : ""}</div>
        </div>
      </div>
      <button class="modal-close" id="modalCloseBtn">${X_ICON}</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">
        <button type="button" class="chip-btn" id="actPay">${ICONS.money} Registrar pago</button>
        <button type="button" class="chip-btn" id="actPromote">${ICONS.belt} Promover grado</button>
        ${lifecycleActions.join("")}
        <button type="button" class="chip-btn" id="actEdit">${ICONS.edit} Editar</button>
        <button type="button" class="chip-btn" id="actDelete" style="color:var(--status-critical)">${ICONS.trash} Eliminar</button>
      </div>

      <div class="modal-grid">
        <div class="modal-stat"><div class="label">Plan</div><div class="value">${s.plan}</div></div>
        <div class="modal-stat"><div class="label">${plan.type === "paquete" ? "Créditos restantes" : "Próximo pago"}</div><div class="value">${plan.type === "paquete" ? (s.classCredits || 0) : s.nextPayment}</div></div>
        <div class="modal-stat"><div class="label">DNI</div><div class="value">${s.dni || "—"}</div></div>
        <div class="modal-stat"><div class="label">Miembro desde</div><div class="value">${s.joined}</div></div>
      </div>

      ${s.status === "Congelado" ? `<div class="receipt-disclaimer">${ICONS.pause} Congelado: ${s.freezeReason || "—"} hasta ${s.freezeUntil || "—"}</div>` : ""}
      ${s.status === "Inactivo" ? `<div class="receipt-disclaimer">${ICONS.ban} Baja: ${s.inactiveReason || "—"} (${s.inactiveDate || "—"})</div>` : ""}

      <div class="modal-section-title">Progreso de grado</div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${rank.hex}"></div></div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px">
        ${rank.examClasses ? `${s.classesSincePromotion}/${rank.examClasses} clases para el próximo examen` : "Nivel máximo alcanzado"}
        — ${rank.index + 1} de ${rank.scaleLength} niveles
      </div>

      <div class="modal-section-title">Historial de graduaciones</div>
      ${s.examHistory.length ? `<div class="table-wrap" style="border:none"><table class="data-table"><thead><tr><th>Fecha</th><th>Evaluador</th><th>Ascenso</th></tr></thead><tbody>
        ${s.examHistory.slice().reverse().map((h) => {
          const scale = beltScaleFor(s.program);
          return `<tr><td>${h.date}</td><td>${h.evaluator}</td><td>${(scale[h.fromIndex] || {}).name || "—"} → ${(scale[h.toIndex] || {}).name || "—"}</td></tr>`;
        }).join("")}
      </tbody></table></div>` : `<div style="color:var(--text-muted);font-size:11.5px">Sin graduaciones registradas aún.</div>`}

      ${guardian ? `<div class="modal-section-title">Apoderado</div><div class="instructor-contact"><span>${ICONS.family.replace("<svg", '<svg style="width:14px;height:14px"')} ${guardian.name} · ${guardian.phone || guardian.email || "sin contacto"}</span></div>` : ""}

      <div class="modal-section-title">Ficha médica</div>
      <div style="font-size:11.5px;color:var(--text-secondary)">${s.medicalNotes ? s.medicalNotes : "Sin observaciones registradas."}</div>

      <div class="modal-section-title">Contacto</div>
      <div class="instructor-contact">
        <span style="display:flex;align-items:center;gap:8px"><span style="width:14px;height:14px">${ICONS.mail}</span>${s.email}</span>
        <span style="display:flex;align-items:center;gap:8px"><span style="width:14px;height:14px">${ICONS.phone}</span>${s.phone}</span>
        ${s.emergencyContactName ? `<span style="display:flex;align-items:center;gap:8px">${ICONS.alert.replace("<svg", '<svg style="width:14px;height:14px;color:var(--status-critical)"')} Emergencia: ${s.emergencyContactName} · ${s.emergencyContactPhone || "—"}</span>` : ""}
      </div>

      <div class="modal-section-title">Historial de pagos</div>
      <div class="table-wrap" style="border:none">
        <table class="data-table">
          <thead><tr><th>Fecha</th><th>Monto</th><th>Método</th><th>Estado</th></tr></thead>
          <tbody>
            ${history.length ? history.map((p) => `<tr><td>${p.date}</td><td class="tnum">${fmtMoney(p.amount)}</td><td>${p.method}</td><td>${paymentBadge(p.status)}</td></tr>`).join("") : `<tr><td colspan="4" style="color:var(--text-muted)">Sin pagos registrados.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById("studentModalBackdrop").classList.add("open");
  document.getElementById("modalCloseBtn").addEventListener("click", closeStudentModal);

  document.getElementById("actPay").addEventListener("click", () => openPaymentForm(s.id));
  document.getElementById("actPromote").addEventListener("click", () => {
    if (s.beltIndex >= beltScaleFor(s.program).length - 1) { toast("Ya tiene el nivel más alto", "error"); return; }
    const nextRank = beltScaleFor(s.program)[s.beltIndex + 1];
    openFormModal({
      title: `Promover a ${nextRank.name}`, width: 380,
      bodyHtml: `
        <div class="form-row"><label>Evaluador</label><input type="text" name="evaluator" required placeholder="Nombre del instructor" /></div>
        <div class="form-row"><label>Fecha del examen</label><input type="date" name="date" value="${todayISO()}" /></div>`,
      submitLabel: "Promover",
      onSubmit: (data) => {
        const res = promoteBelt(s.id, data);
        if (res.ok) { toast(`${s.name} promovido a ${res.rank.name}`); openStudentModal(s.id); renderStudentsTable(); }
      },
    });
  });
  const freezeBtn = document.getElementById("actFreeze");
  if (freezeBtn) freezeBtn.addEventListener("click", () => {
    openFormModal({
      title: "Congelar membresía", width: 380,
      bodyHtml: `
        <div class="form-row"><label>Motivo</label><input type="text" name="reason" value="Vacaciones" /></div>
        <div class="form-row"><label>Congelado hasta</label><input type="date" name="until" value="${addDaysISO(15)}" /></div>`,
      submitLabel: "Congelar",
      onSubmit: (data) => { freezeStudent(s.id, data); toast("Membresía congelada"); openStudentModal(s.id); renderStudentsTable(); },
    });
  });
  const reactivateBtn = document.getElementById("actReactivate");
  if (reactivateBtn) reactivateBtn.addEventListener("click", async () => {
    const ok = await confirmDialog(`¿Reactivar a <strong>${s.name}</strong>?`, { confirmLabel: "Reactivar" });
    if (!ok) return;
    reactivateStudent(s.id);
    toast("Alumno reactivado");
    openStudentModal(s.id);
    renderStudentsTable();
  });
  const deactivateBtn = document.getElementById("actDeactivate");
  if (deactivateBtn) deactivateBtn.addEventListener("click", () => {
    openFormModal({
      title: "Dar de baja", width: 380,
      bodyHtml: `<div class="form-row"><label>Motivo de baja</label><select name="reason">${optionsHtml(INACTIVE_REASONS, (r) => r, (r) => r)}</select></div>`,
      submitLabel: "Dar de baja",
      onSubmit: (data) => { deactivateStudent(s.id, data); toast("Alumno dado de baja"); closeStudentModal(); renderStudentsTable(); },
    });
  });
  document.getElementById("actEdit").addEventListener("click", () => {
    const modal = openFormModal({
      title: "Editar alumno",
      bodyHtml: studentFormFields(s),
      submitLabel: "Guardar cambios",
      onSubmit: (data) => {
        if (!data.name.trim() || !data.email.trim()) { toast("Nombre y email son obligatorios", "error"); return false; }
        updateStudent(s.id, sanitizeStudentData(data));
        toast("Alumno actualizado");
        openStudentModal(s.id);
        renderStudentsTable();
      },
    });
    wireStudentFormExtras(modal.form);
  });
  document.getElementById("actDelete").addEventListener("click", async () => {
    const ok = await confirmDialog(`Esta acción eliminará a <strong>${s.name}</strong> y no se puede deshacer.`, { title: "Eliminar alumno", confirmLabel: "Eliminar", danger: true });
    if (!ok) return;
    deleteStudent(s.id);
    toast(`Alumno "${s.name}" eliminado`);
    closeStudentModal();
    renderStudentsTable();
  });
}
function closeStudentModal() {
  document.getElementById("studentModalBackdrop").classList.remove("open");
}
document.getElementById("studentModalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "studentModalBackdrop") closeStudentModal();
});

/* ============================================================
   APODERADOS
   ============================================================ */
function guardianFormFields(g) {
  return `
    <div class="form-row"><label>Nombre completo</label><input type="text" name="name" required value="${g ? g.name : ""}" /></div>
    <div class="modal-grid" style="margin-bottom:0">
      <div class="form-row"><label>DNI</label><input type="text" name="dni" maxlength="8" value="${g ? g.dni : ""}" /></div>
      <div class="form-row"><label>Teléfono</label><input type="text" name="phone" value="${g ? g.phone : "+51 "}" /></div>
      <div class="form-row" style="grid-column:1 / -1"><label>Email</label><input type="email" name="email" value="${g ? g.email : ""}" /></div>
    </div>`;
}
document.getElementById("btnNewGuardian").addEventListener("click", () => {
  openFormModal({
    title: "Nuevo apoderado", bodyHtml: guardianFormFields(null), submitLabel: "Crear apoderado",
    onSubmit: (data) => {
      if (!data.name.trim()) { toast("El nombre es obligatorio", "error"); return false; }
      createGuardian(data);
      toast("Apoderado creado");
      renderGuardians();
    },
  });
});
function renderGuardians() {
  document.getElementById("guardiansTableBody").innerHTML = GUARDIANS.length ? GUARDIANS.map((g) => {
    const kids = STUDENTS.filter((s) => s.guardianId === g.id);
    return `<tr data-guardian="${g.id}">
      <td><div class="row-person">${avatarHtml({ name: g.name, initials: g.name.slice(0, 2).toUpperCase() })}<div class="name">${g.name}</div></div></td>
      <td class="tnum">${g.dni || "—"}</td>
      <td>${g.phone || "—"}<br><span style="color:var(--text-muted);font-size:11px">${g.email || ""}</span></td>
      <td><div class="chip-list">${kids.length ? kids.map((k) => `<span class="tag">${k.name}</span>`).join("") : '<span style="color:var(--text-muted)">Sin hijos vinculados</span>'}</div></td>
      <td><div class="card-top-actions">
        <button type="button" class="icon-mini-btn" data-act="edit" title="Editar">${ICONS.edit}</button>
        <button type="button" class="icon-mini-btn danger" data-act="delete" title="Eliminar">${ICONS.trash}</button>
      </div></td>
    </tr>`;
  }).join("") : `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:28px">Aún no hay apoderados registrados.</td></tr>`;

  document.querySelectorAll('#guardiansTableBody [data-act="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = guardianById(btn.closest("tr").dataset.guardian);
      openFormModal({
        title: "Editar apoderado", bodyHtml: guardianFormFields(g), submitLabel: "Guardar cambios",
        onSubmit: (data) => { updateGuardian(g.id, data); toast("Apoderado actualizado"); renderGuardians(); },
      });
    });
  });
  document.querySelectorAll('#guardiansTableBody [data-act="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const g = guardianById(btn.closest("tr").dataset.guardian);
      const ok = await confirmDialog(`¿Eliminar al apoderado <strong>${g.name}</strong>? Los hijos vinculados quedarán sin apoderado.`, { title: "Eliminar apoderado", confirmLabel: "Eliminar", danger: true });
      if (!ok) return;
      deleteGuardian(g.id);
      toast("Apoderado eliminado");
      renderGuardians();
    });
  });
}

/* ============================================================
   CLASES / HORARIO
   ============================================================ */
const CLASS_CATEGORIES = ["Niños", "Adultos", "Avanzados", "Competencia"];
function classFormFields(c) {
  const [start, end] = c ? c.time.split("–") : ["18:00", "19:00"];
  return `
    <div class="modal-grid" style="margin-bottom:0">
      <div class="form-row"><label>Disciplina</label><select name="program">${optionsHtml(PROGRAMS, (p) => p.id, (p) => p.name, c ? c.program : PROGRAMS[0].id)}</select></div>
      <div class="form-row"><label>Instructor</label><select name="instructor">${optionsHtml(INSTRUCTORS, (i) => i.id, (i) => i.name, c ? c.instructor : INSTRUCTORS[0]?.id)}</select></div>
      <div class="form-row"><label>Categoría</label><select name="category">${optionsHtml(CLASS_CATEGORIES, (v) => v, (v) => v, c ? c.category : "Adultos")}</select></div>
      <div class="form-row"><label>Día</label><select name="day">${optionsHtml(DAYS, (d) => d, (d) => d, c ? c.day : "Lun")}</select></div>
      <div class="form-row"><label>Sala</label><input type="text" name="room" value="${c ? c.room : "Tatami 1"}" /></div>
      <div class="form-row"><label>Hora inicio</label><input type="time" name="start" value="${start}" /></div>
      <div class="form-row"><label>Hora fin</label><input type="time" name="end" value="${end}" /></div>
      <div class="form-row"><label>Aforo (capacidad)</label><input type="number" name="capacity" min="1" value="${c ? c.capacity : 20}" /></div>
    </div>`;
}
function classFormToData(data) {
  return { program: data.program, instructor: data.instructor, day: data.day, room: data.room, category: data.category, capacity: data.capacity, time: `${data.start}–${data.end}` };
}

document.getElementById("btnNewClass").addEventListener("click", () => {
  if (!INSTRUCTORS.length) { toast("Crea primero un instructor", "error"); return; }
  openFormModal({
    title: "Nueva clase",
    bodyHtml: classFormFields(null),
    submitLabel: "Crear clase",
    onSubmit: (data) => {
      const c = createClass(classFormToData(data));
      toast(`Clase de ${programName(c.program)} creada`);
      renderSchedule();
    },
  });
});

function renderSchedule() {
  const grid = document.getElementById("scheduleGrid");
  grid.innerHTML = DAYS.map((day) => {
    const dayClasses = CLASSES.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
    return `<div class="schedule-day">
      <h4>${day}${day === todayAbbr() ? " · hoy" : ""}</h4>
      ${dayClasses.map((c) => {
        const inst = instructorById(c.instructor);
        const pct = c.capacity ? Math.round((c.enrolled / c.capacity) * 100) : 0;
        const color = programColor(c.program);
        const over = c.enrolled > c.capacity;
        return `<div class="class-card" style="--card-accent:${color}" data-class="${c.id}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div class="time">${c.time}</div>
            <div class="card-top-actions">
              <button type="button" class="icon-mini-btn" data-act="edit" title="Editar">${ICONS.edit}</button>
              <button type="button" class="icon-mini-btn danger" data-act="delete" title="Eliminar">${ICONS.trash}</button>
            </div>
          </div>
          <div class="program">${programName(c.program)} <span class="tag" style="margin-left:4px">${c.category || "Adultos"}</span></div>
          <div class="meta">${inst ? inst.title + " " + inst.name : "Sin instructor"} · ${c.room}</div>
          <div class="capacity-track"><div class="capacity-fill" style="width:${Math.min(pct, 100)}%;${over ? "background:var(--status-critical)" : ""}"></div></div>
          <div class="capacity-text" style="${over ? "color:var(--status-critical);font-weight:700" : ""}">${c.enrolled}/${c.capacity} inscritos${over ? " — ¡aforo excedido!" : ""}</div>
        </div>`;
      }).join("") || `<div style="font-size:11px;color:var(--text-muted);padding:10px 0">Sin clases</div>`}
    </div>`;
  }).join("");

  grid.querySelectorAll('.icon-mini-btn[data-act="edit"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const c = classById(btn.closest(".class-card").dataset.class);
      openFormModal({
        title: "Editar clase", bodyHtml: classFormFields(c), submitLabel: "Guardar cambios",
        onSubmit: (data) => { updateClass(c.id, classFormToData(data)); toast("Clase actualizada"); renderSchedule(); },
      });
    });
  });
  grid.querySelectorAll('.icon-mini-btn[data-act="delete"]').forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const c = classById(btn.closest(".class-card").dataset.class);
      const ok = await confirmDialog(`¿Eliminar la clase de <strong>${programName(c.program)}</strong> del ${c.day} ${c.time}?`, { title: "Eliminar clase", confirmLabel: "Eliminar", danger: true });
      if (!ok) return;
      deleteClass(c.id);
      toast("Clase eliminada");
      renderSchedule();
    });
  });
}

/* ============================================================
   ASISTENCIA — check-in real por alumno
   ============================================================ */
function renderAttendanceView() {
  renderBarChart(document.getElementById("attendanceChart2"), ATTENDANCE_WEEKLY, {
    seriesVar: "--series-2", valueFmt: (v) => v + " asistencias", cardActions: document.getElementById("attendance2Actions"),
  });

  const dateKey = todayISO();
  const todayClasses = CLASSES.filter((c) => c.day === todayAbbr()).sort((a, b) => a.time.localeCompare(b.time));
  const list = document.getElementById("checkinList");

  if (!todayClasses.length) {
    list.innerHTML = `<div style="color:var(--text-muted);font-size:12px">No hay clases programadas hoy.</div>`;
    return;
  }

  list.innerHTML = todayClasses.map((c) => {
    const inst = instructorById(c.instructor);
    const present = getCheckinList(dateKey, c.id);
    const notInRoster = STUDENTS.filter((s) => !c.roster.includes(s.id) && s.status === "Activo");
    return `<div class="checkin-card" data-class="${c.id}">
      <div class="checkin-card-head">
        <div>
          <div class="program">${programName(c.program)}</div>
          <div class="meta">${inst ? inst.name : "—"} · ${c.time}</div>
        </div>
        <div class="checkin-count">${present.length}/${c.roster.length}</div>
      </div>
      <div class="checkin-list">
        ${c.roster.length ? c.roster.map((sid) => {
          const st = studentById(sid);
          if (!st) return "";
          const isPresent = present.includes(sid);
          return `<label class="checkin-row ${isPresent ? "present" : ""}">
            <input type="checkbox" data-student="${sid}" ${isPresent ? "checked" : ""} />
            ${st.name}
          </label>`;
        }).join("") : `<div style="color:var(--text-muted);font-size:11.5px;padding:6px 0">Sin alumnos asignados a esta clase.</div>`}
      </div>
      ${notInRoster.length ? `<select class="select-input" data-addstudent="${c.id}" style="width:100%;font-size:11px;margin-top:10px">
        <option value="">+ Agregar alumno (walk-in)…</option>
        ${optionsHtml(notInRoster, (s) => s.id, (s) => `${s.name} · ${programName(s.program)}`, "")}
      </select>` : ""}
    </div>`;
  }).join("");

  list.querySelectorAll('input[type="checkbox"][data-student]').forEach((cb) => {
    cb.addEventListener("change", () => {
      const classId = cb.closest(".checkin-card").dataset.class;
      toggleCheckin(dateKey, classId, cb.dataset.student);
      renderAttendanceView();
    });
  });
  list.querySelectorAll("[data-addstudent]").forEach((sel) => {
    sel.addEventListener("change", () => {
      if (!sel.value) return;
      addStudentToRoster(sel.dataset.addstudent, sel.value);
      toast("Alumno agregado a la clase de hoy");
      renderAttendanceView();
    });
  });
}

/* ============================================================
   INSTRUCTORES
   ============================================================ */
function instructorFormFields(i) {
  return `
    <div class="form-row"><label>Nombre completo</label><input type="text" name="name" required value="${i ? i.name : ""}" /></div>
    <div class="modal-grid" style="margin-bottom:0">
      <div class="form-row"><label>Título</label><select name="title">${optionsHtml(["Sensei", "Profesor", "Profesora", "Coach"], (v) => v, (v) => v, i ? i.title : "Coach")}</select></div>
      <div class="form-row"><label>Disciplina</label><select name="program">${optionsHtml(PROGRAMS, (p) => p.id, (p) => p.name, i ? i.program : PROGRAMS[0].id)}</select></div>
      <div class="form-row"><label>Rango / certificación</label><input type="text" name="rank" value="${i ? i.rank : ""}" /></div>
      <div class="form-row"><label>Años enseñando</label><input type="number" name="years" min="0" value="${i ? i.years : 1}" /></div>
      <div class="form-row"><label>Tarifa por hora (S/)</label><input type="number" name="hourlyRate" min="0" value="${i ? i.hourlyRate : 25}" /></div>
      <div class="form-row"><label>Teléfono</label><input type="text" name="phone" value="${i ? i.phone : "+51 "}" /></div>
      <div class="form-row"><label>Email</label><input type="email" name="email" value="${i ? i.email : ""}" /></div>
    </div>`;
}

document.getElementById("btnNewInstructor").addEventListener("click", () => {
  openFormModal({
    title: "Nuevo instructor", bodyHtml: instructorFormFields(null), submitLabel: "Crear instructor",
    onSubmit: (data) => {
      if (!data.name.trim()) { toast("El nombre es obligatorio", "error"); return false; }
      const i = createInstructor(data);
      toast(`Instructor "${i.name}" creado`);
      renderInstructors();
    },
  });
});

function renderInstructors() {
  document.getElementById("instructorGrid").innerHTML = INSTRUCTORS.map((i) => {
    const classCount = CLASSES.filter((c) => c.instructor === i.id).length;
    const hours = CLASSES.filter((c) => c.instructor === i.id).reduce((s, c) => s + classDurationHours(c.time), 0);
    const pay = hours * (i.hourlyRate || 0);
    const color = programColor(i.program);
    return `<div class="card instructor-card" data-instructor="${i.id}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="instructor-top">
          <div class="avatar" style="background:${color}">${i.initials}</div>
          <div>
            <div class="title">${i.title}</div>
            <div class="name">${i.name}</div>
          </div>
        </div>
        <div class="card-top-actions">
          <button type="button" class="icon-mini-btn" data-act="edit" title="Editar">${ICONS.edit}</button>
          <button type="button" class="icon-mini-btn danger" data-act="delete" title="Eliminar">${ICONS.trash}</button>
        </div>
      </div>
      <div class="instructor-tags">
        <span class="tag">${programName(i.program)}</span>
        <span class="tag">${i.rank}</span>
      </div>
      <div class="instructor-stats">
        <div class="stat"><b>${i.years}</b><span>Años enseñando</span></div>
        <div class="stat"><b>${classCount}</b><span>Clases/semana</span></div>
        <div class="stat"><b>${hours}h</b><span>Horas/semana</span></div>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-muted)">Pago estimado semanal: <strong style="color:var(--text-primary)">${fmtMoney(pay)}</strong></div>
      <div class="instructor-contact">
        <span style="display:flex;align-items:center;gap:8px"><span style="width:14px;height:14px">${ICONS.mail}</span>${i.email || "—"}</span>
        <span style="display:flex;align-items:center;gap:8px"><span style="width:14px;height:14px">${ICONS.phone}</span>${i.phone || "—"}</span>
      </div>
    </div>`;
  }).join("") || `<div style="color:var(--text-muted)">Aún no hay instructores. Crea el primero.</div>`;

  document.querySelectorAll('.instructor-card [data-act="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = instructorById(btn.closest(".instructor-card").dataset.instructor);
      openFormModal({
        title: "Editar instructor", bodyHtml: instructorFormFields(i), submitLabel: "Guardar cambios",
        onSubmit: (data) => { updateInstructor(i.id, data); toast("Instructor actualizado"); renderInstructors(); },
      });
    });
  });
  document.querySelectorAll('.instructor-card [data-act="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const i = instructorById(btn.closest(".instructor-card").dataset.instructor);
      const ok = await confirmDialog(`¿Eliminar al instructor <strong>${i.name}</strong>?`, { title: "Eliminar instructor", confirmLabel: "Eliminar", danger: true });
      if (!ok) return;
      const res = deleteInstructor(i.id);
      if (!res.ok) { toast(res.reason || "No se pudo eliminar", "error"); return; }
      toast("Instructor eliminado");
      renderInstructors();
    });
  });
}

/* ============================================================
   PAGOS
   ============================================================ */
const PAYMENT_METHODS = ["Tarjeta (POS)", "Efectivo", "Transferencia", "Yape/Plin"];
const PAYMENT_METHOD_COLORS = { "Tarjeta (POS)": "var(--series-1)", "Efectivo": "var(--series-3)", "Transferencia": "var(--series-7)", "Yape/Plin": "var(--series-2)" };

function renderPaymentsKpis() {
  const paid = PAYMENTS.filter((p) => p.status === "al_dia");
  const unpaid = PAYMENTS.filter((p) => p.status !== "al_dia");
  const paidTotal = paid.reduce((s, p) => s + p.amount, 0);
  const unpaidTotal = unpaid.reduce((s, p) => s + p.amount, 0);
  const onTimePct = PAYMENTS.length ? Math.round((paid.length / PAYMENTS.length) * 100) : 0;
  const kpis = [
    { label: "Cobrado este mes", value: fmtMoney(paidTotal), delta: `${paid.length} pagos registrados`, neutral: true },
    { label: "Por cobrar", value: fmtMoney(unpaidTotal), delta: `${unpaid.length} alumnos pendientes`, up: false },
    { label: "Alumnos al día", value: onTimePct + "%", delta: "del total de membresías", neutral: true },
  ];
  document.getElementById("paymentsKpiGrid").innerHTML = kpis.map((k) => `
    <div class="kpi-tile">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-delta ${k.neutral ? "" : k.up ? "up" : "down"}">${k.delta}</div>
    </div>`).join("");
}

function filteredPayments() {
  const search = document.getElementById("paymentSearch").value.trim().toLowerCase();
  const status = document.getElementById("filterPaymentStatus2").value;
  return PAYMENTS.filter((p) => (!search || p.student.toLowerCase().includes(search)) && (!status || p.status === status))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function showReceiptPreview(p) {
  const student = studentById(p.studentId);
  const isFactura = p.receiptType === "factura";
  openInfoModal({
    title: isFactura ? "Factura electrónica" : "Boleta de venta electrónica",
    width: 440,
    bodyHtml: `
      <div class="receipt-disclaimer">${ICONS.alert} Documento simulado — no es un comprobante válido ante SUNAT.</div>
      <div class="receipt-doc">
        <div class="receipt-head">
          <div><strong>${ACADEMY.name}</strong><br><span style="color:var(--text-muted)">RUC ${ACADEMY.ruc || "—"}</span><br><span style="color:var(--text-muted)">${ACADEMY.address}</span></div>
          <div class="receipt-num">${isFactura ? "FACTURA" : "BOLETA"}<br>${p.receiptNumber}</div>
        </div>
        <div class="receipt-row"><span>Cliente</span><span>${p.student}</span></div>
        <div class="receipt-row"><span>DNI</span><span>${student ? student.dni : "—"}</span></div>
        <div class="receipt-row"><span>Fecha de emisión</span><span>${p.date}</span></div>
        <div class="receipt-row"><span>Concepto</span><span>Membresía — ${p.plan}</span></div>
        <div class="receipt-row"><span>Método de pago</span><span>${p.method}</span></div>
        <div class="receipt-total"><span>Total</span><span>${fmtMoney(p.amount)}</span></div>
      </div>`,
    footerHtml: `<button type="button" class="btn btn-ghost" onclick="window.print()">Imprimir</button>`,
  });
}
function openIssueReceiptForm(paymentId) {
  openFormModal({
    title: "Emitir comprobante", width: 360,
    bodyHtml: `
      <div class="form-row"><label>Tipo de comprobante</label><select name="type"><option value="boleta">Boleta electrónica</option><option value="factura">Factura electrónica</option></select></div>
      <div class="receipt-disclaimer">${ICONS.alert} Se generará solo una vista previa simulada, sin validez SUNAT.</div>`,
    submitLabel: "Emitir",
    onSubmit: (data) => {
      const p = issueReceipt(paymentId, data.type);
      toast("Comprobante simulado emitido");
      renderPaymentsTable();
      showReceiptPreview(p);
    },
  });
}

function renderPaymentsTable() {
  const filtered = filteredPayments();
  const { items, page, totalPages, total } = paginate(filtered, paymentsPage, PAYMENTS_PAGE_SIZE);
  paymentsPage = page;

  document.getElementById("paymentsTableBody").innerHTML = items.length ? items.map((p) => `
    <tr>
      <td>${p.student}</td>
      <td>${p.plan}</td>
      <td class="tnum">${fmtMoney(p.amount)}</td>
      <td>${p.method}${p.operationRef ? `<br><span style="color:var(--text-muted);font-size:10.5px">Op. ${p.operationRef}</span>` : ""}</td>
      <td>${p.date}</td>
      <td>${paymentBadge(p.status)}</td>
      <td>${p.receiptNumber
        ? `<button type="button" class="chip-btn" data-view-receipt="${p.id}">${ICONS.receipt} ${p.receiptNumber}</button>`
        : (p.status === "al_dia" ? `<button type="button" class="chip-btn" data-issue="${p.id}">Emitir</button>` : "—")}</td>
      <td>${p.status !== "al_dia" ? `<button type="button" class="chip-btn" data-pay="${p.id}">Marcar pagado</button>` : ""}</td>
    </tr>`).join("") : `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:28px">No se encontraron pagos.</td></tr>`;

  renderPaginationControls(document.getElementById("paymentsPagination"), {
    page, totalPages, total, pageSize: PAYMENTS_PAGE_SIZE,
    onChange: (pg) => { paymentsPage = pg; renderPaymentsTable(); },
  });

  document.querySelectorAll("[data-pay]").forEach((btn) => {
    btn.addEventListener("click", () => {
      markPaymentPaid(btn.dataset.pay);
      toast("Pago marcado como realizado");
      renderPaymentsTable();
      renderPaymentsKpis();
    });
  });
  document.querySelectorAll("[data-issue]").forEach((btn) => {
    btn.addEventListener("click", () => openIssueReceiptForm(btn.dataset.issue));
  });
  document.querySelectorAll("[data-view-receipt]").forEach((btn) => {
    btn.addEventListener("click", () => showReceiptPreview(PAYMENTS.find((p) => p.id === btn.dataset.viewReceipt)));
  });
}
["paymentSearch", "filterPaymentStatus2"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => { paymentsPage = 1; renderPaymentsTable(); });
  document.getElementById(id).addEventListener("change", () => { paymentsPage = 1; renderPaymentsTable(); });
});

document.getElementById("btnExportPayments").addEventListener("click", () => {
  const rows = filteredPayments().map((p) => [p.student, p.plan, p.amount, p.method, p.operationRef, p.date, p.status, p.receiptNumber || ""]);
  exportCSV("pagos.csv", ["Alumno", "Plan", "Monto", "Método", "N° operación", "Fecha", "Estado", "Comprobante"], rows);
});

function openPaymentForm(preselectStudentId) {
  if (!STUDENTS.length) { toast("Crea primero un alumno", "error"); return; }
  const plans = assignablePlans(null);
  if (!plans.length) { toast("No hay planes activos. Crea uno en Planes y Grados", "error"); return; }
  const defaultPlan = plans[0];
  const bodyHtml = `
    <div class="modal-grid" style="margin-bottom:0">
      <div class="form-row" style="grid-column:1 / -1"><label>Alumno</label>
        <select name="studentId">${optionsHtml(STUDENTS, (s) => s.id, (s) => `${s.name} — ${programName(s.program)}`, preselectStudentId)}</select>
      </div>
      <div class="form-row"><label>Plan</label><select name="plan" id="payPlanSelect">${optionsHtml(plans, (p) => p.name, (p) => `${p.name}${p.type === "paquete" ? ` (${p.credits} clases)` : ""}`)}</select></div>
      <div class="form-row"><label>Monto (S/)</label><input type="number" name="amount" id="payAmountInput" min="0" step="0.01" value="${defaultPlan.price}" /></div>
      <div class="form-row"><label>Método</label><select name="method" id="payMethodSelect">${optionsHtml(PAYMENT_METHODS, (v) => v, (v) => v)}</select></div>
      <div class="form-row" id="payOperationRefRow" style="display:none"><label>N° de operación</label><input type="text" name="operationRef" placeholder="Ej. 000123456" /></div>
      <div class="form-row"><label>Fecha</label><input type="date" name="date" value="${todayISO()}" /></div>
      <div class="form-row"><label>Estado</label><select name="status">${optionsHtml([["al_dia", "Pagado"], ["pendiente", "Pendiente"], ["vencido", "Vencido"]], (v) => v[0], (v) => v[1])}</select></div>
    </div>`;
  const modal = openFormModal({
    title: "Registrar pago", bodyHtml, submitLabel: "Registrar",
    onSubmit: (data) => {
      const isPOS = data.method === "Tarjeta (POS)";
      const p = registerPayment(data);
      renderPaymentsKpis(); renderPaymentsTable();
      if (document.getElementById("studentModalBackdrop").classList.contains("open")) openStudentModal(data.studentId);
      if (isPOS) {
        toast("Simulando cobro con POS Niubiz…");
        setTimeout(() => toast(`Pago de ${fmtMoney(p.amount)} registrado para ${p.student}`), 700);
      } else {
        toast(`Pago de ${fmtMoney(p.amount)} registrado para ${p.student}`);
      }
    },
  });
  const planSel = modal.form.querySelector("#payPlanSelect");
  const amountInput = modal.form.querySelector("#payAmountInput");
  const methodSel = modal.form.querySelector("#payMethodSelect");
  const refRow = modal.form.querySelector("#payOperationRefRow");
  planSel.addEventListener("change", () => { amountInput.value = planByName(planSel.value).price; });
  function syncRefRow() { refRow.style.display = (methodSel.value === "Yape/Plin" || methodSel.value === "Transferencia") ? "" : "none"; }
  methodSel.addEventListener("change", syncRefRow);
  syncRefRow();
}
document.getElementById("btnNewPayment").addEventListener("click", () => openPaymentForm());

/* ============================================================
   CAJA
   ============================================================ */
function renderCaja() {
  const content = document.getElementById("cajaContent");
  const shift = currentOpenShift();

  if (!shift) {
    const recentClosed = CASH_SHIFTS.filter((s) => s.status === "closed").slice(-8).reverse();
    content.innerHTML = `
      <div class="card" style="max-width:420px;margin-bottom:16px">
        <div class="card-header"><h3>Abrir turno de caja</h3></div>
        <div class="card-body">
          <form id="openShiftForm">
            <div class="form-row"><label>Abierto por</label><input type="text" name="openedBy" required placeholder="Nombre del recepcionista" /></div>
            <div class="form-row"><label>Monto de apertura (S/)</label><input type="number" name="openingAmount" min="0" step="0.01" value="0" required /></div>
            <button type="submit" class="btn btn-primary">Abrir turno</button>
          </form>
        </div>
      </div>
      ${recentClosed.length ? `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <h3>Ingresos por turno (histórico)</h3>
          <div class="card-actions" id="shiftHistoryActions"></div>
        </div>
        <div class="card-body" id="shiftHistoryChart"></div>
      </div>
      <div class="card"><div class="card-header"><h3>Turnos recientes</h3></div><div class="card-body">
        <div class="table-wrap" style="border:none"><table class="data-table"><thead><tr><th>Abierto por</th><th>Apertura</th><th>Cierre</th><th>Diferencia</th></tr></thead><tbody>
          ${recentClosed.map((s) => {
            const diff = s.closingAmount - s.openingAmount;
            return `<tr><td>${s.openedBy}</td><td class="tnum">${fmtMoney(s.openingAmount)}</td><td class="tnum">${fmtMoney(s.closingAmount)}</td><td class="tnum">${fmtMoney(diff)}</td></tr>`;
          }).join("")}
        </tbody></table></div>
      </div></div>` : ""}`;
    document.getElementById("openShiftForm").addEventListener("submit", (e) => {
      e.preventDefault();
      openShift(Object.fromEntries(new FormData(e.target)));
      toast("Turno de caja abierto");
      renderCaja();
    });
    if (recentClosed.length) {
      const chartData = recentClosed.slice().reverse().map((s) => ({
        label: s.openedAt.slice(5, 10), value: paymentsDuringShift(s).reduce((sum, p) => sum + p.amount, 0),
      }));
      renderBarChart(document.getElementById("shiftHistoryChart"), chartData, {
        seriesVar: "--series-1", valueFmt: fmtMoney, cardActions: document.getElementById("shiftHistoryActions"),
      });
    }
    return;
  }

  const pays = paymentsDuringShift(shift);
  const byMethod = {};
  pays.forEach((p) => { byMethod[p.method] = (byMethod[p.method] || 0) + p.amount; });
  const cashTotal = byMethod["Efectivo"] || 0;
  const expectedCash = shift.openingAmount + cashTotal;

  content.innerHTML = `
    <div class="shift-summary-grid">
      <div class="kpi-tile"><div class="kpi-label">Apertura</div><div class="kpi-value">${fmtMoney(shift.openingAmount)}</div><div class="kpi-delta">por ${shift.openedBy}</div></div>
      <div class="kpi-tile"><div class="kpi-label">Ingresos del turno</div><div class="kpi-value">${fmtMoney(pays.reduce((s, p) => s + p.amount, 0))}</div><div class="kpi-delta">${pays.length} pagos</div></div>
      <div class="kpi-tile"><div class="kpi-label">Efectivo esperado</div><div class="kpi-value">${fmtMoney(expectedCash)}</div></div>
      <div class="kpi-tile"><div class="kpi-label">Abierto desde</div><div class="kpi-value" style="font-size:13px">${new Date(shift.openedAt).toLocaleString("es-PE")}</div></div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <h3>Desglose por método de pago</h3>
        <div class="card-actions" id="methodBreakdownActions"></div>
      </div>
      <div class="card-body" id="methodBreakdownChart"></div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Cerrar turno / arqueo</h3></div>
      <div class="card-body">
        <form id="closeShiftForm">
          <div class="form-row"><label>Efectivo contado (S/)</label><input type="number" name="closingAmount" min="0" step="0.01" value="${expectedCash}" required /></div>
          <div class="form-row"><label>Notas</label><input type="text" name="notes" placeholder="Opcional" /></div>
          <button type="submit" class="btn btn-primary">Cerrar turno</button>
        </form>
      </div>
    </div>`;

  if (Object.keys(byMethod).length) {
    const segments = PAYMENT_METHODS.filter((m) => byMethod[m] > 0).map((m) => ({
      name: m, hex: PAYMENT_METHOD_COLORS[m] || "var(--series-4)", stroke: null, textOn: "#ffffff", count: byMethod[m],
    }));
    renderStackedBar(document.getElementById("methodBreakdownChart"), document.getElementById("methodBreakdownActions"), segments, {
      ariaLabel: "Desglose por método de pago", tableHeaders: ["Método", "Monto", "Porcentaje"], valueFmt: fmtMoney,
    });
  } else {
    document.getElementById("methodBreakdownChart").innerHTML = `<p style="color:var(--text-muted);font-size:12px">Sin pagos aún en este turno.</p>`;
  }

  document.getElementById("closeShiftForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const diff = Number(fd.closingAmount) - expectedCash;
    closeShift(shift.id, fd);
    toast(diff === 0 ? "Turno cerrado sin diferencias" : `Turno cerrado — diferencia de ${fmtMoney(diff)}`, diff === 0 ? "success" : "error");
    renderCaja();
  });
}

/* ============================================================
   GASTOS — sueldos, gastos fijos y variables
   ============================================================ */
function populateExpenseCategoryFilter() {
  const sel = document.getElementById("filterExpenseCategory");
  sel.innerHTML = `<option value="">Todas las categorías</option>` + optionsHtml(EXPENSE_CATEGORIES, (c) => c.id, (c) => c.name);
}

function filteredExpenses() {
  const search = document.getElementById("expenseSearch").value.trim().toLowerCase();
  const category = document.getElementById("filterExpenseCategory").value;
  const type = document.getElementById("filterExpenseType").value;
  return EXPENSES.filter((e) =>
    (!search || e.description.toLowerCase().includes(search)) &&
    (!category || e.category === category) &&
    (!type || e.type === type)
  ).sort((a, b) => b.date.localeCompare(a.date));
}

function renderExpensesKpis() {
  const total = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const fijos = EXPENSES.filter((e) => e.type === "fijo").reduce((s, e) => s + e.amount, 0);
  const variables = EXPENSES.filter((e) => e.type === "variable").reduce((s, e) => s + e.amount, 0);
  const revenue = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 1].value;
  const balance = revenue - total;
  document.getElementById("expensesKpiGrid").innerHTML = [
    { label: "Total de gastos", value: fmtMoney(total), delta: `${EXPENSES.length} registros`, neutral: true },
    { label: "Gastos fijos", value: fmtMoney(fijos), delta: "sueldos, alquiler, servicios", neutral: true },
    { label: "Gastos variables", value: fmtMoney(variables), delta: "mantenimiento, marketing, etc.", neutral: true },
    { label: "Balance (mes de referencia)", value: fmtMoney(balance), delta: `Ingresos ${fmtMoney(revenue)} − gastos ${fmtMoney(total)}`, up: balance >= 0 },
  ].map((k) => `
    <div class="kpi-tile">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-delta ${k.neutral ? "" : k.up ? "up" : "down"}">${k.delta}</div>
    </div>`).join("");
}

function renderExpensesCharts() {
  const byCategory = EXPENSE_CATEGORIES.map((c) => ({ label: c.name, value: EXPENSES.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);
  const catEl = document.getElementById("expensesByCategoryChart");
  if (byCategory.length) {
    renderBarChart(catEl, byCategory, { seriesVar: "--series-8", valueFmt: fmtMoney, cardActions: document.getElementById("expensesByCategoryActions") });
  } else {
    catEl.innerHTML = `<p style="color:var(--text-muted);font-size:12px">Sin gastos registrados todavía.</p>`;
  }

  const fijos = EXPENSES.filter((e) => e.type === "fijo").reduce((s, e) => s + e.amount, 0);
  const variables = EXPENSES.filter((e) => e.type === "variable").reduce((s, e) => s + e.amount, 0);
  renderStackedBar(document.getElementById("expensesFixedVarChart"), null, [
    { name: "Fijos", hex: "var(--series-1)", stroke: null, textOn: "#ffffff", count: fijos },
    { name: "Variables", hex: "var(--series-2)", stroke: null, textOn: "#ffffff", count: variables },
  ], { ariaLabel: "Gastos fijos vs. variables", tableHeaders: ["Tipo", "Monto", "Porcentaje"], valueFmt: fmtMoney });
}

function renderExpensesTable() {
  const filtered = filteredExpenses();
  const { items, page, totalPages, total } = paginate(filtered, expensesPage, EXPENSES_PAGE_SIZE);
  expensesPage = page;

  document.getElementById("expensesTableBody").innerHTML = items.length ? items.map((e) => `
    <tr data-expense="${e.id}">
      <td>${e.description}</td>
      <td>${expenseCategoryInfo(e.category).name}</td>
      <td><span class="tag" style="${e.type === "fijo" ? "background:color-mix(in srgb, var(--series-1) 16%, transparent);color:var(--series-1)" : "background:color-mix(in srgb, var(--series-2) 16%, transparent);color:var(--series-2)"}">${e.type === "fijo" ? "Fijo" : "Variable"}</span></td>
      <td class="tnum">${fmtMoney(e.amount)}</td>
      <td>${e.date}</td>
      <td>${e.recurring ? `<span class="badge badge-neutral">${ICONS.refresh}Sí</span>` : "—"}</td>
      <td><div class="card-top-actions">
        <button type="button" class="icon-mini-btn" data-act="edit" title="Editar">${ICONS.edit}</button>
        <button type="button" class="icon-mini-btn danger" data-act="delete" title="Eliminar">${ICONS.trash}</button>
      </div></td>
    </tr>`).join("") : `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:28px">No se encontraron gastos con esos filtros.</td></tr>`;

  renderPaginationControls(document.getElementById("expensesPagination"), {
    page, totalPages, total, pageSize: EXPENSES_PAGE_SIZE,
    onChange: (p) => { expensesPage = p; renderExpensesTable(); },
  });

  document.querySelectorAll('#expensesTableBody [data-act="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const ex = EXPENSES.find((x) => x.id === btn.closest("tr").dataset.expense);
      openFormModal({
        title: "Editar gasto", bodyHtml: expenseFormFields(ex), submitLabel: "Guardar cambios",
        onSubmit: (data) => { updateExpense(ex.id, data); toast("Gasto actualizado"); renderExpensesKpis(); renderExpensesCharts(); renderExpensesTable(); },
      });
    });
  });
  document.querySelectorAll('#expensesTableBody [data-act="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ex = EXPENSES.find((x) => x.id === btn.closest("tr").dataset.expense);
      const ok = await confirmDialog(`¿Eliminar el gasto <strong>${ex.description}</strong>?`, { title: "Eliminar gasto", confirmLabel: "Eliminar", danger: true });
      if (!ok) return;
      deleteExpense(ex.id);
      toast("Gasto eliminado");
      renderExpensesKpis(); renderExpensesCharts(); renderExpensesTable();
    });
  });
}

["expenseSearch", "filterExpenseCategory", "filterExpenseType"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => { expensesPage = 1; renderExpensesTable(); });
  document.getElementById(id).addEventListener("change", () => { expensesPage = 1; renderExpensesTable(); });
});

document.getElementById("btnExportExpenses").addEventListener("click", () => {
  const rows = filteredExpenses().map((e) => [e.description, expenseCategoryInfo(e.category).name, e.type, e.amount, e.date, e.recurring ? "Sí" : "No"]);
  exportCSV("gastos.csv", ["Descripción", "Categoría", "Tipo", "Monto", "Fecha", "Recurrente"], rows);
});

function expenseFormFields(e) {
  return `
    <div class="form-row"><label>Descripción</label><input type="text" name="description" required value="${e ? e.description : ""}" /></div>
    <div class="modal-grid" style="margin-bottom:0">
      <div class="form-row"><label>Categoría</label><select name="category" id="fldExpenseCategory">${optionsHtml(EXPENSE_CATEGORIES, (c) => c.id, (c) => c.name, e ? e.category : EXPENSE_CATEGORIES[0].id)}</select></div>
      <div class="form-row"><label>Tipo</label><select name="type" id="fldExpenseType">${optionsHtml([["fijo", "Fijo"], ["variable", "Variable"]], (v) => v[0], (v) => v[1], e ? e.type : expenseCategoryInfo(EXPENSE_CATEGORIES[0].id).type)}</select></div>
      <div class="form-row"><label>Monto (S/)</label><input type="number" name="amount" min="0" step="0.01" required value="${e ? e.amount : ""}" /></div>
      <div class="form-row"><label>Fecha</label><input type="date" name="date" value="${e ? e.date : todayISO()}" /></div>
    </div>
    <label style="display:flex;align-items:center;gap:8px;font-size:12px;margin-top:4px">
      <input type="checkbox" name="recurring" value="1" ${e && e.recurring ? "checked" : ""} style="width:16px;height:16px" /> Es un gasto recurrente (se repite cada mes)
    </label>`;
}

document.getElementById("btnNewExpense").addEventListener("click", () => {
  const modal = openFormModal({
    title: "Nuevo gasto", bodyHtml: expenseFormFields(null), submitLabel: "Registrar gasto",
    onSubmit: (data) => {
      if (!data.description.trim() || !data.amount) { toast("Descripción y monto son obligatorios", "error"); return false; }
      createExpense(data);
      toast("Gasto registrado");
      renderExpensesKpis(); renderExpensesCharts(); renderExpensesTable();
    },
  });
  const catSel = modal.form.querySelector("#fldExpenseCategory");
  const typeSel = modal.form.querySelector("#fldExpenseType");
  catSel.addEventListener("change", () => { typeSel.value = expenseCategoryInfo(catSel.value).type; });
});

document.getElementById("btnGenerateSalaries").addEventListener("click", async () => {
  const ok = await confirmDialog("Esto crea (o actualiza) el gasto de \"Sueldos\" del mes en curso para cada instructor, según sus horas semanales y su tarifa.", { confirmLabel: "Generar" });
  if (!ok) return;
  const res = generateMonthlySalaries();
  if (!res.created && !res.updated) { toast("Ningún instructor tiene tarifa por hora configurada", "error"); return; }
  toast(`Sueldos generados: ${res.created} nuevo(s), ${res.updated} actualizado(s)`);
  renderExpensesKpis(); renderExpensesCharts(); renderExpensesTable();
});

function renderExpenses() {
  renderExpensesKpis();
  renderExpensesCharts();
  renderExpensesTable();
}

/* ============================================================
   NOTIFICACIONES (simuladas)
   ============================================================ */
function computeNotifications() {
  const items = [];
  const today = todayISO();
  STUDENTS.filter((s) => s.status !== "Inactivo").forEach((s) => {
    if (s.paymentStatus === "pendiente") {
      const d = daysBetween(today, s.nextPayment);
      if (d >= 0 && d <= 5) {
        const key = `cobro:${s.id}:${s.nextPayment}`;
        if (!DISMISSED_NOTIFICATIONS[key]) items.push({ key, title: "Recordatorio de cobro", body: `${s.name} — vence en ${d} día(s) (${s.nextPayment})`, student: s });
      }
    }
    if (s.lastVisit) {
      const d = daysBetween(s.lastVisit, today);
      if (d >= 7) {
        const key = `abandono:${s.id}:${s.lastVisit}`;
        if (!DISMISSED_NOTIFICATIONS[key]) items.push({ key, title: "Alerta de abandono", body: `${s.name} no asiste hace ${d} días`, student: s });
      }
    }
    if (examEligible(s)) {
      const key = `examen:${s.id}:${s.classesSincePromotion}`;
      if (!DISMISSED_NOTIFICATIONS[key]) items.push({ key, title: "Aviso de examen", body: `${s.name} ya cumplió el mínimo de clases para rendir examen de ${programName(s.program)}`, student: s });
    }
  });
  return items;
}
function renderNotifications() {
  const items = computeNotifications();
  document.getElementById("notificationsList").innerHTML = items.length ? items.map((n) => `
    <div class="notif-item">
      <div>
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-meta">Se enviaría a: ${n.student.phone || n.student.email}</div>
      </div>
      <div style="display:flex;gap:8px;flex:none">
        <button type="button" class="chip-btn" data-copy="${n.key}">Copiar mensaje</button>
        <button type="button" class="chip-btn" data-dismiss="${n.key}">${ICONS.send} Marcar enviado</button>
      </div>
    </div>`).join("") : `<div style="color:var(--text-muted)">No hay notificaciones pendientes por ahora.</div>`;

  document.querySelectorAll("[data-dismiss]").forEach((btn) => {
    btn.addEventListener("click", () => {
      dismissNotification(btn.dataset.dismiss);
      toast("Marcado como enviado (simulado)");
      renderNotifications();
    });
  });
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const item = items.find((n) => n.key === btn.dataset.copy);
      try {
        await navigator.clipboard.writeText(item.body);
        toast("Mensaje copiado al portapapeles");
      } catch {
        toast("No se pudo copiar el mensaje", "error");
      }
    });
  });
}

/* ============================================================
   PLANES Y GRADOS — módulo dedicado
   ============================================================ */
let activeSubtab = "planes";
let gradosActiveProgram = PROGRAMS[0].id;

function renderPlanesGrados() {
  document.querySelectorAll(".subtab-btn").forEach((b) => b.classList.toggle("active", b.dataset.subtab === activeSubtab));
  document.querySelectorAll(".subtab-panel").forEach((p) => p.classList.toggle("active", p.id === "subtab-" + activeSubtab));
  if (activeSubtab === "planes") renderPlanCards();
  else renderGradosTab();
}
document.querySelectorAll(".subtab-btn").forEach((btn) => {
  btn.addEventListener("click", () => { activeSubtab = btn.dataset.subtab; renderPlanesGrados(); });
});

function renderPlanCards() {
  document.getElementById("planCardGrid").innerHTML = PLANS_CATALOG.map((p) => {
    const stats = planStats(p.name);
    return `<div class="plan-card ${p.active ? "" : "inactive"}" style="--plan-color:${p.color || "var(--series-1)"}">
      <div class="plan-card-top">
        <div>
          <div class="plan-card-name">${p.name}</div>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px">${p.type === "paquete" ? `Por paquete · ${p.credits} clases` : `Por tiempo · ${p.days} días`}</div>
        </div>
        ${p.active ? `<span class="badge badge-good">${ICONS.check}Activo</span>` : `<span class="badge badge-neutral">${ICONS.minus}Inactivo</span>`}
      </div>
      <div class="plan-card-price">${fmtMoney(p.price)}</div>
      <div class="plan-card-desc">${p.description || "Sin descripción."}</div>
      <div class="plan-card-stats">
        <div class="stat"><b>${stats.studentCount}</b><span>Alumnos actuales</span></div>
        <div class="stat"><b>${fmtMoney(stats.revenue)}</b><span>Ingresos generados</span></div>
      </div>
      <div class="plan-card-actions">
        <button type="button" class="chip-btn" data-plan-edit="${p.name}">${ICONS.edit} Editar</button>
        <button type="button" class="chip-btn" data-plan-toggle="${p.name}">${p.active ? ICONS.pause + " Desactivar" : ICONS.check + " Activar"}</button>
        <button type="button" class="chip-btn" data-plan-delete="${p.name}" style="color:var(--status-critical)">${ICONS.trash} Eliminar</button>
      </div>
    </div>`;
  }).join("") || `<p style="color:var(--text-muted)">Aún no hay planes. Crea el primero.</p>`;

  document.querySelectorAll("[data-plan-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = planByName(btn.dataset.planEdit);
      openFormModal({
        title: `Editar plan — ${p.name}`, width: 400,
        bodyHtml: `
          <div class="modal-grid" style="margin-bottom:0">
            <div class="form-row"><label>Precio (S/)</label><input type="number" name="price" min="0" step="0.01" value="${p.price}" /></div>
            <div class="form-row"><label>Color</label><input type="color" name="color" value="${p.color || "#2a78d6"}" style="padding:4px;height:40px" /></div>
            ${p.type === "tiempo" ? `<div class="form-row"><label>Duración (días)</label><input type="number" name="days" min="1" value="${p.days}" /></div>` : `<div class="form-row"><label>Créditos de clase</label><input type="number" name="credits" min="1" value="${p.credits}" /></div>`}
          </div>
          <div class="form-row"><label>Descripción</label><input type="text" name="description" value="${p.description || ""}" /></div>`,
        submitLabel: "Guardar",
        onSubmit: (data) => { updatePlan(p.name, data); toast("Plan actualizado"); renderPlanCards(); },
      });
    });
  });
  document.querySelectorAll("[data-plan-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = planByName(btn.dataset.planToggle);
      setPlanActive(p.name, !p.active);
      toast(p.active ? "Plan desactivado" : "Plan activado");
      renderPlanCards();
    });
  });
  document.querySelectorAll("[data-plan-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await confirmDialog(`¿Eliminar el plan <strong>${btn.dataset.planDelete}</strong>?`, { title: "Eliminar plan", confirmLabel: "Eliminar", danger: true });
      if (!ok) return;
      const res = deletePlan(btn.dataset.planDelete);
      if (!res.ok) { toast(res.reason || "No se pudo eliminar", "error"); return; }
      toast("Plan eliminado");
      renderPlanCards();
    });
  });
}

document.getElementById("btnNewPlan").addEventListener("click", () => {
  const modal = openFormModal({
    title: "Nuevo plan", width: 400,
    bodyHtml: `
      <div class="form-row"><label>Nombre</label><input type="text" name="name" required /></div>
      <div class="modal-grid" style="margin-bottom:0">
        <div class="form-row"><label>Tipo</label><select name="type" id="newPlanType"><option value="tiempo">Por tiempo (vence)</option><option value="paquete">Por paquete de clases</option></select></div>
        <div class="form-row"><label>Precio (S/)</label><input type="number" name="price" min="0" step="0.01" value="100" /></div>
        <div class="form-row" id="newPlanDaysRow"><label>Duración (días)</label><input type="number" name="days" min="1" value="30" /></div>
        <div class="form-row" id="newPlanCreditsRow" style="display:none"><label>Créditos de clase</label><input type="number" name="credits" min="1" value="10" /></div>
        <div class="form-row"><label>Color</label><input type="color" name="color" value="#2a78d6" style="padding:4px;height:40px" /></div>
      </div>
      <div class="form-row"><label>Descripción</label><input type="text" name="description" placeholder="Frase corta para mostrar a los alumnos" /></div>`,
    submitLabel: "Crear plan",
    onSubmit: (data) => {
      if (!data.name.trim()) { toast("El nombre es obligatorio", "error"); return false; }
      const res = addPlan(data);
      if (!res.ok) { toast(res.reason, "error"); return false; }
      toast("Plan creado");
      renderPlanCards();
    },
  });
  const typeSel = modal.form.querySelector("#newPlanType");
  const daysRow = modal.form.querySelector("#newPlanDaysRow");
  const creditsRow = modal.form.querySelector("#newPlanCreditsRow");
  typeSel.addEventListener("change", () => {
    const isPaquete = typeSel.value === "paquete";
    daysRow.style.display = isPaquete ? "none" : "";
    creditsRow.style.display = isPaquete ? "" : "none";
  });
});

function renderGradosTab() {
  document.getElementById("gradosProgramTabs").innerHTML = PROGRAMS.map((p) => `
    <button type="button" class="program-tab-btn ${p.id === gradosActiveProgram ? "active" : ""}" data-program-tab="${p.id}">${p.name}</button>
  `).join("");
  document.querySelectorAll("[data-program-tab]").forEach((btn) => {
    btn.addEventListener("click", () => { gradosActiveProgram = btn.dataset.programTab; renderGradosTab(); });
  });
  document.getElementById("gradosScaleTitle").textContent = `Escala — ${programName(gradosActiveProgram)}`;
  renderGradosScale(gradosActiveProgram);
}

function renderGradosScale(program) {
  const scale = beltScaleFor(program);
  document.getElementById("gradosScaleBody").innerHTML = scale.map((level, idx) => {
    const count = levelStudentCount(program, idx);
    const canDelete = idx === scale.length - 1 && scale.length > 1 && count === 0;
    return `<div class="level-row">
      <div class="level-rank">${idx + 1}</div>
      <div class="level-swatch" style="background:${level.hex};border-color:${level.stroke || "transparent"}"></div>
      <div class="level-name">${level.name}</div>
      <div class="level-meta">${level.examClasses != null ? `${level.examClasses} clases para ascender` : "Nivel máximo"}</div>
      <div class="level-count">${count} alumno(s)</div>
      <div class="card-top-actions">
        <button type="button" class="icon-mini-btn" data-level-edit="${idx}" title="Editar">${ICONS.edit}</button>
        <button type="button" class="icon-mini-btn danger" data-level-delete="${idx}" title="Eliminar" ${canDelete ? "" : "disabled style=\"opacity:.35;cursor:not-allowed\""}>${ICONS.trash}</button>
      </div>
    </div>`;
  }).join("");

  document.querySelectorAll("[data-level-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.levelEdit);
      const level = scale[idx];
      const isMax = level.examClasses == null;
      openFormModal({
        title: `Editar nivel — ${level.name}`, width: 380,
        bodyHtml: `
          <div class="form-row"><label>Nombre</label><input type="text" name="name" value="${level.name}" required /></div>
          <div class="form-row"><label>Color</label><input type="color" name="hex" value="${level.hex}" style="padding:4px;height:40px" /></div>
          ${isMax ? `<p style="font-size:11px;color:var(--text-muted)">Este es el nivel máximo de la escala: no requiere examen posterior.</p>` : `<div class="form-row"><label>Clases requeridas para ascender</label><input type="number" name="examClasses" min="1" value="${level.examClasses}" /></div>`}`,
        submitLabel: "Guardar",
        onSubmit: (data) => { updateBeltLevel(program, idx, data); toast("Nivel actualizado"); renderGradosScale(program); },
      });
    });
  });
  document.querySelectorAll("[data-level-delete]:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.dataset.levelDelete);
      const ok = await confirmDialog(`¿Eliminar el nivel <strong>${scale[idx].name}</strong>?`, { title: "Eliminar nivel", confirmLabel: "Eliminar", danger: true });
      if (!ok) return;
      const res = deleteBeltLevel(program, idx);
      if (!res.ok) { toast(res.reason || "No se pudo eliminar", "error"); return; }
      toast("Nivel eliminado");
      renderGradosScale(program);
    });
  });
}

document.getElementById("btnNewLevel").addEventListener("click", () => {
  const scale = beltScaleFor(gradosActiveProgram);
  const lastHasExam = scale.length && scale[scale.length - 1].examClasses != null;
  openFormModal({
    title: "Agregar nivel", width: 380,
    bodyHtml: `
      <div class="form-row"><label>Nombre del nuevo nivel</label><input type="text" name="name" required /></div>
      <div class="form-row"><label>Color</label><input type="color" name="hex" value="#2a78d6" style="padding:4px;height:40px" /></div>
      ${!lastHasExam ? `<div class="form-row"><label>Clases requeridas en "${scale[scale.length - 1].name}" para llegar a este nuevo nivel</label><input type="number" name="previousExamClasses" min="1" value="20" /></div>` : ""}`,
    submitLabel: "Agregar",
    onSubmit: (data) => {
      if (!data.name.trim()) { toast("El nombre es obligatorio", "error"); return false; }
      addBeltLevel(gradosActiveProgram, data);
      toast("Nivel agregado");
      renderGradosScale(gradosActiveProgram);
    },
  });
});

/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
function renderSettings() {
  document.getElementById("fldAcademyName").value = ACADEMY.name;
  document.getElementById("fldAcademyAddress").value = ACADEMY.address;
  document.getElementById("fldAcademyPhone").value = ACADEMY.phone;
  document.getElementById("fldAcademyRuc").value = ACADEMY.ruc || "";
  document.getElementById("fldAcademyGoal").value = ACADEMY.monthlyRevenueGoal || 0;
  document.getElementById("fldAcademyTz").value = ACADEMY.timezone;

  document.getElementById("programTags").innerHTML = PROGRAMS.map((p) => `
    <span class="tag" style="background:color-mix(in srgb, ${p.color} 16%, transparent); color:${p.color}">${p.name}</span>
  `).join("");
}

document.getElementById("academyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  saveAcademy({
    name: document.getElementById("fldAcademyName").value.trim(),
    address: document.getElementById("fldAcademyAddress").value.trim(),
    phone: document.getElementById("fldAcademyPhone").value.trim(),
    ruc: document.getElementById("fldAcademyRuc").value.trim(),
    monthlyRevenueGoal: Number(document.getElementById("fldAcademyGoal").value) || 0,
    timezone: document.getElementById("fldAcademyTz").value,
  });
  toast("Datos de la academia guardados");
});

document.getElementById("btnResetDemo").addEventListener("click", async () => {
  const ok = await confirmDialog("Se borrará todo lo que capturaste en este navegador y se restaurarán los datos de ejemplo originales.", { title: "Restablecer datos de ejemplo", confirmLabel: "Restablecer", danger: true });
  if (ok) resetDemoData();
});

/* ============================================================
   Init
   ============================================================ */
function init() {
  populateProgramFilter();
  populateExpenseCategoryFilter();
  switchView("dashboard");
}
document.addEventListener("DOMContentLoaded", init);
