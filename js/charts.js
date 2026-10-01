/* ============================================================
   Gráficos — construidos a mano en SVG siguiendo las reglas de
   la guía de visualización de datos (sin librerías externas).
   ============================================================ */

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function niceMax(value) {
  if (value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  let niceNorm;
  if (normalized <= 1) niceNorm = 1;
  else if (normalized <= 2) niceNorm = 2;
  else if (normalized <= 5) niceNorm = 5;
  else niceNorm = 10;
  return niceNorm * magnitude;
}

function roundedTopRectPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
}

/* ---------- Shared tooltip ---------- */
let tooltipEl = null;
function getTooltip() {
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "chart-tooltip";
    tooltipEl.setAttribute("role", "status");
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}
function showTooltip(x, y, html) {
  const t = getTooltip();
  t.innerHTML = html;
  t.style.display = "block";
  const rect = t.getBoundingClientRect();
  let left = x + 14;
  let top = y - rect.height - 10;
  if (left + rect.width > window.innerWidth - 8) left = x - rect.width - 14;
  if (top < 8) top = y + 16;
  t.style.left = left + "px";
  t.style.top = top + "px";
}
function hideTooltip() {
  if (tooltipEl) tooltipEl.style.display = "none";
}

/* ---------- Table-view toggle ---------- */
function addTableToggle(cardActionsEl, chartWrapEl, tableWrapEl) {
  cardActionsEl.innerHTML = "";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip-btn";
  btn.textContent = "Ver tabla";
  tableWrapEl.hidden = true;
  btn.addEventListener("click", () => {
    const showingTable = !tableWrapEl.hidden;
    tableWrapEl.hidden = showingTable;
    chartWrapEl.hidden = !showingTable;
    btn.textContent = showingTable ? "Ver tabla" : "Ver gráfico";
  });
  cardActionsEl.appendChild(btn);
}

function buildSimpleTable(headers, rows) {
  const wrap = document.createElement("div");
  wrap.className = "chart-table-wrap";
  const table = document.createElement("table");
  table.className = "chart-table";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr>" + headers.map((h) => `<th>${h}</th>`).join("") + "</tr>";
  const tbody = document.createElement("tbody");
  tbody.innerHTML = rows.map((r) => "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>").join("");
  table.appendChild(thead);
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

/* ============================================================
   Line chart (con área) — una sola serie
   ============================================================ */
function renderLineChart(root, data, { seriesVar = "--series-1", valueFmt = (v) => v, cardActions } = {}) {
  root.innerHTML = "";
  const W = 600, H = 230;
  const padL = 46, padR = 18, padT = 18, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const maxVal = niceMax(Math.max(...data.map((d) => d.value)) * 1.15);
  const steps = 4;
  const x = (i) => padL + (i / (data.length - 1)) * plotW;
  const y = (v) => padT + plotH - (v / maxVal) * plotH;

  const chartWrap = document.createElement("div");
  chartWrap.className = "chart-svg-wrap";
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg", role: "img", "aria-label": "Gráfico de líneas" });

  // gridlines + y ticks
  for (let s = 0; s <= steps; s++) {
    const v = (maxVal / steps) * s;
    const yy = y(v);
    svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: yy, y2: yy, class: "grid-line" }));
    const label = svgEl("text", { x: padL - 10, y: yy + 4, class: "axis-label", "text-anchor": "end" });
    label.textContent = Math.round(v).toLocaleString("en-US");
    svg.appendChild(label);
  }

  // x labels
  data.forEach((d, i) => {
    const t = svgEl("text", { x: x(i), y: H - 8, class: "axis-label", "text-anchor": "middle" });
    t.textContent = d.label;
    svg.appendChild(t);
  });

  // area path
  let areaD = `M${x(0)},${y(0)} `;
  data.forEach((d, i) => (areaD += `L${x(i)},${y(d.value)} `));
  areaD += `L${x(data.length - 1)},${y(0)} Z`;
  const area = svgEl("path", { d: areaD, class: "area-fill" });
  area.style.fill = `var(${seriesVar})`;
  svg.appendChild(area);

  // line path
  let lineD = "";
  data.forEach((d, i) => (lineD += (i === 0 ? "M" : "L") + x(i) + "," + y(d.value) + " "));
  const line = svgEl("path", { d: lineD, class: "line-path", fill: "none" });
  line.style.stroke = `var(${seriesVar})`;
  svg.appendChild(line);

  // end marker + direct label on last point
  const lastI = data.length - 1;
  const endDot = svgEl("circle", { cx: x(lastI), cy: y(data[lastI].value), r: 5, class: "end-marker" });
  endDot.style.fill = `var(${seriesVar})`;
  svg.appendChild(endDot);
  const endLabel = svgEl("text", { x: x(lastI), y: y(data[lastI].value) - 14, class: "data-label", "text-anchor": "end" });
  endLabel.textContent = valueFmt(data[lastI].value);
  svg.appendChild(endLabel);

  // crosshair group (hidden until hover)
  const crosshair = svgEl("line", { x1: 0, x2: 0, y1: padT, y2: padT + plotH, class: "crosshair" });
  crosshair.style.display = "none";
  svg.appendChild(crosshair);
  const hoverDot = svgEl("circle", { r: 5, class: "end-marker" });
  hoverDot.style.fill = `var(${seriesVar})`;
  hoverDot.style.display = "none";
  svg.appendChild(hoverDot);

  // hit layer
  const hit = svgEl("rect", { x: padL, y: padT, width: plotW, height: plotH, fill: "transparent" });
  hit.addEventListener("mousemove", (e) => {
    const rectBox = svg.getBoundingClientRect();
    const relX = ((e.clientX - rectBox.left) / rectBox.width) * W;
    let idx = Math.round(((relX - padL) / plotW) * (data.length - 1));
    idx = Math.max(0, Math.min(data.length - 1, idx));
    const px = x(idx), py = y(data[idx].value);
    crosshair.setAttribute("x1", px);
    crosshair.setAttribute("x2", px);
    crosshair.style.display = "block";
    hoverDot.setAttribute("cx", px);
    hoverDot.setAttribute("cy", py);
    hoverDot.style.display = "block";
    showTooltip(e.clientX, e.clientY, `<strong>${data[idx].label}</strong><br>${valueFmt(data[idx].value)}`);
  });
  hit.addEventListener("mouseleave", () => {
    crosshair.style.display = "none";
    hoverDot.style.display = "none";
    hideTooltip();
  });
  svg.appendChild(hit);

  chartWrap.appendChild(svg);
  root.appendChild(chartWrap);

  const tableWrap = buildSimpleTable(["Periodo", "Valor"], data.map((d) => [d.label, valueFmt(d.value)]));
  root.appendChild(tableWrap);
  if (cardActions) addTableToggle(cardActions, chartWrap, tableWrap);
}

