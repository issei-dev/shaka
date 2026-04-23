async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

async function renderDashboard() {
  const state = await loadJSON('data/state.json');
  const logs = await loadJSON('data/logs.json');
  const alerts = await loadJSON('data/alerts.json');

  // 予算
  document.getElementById('budget-info').innerHTML =
    `月額上限: ¥${state.budgets.monthlyMaxAmount} / ${state.budgets.monthlyMaxCount}件<br>
     使用済: ¥${state.budgets.spentAmount} / ${state.budgets.spentCount}件<br>
     停止: ${state.budgets.stopFlag ? '停止中' : '稼働中'}`;

  // 証明書一覧
  document.getElementById('cert-table').innerHTML = state.certificates.map(cert =>
    `<tr>
      <td>${cert.commonName}</td>
      <td>${cert.productType}</td>
      <td>${cert.expiresAt}</td>
      <td>${cert.status}</td>
      <td>¥${cert.price} ${cert.currency}</td>
    </tr>`
  ).join('');

  // ログ
  document.getElementById('log-view').textContent =
    logs.executions.map(log =>
      `${log.date}: ${log.summary}`
    ).join('\n');

  // 警告
  document.getElementById('alert-view').textContent =
    alerts.messages.join('\n');
}

window.onload = renderDashboard;
