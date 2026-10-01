/* ============================================================
   UI helpers genéricos: toasts, confirmaciones, modales de
   formulario, exportar CSV y paginación.
   ============================================================ */

const X_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';

/* ---------- Toasts ---------- */
function getToastContainer() {
  let c = document.getElementById("toastContainer");
  if (!c) {
    c = document.createElement("div");
    c.id = "toastContainer";
    c.className = "toast-container";
    document.body.appendChild(c);
  }
  return c;
}
function toast(message, type = "success") {
  const c = getToastContainer();
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  const icon = type === "error"
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  el.innerHTML = `<span class="toast-ico">${icon}</span><span>${message}</span>`;
  c.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-out");
    setTimeout(() => el.remove(), 220);
  }, 3000);
}

/* ---------- Confirmación ---------- */
function confirmDialog(message, opts = {}) {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop open";
    backdrop.innerHTML = `
      <div class="modal" style="max-width:380px">
        <div class="modal-body" style="padding-top:22px">
          <div style="font-weight:700;font-size:13.5px;margin-bottom:8px">${opts.title || "Confirmar acción"}</div>
          <div style="color:var(--text-secondary);font-size:12.5px;margin-bottom:20px">${message}</div>
          <div style="display:flex;gap:10px;justify-content:flex-end">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="button" class="btn btn-primary" data-act="ok" style="${opts.danger ? "background:var(--status-critical)" : ""}">${opts.confirmLabel || "Confirmar"}</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const close = (result) => { backdrop.remove(); resolve(result); };
    backdrop.querySelector('[data-act="cancel"]').addEventListener("click", () => close(false));
    backdrop.querySelector('[data-act="ok"]').addEventListener("click", () => close(true));
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(false); });
  });
}

/* ---------- Modal de formulario genérico ---------- */
function openFormModal({ title, bodyHtml, submitLabel = "Guardar", onSubmit, width = 480 }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop open";
  backdrop.innerHTML = `
    <div class="modal" style="max-width:${width}px">
      <div class="modal-header">
        <div class="modal-student-id"><div class="name">${title}</div></div>
        <button type="button" class="modal-close" data-act="close">${X_ICON}</button>
      </div>
      <form class="modal-body" id="dynForm" novalidate>
        ${bodyHtml}
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px">
          <button type="button" class="btn btn-ghost" data-act="close">Cancelar</button>
          <button type="submit" class="btn btn-primary">${submitLabel}</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelectorAll('[data-act="close"]').forEach((b) => b.addEventListener("click", close));
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
  const form = backdrop.querySelector("#dynForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const result = onSubmit(data, form);
    if (result !== false) close();
  });
  setTimeout(() => { const first = form.querySelector("input,select,textarea"); if (first) first.focus(); }, 30);
  return { close, form };
}

/* ---------- Modal informativo (solo lectura, p. ej. comprobante simulado) ---------- */
function openInfoModal({ title, bodyHtml, width = 480, footerHtml = "" }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop open";
  backdrop.innerHTML = `
    <div class="modal" style="max-width:${width}px">
      <div class="modal-header">
        <div class="modal-student-id"><div class="name">${title}</div></div>
        <button type="button" class="modal-close" data-act="close">${X_ICON}</button>
      </div>
      <div class="modal-body">
        ${bodyHtml}
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
          ${footerHtml}
          <button type="button" class="btn btn-ghost" data-act="close">Cerrar</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelectorAll('[data-act="close"]').forEach((b) => b.addEventListener("click", close));
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
  return { close, el: backdrop };
}

/* ---------- Foto: archivo local -> base64 ---------- */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Exportar CSV ---------- */
function exportCSV(filename, headers, rows) {
  const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const csv = [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("Archivo CSV descargado");
}

/* ---------- Paginación ---------- */
function paginate(array, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(array.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: array.slice(start, start + pageSize), page: safePage, totalPages, total: array.length };
}
function renderPaginationControls(containerEl, { page, totalPages, total, pageSize, onChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  containerEl.innerHTML = `
    <span>Mostrando ${from}–${to} de ${total}</span>
    <span style="display:flex;gap:10px;align-items:center">
      <button type="button" class="chip-btn" data-act="prev" ${page <= 1 ? "disabled" : ""}>‹ Anterior</button>
      <span>Página ${page} de ${totalPages}</span>
      <button type="button" class="chip-btn" data-act="next" ${page >= totalPages ? "disabled" : ""}>Siguiente ›</button>
    </span>`;
  containerEl.querySelector('[data-act="prev"]').addEventListener("click", () => onChange(page - 1));
  containerEl.querySelector('[data-act="next"]').addEventListener("click", () => onChange(page + 1));
}
