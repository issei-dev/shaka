exports.check = function(totalAmount, totalCount, maxAmount, maxCount) {
  return totalAmount >= maxAmount || totalCount >= maxCount;
};