/* ============================================================
   Bar chart — una sola serie, barras verticales
   ============================================================ */
function renderBarChart(root, data, { seriesVar = "--series-2", valueFmt = (v) => v, cardActions } = {}) {
  root.innerHTML = "";
  const W = 600, H = 220;
  const padL = 40, padR = 14, padT = 20, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxVal = niceMax(Math.max(...data.map((d) => d.value)) * 1.2);

  const slot = plotW / data.length;
  const barW = Math.min(24, slot * 0.5);

  const chartWrap = document.createElement("div");
  chartWrap.className = "chart-svg-wrap";
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg", role: "img", "aria-label": "Gráfico de barras" });

  const steps = 4;
  for (let s = 0; s <= steps; s++) {
    const v = (maxVal / steps) * s;
    const yy = padT + plotH - (v / maxVal) * plotH;
    svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: yy, y2: yy, class: "grid-line" }));
    const label = svgEl("text", { x: padL - 8, y: yy + 4, class: "axis-label", "text-anchor": "end" });
    label.textContent = Math.round(v).toLocaleString("en-US");
    svg.appendChild(label);
  }

  let maxIdx = 0;
  data.forEach((d, i) => { if (d.value > data[maxIdx].value) maxIdx = i; });

  data.forEach((d, i) => {
    const cx = padL + slot * i + slot / 2;
    const barH = (d.value / maxVal) * plotH;
    const barY = padT + plotH - barH;
    const path = svgEl("path", { d: roundedTopRectPath(cx - barW / 2, barY, barW, barH, 4), class: "bar-mark" });
    path.style.fill = `var(${seriesVar})`;
    svg.appendChild(path);

    if (i === maxIdx) {
      const lbl = svgEl("text", { x: cx, y: barY - 8, class: "data-label", "text-anchor": "middle" });
      lbl.textContent = valueFmt(d.value);
      svg.appendChild(lbl);
    }

    const label = svgEl("text", { x: cx, y: H - 8, class: "axis-label", "text-anchor": "middle" });
    label.textContent = d.label;
    svg.appendChild(label);

    const hit = svgEl("rect", { x: padL + slot * i, y: padT, width: slot, height: plotH, fill: "transparent" });
    hit.addEventListener("mousemove", (e) => {
      path.classList.add("bar-hover");
      showTooltip(e.clientX, e.clientY, `<strong>${d.label}</strong><br>${valueFmt(d.value)}`);
    });
    hit.addEventListener("mouseleave", () => {
      path.classList.remove("bar-hover");
      hideTooltip();
    });
    svg.appendChild(hit);
  });

  chartWrap.appendChild(svg);
  root.appendChild(chartWrap);

  const tableWrap = buildSimpleTable(["Periodo", "Valor"], data.map((d) => [d.label, valueFmt(d.value)]));
  root.appendChild(tableWrap);
  if (cardActions) addTableToggle(cardActions, chartWrap, tableWrap);
}

