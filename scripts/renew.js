const { getExpiringOrders, renewOrder, getOrderPrice, updateState, checkBudget } = require('./stateStore');
const { performDNSVerification } = require('./soapClient');
const budget = require('./budget');

async function main() {
  let state = await getExpiringOrders();
  if (state.budgets.stopFlag) {
    await updateState(state, 'logs', { date: new Date().toISOString(), summary: '予算停止中。更新なし。' });
    return;
  }
  let targets = state.certificates.filter(cert => cert.status === 'Issue completed' && cert.expiresAt < '2026-06-10');
  let totalAmount = state.budgets.spentAmount;
  let totalCount = state.budgets.spentCount;
  for (let cert of targets) {
    let orderId = await renewOrder(cert);
    let price = await getOrderPrice(orderId);
    totalAmount += price;
    totalCount += 1;
    await performDNSVerification(cert.commonName);
    cert.status = 'Renewed';
    cert.price = price;
    cert.orderId = orderId;
  }
  let stopFlag = budget.check(totalAmount, totalCount, state.budgets.monthlyMaxAmount, state.budgets.monthlyMaxCount);
  state.budgets.spentAmount = totalAmount;
  state.budgets.spentCount = totalCount;
  state.budgets.stopFlag = stopFlag;
  await updateState(state, 'state');
  await updateState(state, 'logs', { date: new Date().toISOString(), summary: `${targets.length}件更新。予算残: ¥${state.budgets.monthlyMaxAmount - totalAmount}` });
}
main();
