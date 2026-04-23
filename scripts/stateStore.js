const fs = require('fs');
const path = require('path');
const api = require('./soapClient');

exports.getExpiringOrders = async function() {
  // API: GetOrderByExpirationDateで取得
  // ここではローカルJSONを読み込む例
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data/state.json')));
};

exports.renewOrder = async function(cert) {
  // API: DVOrder or DVDNSOrder
  return await api.orderDV(cert.commonName, cert.productType);
};

exports.getOrderPrice = async function(orderId) {
  // API: GetOrderByOrderIDでPrice/Currency取得
  return await api.getPrice(orderId);
};

exports.updateState = async function(state, type, log) {
  if (type === 'state') {
    fs.writeFileSync(path.join(__dirname, '../docs/data/state.json'), JSON.stringify(state, null, 2));
  } else if (type === 'logs') {
    let logs = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data/logs.json')));
    logs.executions.push(log);
    fs.writeFileSync(path.join(__dirname, '../docs/data/logs.json'), JSON.stringify(logs, null, 2));
  }
};