/* ============================================================
   Barra horizontal apilada — genérica (usada por "Distribución
   por nivel" y "Alumnos por disciplina")
   ============================================================ */
function renderStackedBar(root, cardActions, segments, { ariaLabel = "Distribución", tooltipLabel = "", tableHeaders = ["Categoría", "Alumnos", "Porcentaje"], valueFmt = (v) => v + " alumnos" } = {}) {
  root.innerHTML = "";
  const total = segments.reduce((sum, b) => sum + b.count, 0) || 1;

  const W = 600, H = 70;
  const gap = 2;
  const barH = 36;
  const barY = 10;

  const chartWrap = document.createElement("div");
  chartWrap.className = "chart-svg-wrap";
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart-svg belt-bar-svg", role: "img", "aria-label": ariaLabel });

  let cx = 0;
  segments.forEach((b, i) => {
    if (b.count === 0) return;
    const w = (b.count / total) * W - (i === 0 || i === segments.length - 1 ? gap / 2 : gap);
    const isFirst = cx === 0;
    const isLast = i === segments.length - 1 || segments.slice(i + 1).every((c) => c.count === 0);
    let d;
    if (isFirst && isLast) d = roundedRectBothEnds(cx, barY, w, barH, 6);
    else if (isFirst) d = roundedRectLeftEnd(cx, barY, w, barH, 6);
    else if (isLast) d = roundedRectRightEnd(cx, barY, w, barH, 6);
    else d = `M${cx},${barY} h${w} v${barH} h${-w} Z`;

    const seg = svgEl("path", { d });
    seg.style.fill = b.hex;
    if (b.stroke) seg.setAttribute("stroke", b.stroke), seg.setAttribute("stroke-width", "1");
    svg.appendChild(seg);

    const pct = Math.round((b.count / total) * 100);
    if (w > 46) {
      const label = svgEl("text", {
        x: cx + w / 2, y: barY + barH / 2 + 4, "text-anchor": "middle", class: "belt-inline-label",
      });
      label.style.fill = b.textOn;
      label.textContent = valueFmt(b.count);
      svg.appendChild(label);
    }

    const hitRect = svgEl("rect", { x: cx, y: barY, width: w, height: barH, fill: "transparent" });
    hitRect.addEventListener("mousemove", (e) => {
      showTooltip(e.clientX, e.clientY, `<strong>${tooltipLabel}${b.name}</strong><br>${valueFmt(b.count)} (${pct}%)`);
    });
    hitRect.addEventListener("mouseleave", hideTooltip);
    svg.appendChild(hitRect);

    cx += w + gap;
  });

  chartWrap.appendChild(svg);

  const legend = document.createElement("div");
  legend.className = "belt-legend";
  segments.filter((b) => b.count > 0).forEach((b) => {
    const item = document.createElement("div");
    item.className = "belt-legend-item";
    const swatch = document.createElement("span");
    swatch.className = "belt-swatch";
    swatch.style.background = b.hex;
    if (b.stroke) swatch.style.borderColor = b.stroke;
    item.appendChild(swatch);
    const text = document.createElement("span");
    text.textContent = `${b.name} · ${valueFmt(b.count)}`;
    item.appendChild(text);
    legend.appendChild(item);
  });
  chartWrap.appendChild(legend);

  root.appendChild(chartWrap);

  const tableWrap = buildSimpleTable(
    tableHeaders,
    segments.filter((b) => b.count > 0).map((b) => [b.name, valueFmt(b.count), Math.round((b.count / total) * 100) + "%"])
  );
  root.appendChild(tableWrap);
  if (cardActions) addTableToggle(cardActions, chartWrap, tableWrap);
}

/* Distribución por NIVEL (normalizada entre disciplinas: cada alumno se
   ubica en un cubo según su posición relativa dentro de la escala de SU
   disciplina — así Karate cinturón negro y Boxeo "Competidor" cuentan igual). */
