async function safeLoadJSON(path, fallback) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch (e) {
    return fallback;
  }
}

function daysBetween(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return Math.ceil((db - da) / 86400000);
}

function yen(n) {
  try { return new Intl.NumberFormat("ja-JP").format(n); }
  catch { return String(n); }
}

async function renderDashboard() {
  // ✅ state.jsonは必須
  const state = await safeLoadJSON("data/state.json", null);
  if (!state) {
    const el = document.getElementById("alert-view");
    if (el) el.textContent = "state.json を読み込めませんでした（data/state.json を確認してください）";
    return;
  }

  // ✅ logs/alertsは無くてもOK（fallback）
  const logs = await safeLoadJSON("data/logs.json", { executions: [] });
  const alerts = await safeLoadJSON("data/alerts.json", { messages: [] });

  // ---------- 予算 ----------
  const b = state.budgets || {};
  const budgetInfo = document.getElementById("budget-info");
  if (budgetInfo) {
    budgetInfo.innerHTML = `
      <div>月額上限：¥${yen(b.monthlyMaxAmount ?? 0)} ／ ${b.monthlyMaxCount ?? 0}件</div>
      <div>使用済：¥${yen(b.spentAmount ?? 0)} ／ ${b.spentCount ?? 0}件</div>
      <div>状態：<strong>${b.stopFlag ? "停止中" : "稼働中"}</strong>（手動リセット：${b.manualResetAt ?? "-" }）</div>
    `;
  }

  // ---------- 証明書一覧 ----------
  const tbody = document.getElementById("cert-table");
  if (tbody) {
    const certs = state.certificates || [];
    const today = new Date().toISOString().slice(0, 10);

    tbody.innerHTML = certs.map(c => {
      const rem = c.expiresAt ? daysBetween(today, c.expiresAt) : "";
      const remText = (typeof rem === "number")
        ? (rem >= 0 ? `${rem}日` : `期限切れ(${Math.abs(rem)}日超過)`)
        : "";

      return `
        <tr>
          <td><strong>${c.commonName ?? "-"}</strong></td>
          <td>${c.productType ?? "-"}</td>
          <td>${c.expiresAt ?? "-"}</td>
          <td>${remText}</td>
          <td>${c.status ?? "-"}</td>
          <td>${c.currency ?? ""} ${yen(c.price ?? 0)}</td>
          <td style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">${c.orderId ?? "-"}</td>
        </tr>
      `;
    }).join("");
  }

  // ---------- ログ ----------
  const logView = document.getElementById("log-view");
  if (logView) {
    const lines = (logs.executions || []).slice().reverse().map(l => {
      return `${l.date ?? "-"}  ${l.summary ?? ""}`;
    });
    logView.textContent = lines.length ? lines.join("\n") : "ログはまだありません";
  }

  // ---------- 警告 ----------
  const alertView = document.getElementById("alert-view");
  if (alertView) {
    const msgs = alerts.messages || [];
    if (b.stopFlag) msgs.unshift("予算上限により自動更新は停止中です。手動リセットしてください。");
    alertView.textContent = msgs.length ? msgs.join("\n") : "警告はありません";
  }
}

window.addEventListener("DOMContentLoaded", renderDashboard);
``
