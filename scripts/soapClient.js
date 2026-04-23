exports.orderDV = async function(commonName, productType) {
  // SOAP: DVDNSOrder or DVOrder
  // 実際はAPI呼び出し
  return 'newOrderId123';
};

exports.getPrice = async function(orderId) {
  // SOAP: GetOrderByOrderID
  // 実際はAPI呼び出し
  return 12000;
};

exports.performDNSVerification = async function(commonName) {
  // DNS TXTレコード設置状況確認
  // 実際はAPI呼び出し
  return true;
};