const LEVEL_BUCKETS = [
  { name: "Principiante", fill: "color-mix(in srgb, var(--series-1) 35%, var(--surface-1))", textOn: "var(--text-primary)" },
  { name: "Intermedio", fill: "color-mix(in srgb, var(--series-1) 62%, var(--surface-1))", textOn: "#ffffff" },
  { name: "Avanzado", fill: "color-mix(in srgb, var(--series-1) 85%, var(--surface-1))", textOn: "#ffffff" },
  { name: "Experto", fill: "color-mix(in srgb, var(--series-1) 100%, #000000 15%)", textOn: "#ffffff" },
];
function levelBucketIndex(student) {
  const rank = currentRank(student);
  if (rank.scaleLength <= 1) return 0;
  const ratio = rank.index / (rank.scaleLength - 1);
  if (ratio >= 0.999) return 3;
  if (ratio >= 0.66) return 2;
  if (ratio >= 0.33) return 1;
  return 0;
}
function renderBeltDistribution(root, cardActions) {
  const activeStudents = STUDENTS.filter((s) => s.status !== "Inactivo");
  const segments = LEVEL_BUCKETS.map((b, i) => ({
    name: b.name, hex: b.fill, stroke: null, textOn: b.textOn,
    count: activeStudents.filter((s) => levelBucketIndex(s) === i).length,
  }));
  renderStackedBar(root, cardActions, segments, {
    ariaLabel: "Distribución de alumnos por nivel", tooltipLabel: "Nivel ", tableHeaders: ["Nivel", "Alumnos", "Porcentaje"],
  });
}

/* Distribución por DISCIPLINA — usa los colores de marca ya asignados a
   cada disciplina en toda la app (PROGRAMS), consistentes con el horario
   y las tarjetas de clase. */
function renderProgramDistribution(root, cardActions) {
  const activeStudents = STUDENTS.filter((s) => s.status !== "Inactivo");
  const segments = PROGRAMS.map((p) => ({
    name: p.name, hex: p.color, stroke: null, textOn: "#ffffff",
    count: activeStudents.filter((s) => s.program === p.id).length,
  }));
  renderStackedBar(root, cardActions, segments, {
    ariaLabel: "Distribución de alumnos por disciplina", tooltipLabel: "", tableHeaders: ["Disciplina", "Alumnos", "Porcentaje"],
  });
}

/* ============================================================
   Sparkline — mini-tendencia dentro de una tarjeta KPI
   ============================================================ */
function renderSparkline(root, data, { seriesVar = "--series-1", valueFmt = (v) => v } = {}) {
  root.innerHTML = "";
  const W = 160, H = 40;
  const pad = 4;
  const plotW = W - pad * 2, plotH = H - pad * 2;
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = (maxVal - minVal) || 1;
  const x = (i) => pad + (i / (data.length - 1)) * plotW;
  const y = (v) => pad + plotH - ((v - minVal) / range) * plotH;

  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "sparkline-svg", role: "img", "aria-label": "Tendencia" });

  let areaD = `M${x(0)},${y(minVal)} `;
  data.forEach((d, i) => (areaD += `L${x(i)},${y(d.value)} `));
  areaD += `L${x(data.length - 1)},${y(minVal)} Z`;
  const area = svgEl("path", { d: areaD, class: "area-fill" });
  area.style.fill = `var(${seriesVar})`;
  svg.appendChild(area);

  let lineD = "";
  data.forEach((d, i) => (lineD += (i === 0 ? "M" : "L") + x(i) + "," + y(d.value) + " "));
  const line = svgEl("path", { d: lineD, fill: "none", class: "line-path" });
  line.style.stroke = `var(${seriesVar})`;
  line.style.strokeWidth = "1.5";
  svg.appendChild(line);

  const lastI = data.length - 1;
  const dot = svgEl("circle", { cx: x(lastI), cy: y(data[lastI].value), r: 3, class: "end-marker" });
  dot.style.fill = `var(${seriesVar})`;
  svg.appendChild(dot);

  const hit = svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" });
  hit.addEventListener("mousemove", (e) => {
    const box = svg.getBoundingClientRect();
    const relX = ((e.clientX - box.left) / box.width) * W;
    let idx = Math.round(((relX - pad) / plotW) * (data.length - 1));
    idx = Math.max(0, Math.min(data.length - 1, idx));
    showTooltip(e.clientX, e.clientY, `<strong>${data[idx].label}</strong><br>${valueFmt(data[idx].value)}`);
  });
  hit.addEventListener("mouseleave", hideTooltip);
  svg.appendChild(hit);

  root.appendChild(svg);
}

/* ============================================================
   Meter — barra de progreso hacia una meta
   ============================================================ */
function renderMeter(root, { value, max, fillVar = "--series-1", formatValue = (v) => v, footnote = "" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  root.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">
      <span style="font-size:19px;font-weight:700">${formatValue(value)}</span>
      <span style="font-size:11px;color:var(--text-muted)">meta ${formatValue(max)}</span>
    </div>
    <div class="progress-track" style="height:10px">
      <div class="progress-fill" style="width:${pct}%;background:var(${fillVar})"></div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:8px">${pct}% de la meta mensual${footnote ? " · " + footnote : ""}</div>`;
}

/* ============================================================
   Heatmap — ocupación por día y franja horaria
   ============================================================ */
function sequentialColor(t) {
  t = Math.max(0, Math.min(1, t));
  const light = [205, 226, 251]; // #cde2fb (paso 100)
  const dark = [13, 54, 107]; // #0d366b (paso 700)
  const rgb = light.map((c, i) => Math.round(c + (dark[i] - c) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
function heatmapTextColor(t) { return t > 0.55 ? "#ffffff" : "#0b0b0b"; }

function renderHeatmap(root, cardActions, { rows, cols, matrix, valueFmt = (v) => v + "%", emptyLabel = "Sin clases" }) {
  root.innerHTML = "";
  const chartWrap = document.createElement("div");
  chartWrap.className = "chart-svg-wrap";

  const grid = document.createElement("div");
  grid.className = "heatmap-grid";
  grid.style.gridTemplateColumns = `96px repeat(${cols.length}, 1fr)`;

  const corner = document.createElement("div");
  corner.className = "heatmap-corner";
  grid.appendChild(corner);
  cols.forEach((c) => {
    const el = document.createElement("div");
    el.className = "heatmap-colhead";
    el.textContent = c;
    grid.appendChild(el);
  });

  rows.forEach((rowLabel, r) => {
    const rowHead = document.createElement("div");
    rowHead.className = "heatmap-rowhead";
    rowHead.textContent = rowLabel;
    grid.appendChild(rowHead);

    cols.forEach((colLabel, c) => {
      const val = matrix[r][c];
      const cell = document.createElement("div");
      if (val == null) {
        cell.className = "heatmap-cell empty";
        cell.textContent = "—";
      } else {
        cell.className = "heatmap-cell";
        const t = val / 100;
        cell.style.background = sequentialColor(t);
        cell.style.color = heatmapTextColor(t);
        cell.textContent = valueFmt(val);
        cell.addEventListener("mousemove", (e) => {
          showTooltip(e.clientX, e.clientY, `<strong>${rowLabel} · ${colLabel}</strong><br>Ocupación promedio: ${valueFmt(val)}`);
        });
        cell.addEventListener("mouseleave", hideTooltip);
      }
      grid.appendChild(cell);
    });
  });
  chartWrap.appendChild(grid);

  const legend = document.createElement("div");
  legend.className = "heatmap-scale-legend";
  legend.innerHTML = `<span>Baja ocupación</span><div class="heatmap-scale-bar"></div><span>Alta ocupación</span>`;
  chartWrap.appendChild(legend);

  root.appendChild(chartWrap);

  const tableRows = [];
  rows.forEach((rowLabel, r) => cols.forEach((colLabel, c) => {
    const val = matrix[r][c];
    tableRows.push([colLabel, rowLabel, val == null ? emptyLabel : valueFmt(val)]);
  }));
  const tableWrap = buildSimpleTable(["Día", "Franja", "Ocupación"], tableRows);
  root.appendChild(tableWrap);
  if (cardActions) addTableToggle(cardActions, chartWrap, tableWrap);
}

function roundedRectBothEnds(x, y, w, h, r) {
  return `M${x + r},${y} h${w - 2 * r} q${r},0 ${r},${r} v${h - 2 * r} q0,${r} ${-r},${r} h${-(w - 2 * r)} q${-r},0 ${-r},${-r} v${-(h - 2 * r)} q0,${-r} ${r},${-r} Z`;
}
function roundedRectLeftEnd(x, y, w, h, r) {
  return `M${x + r},${y} h${w - r} v${h} h${-(w - r)} q${-r},0 ${-r},${-r} v${-(h - 2 * r)} q0,${-r} ${r},${-r} Z`;
}
function roundedRectRightEnd(x, y, w, h, r) {
  return `M${x},${y} h${w - r} q${r},0 ${r},${r} v${h - 2 * r} q0,${r} ${-r},${r} h${-(w - r)} Z`;
}
