const uniqueNumericId = (d) => {
  var dat_e = new Date();
  var uniqu_e = (Math.random() * 1000 + "").slice(-4);

  dat_e = dat_e
    .toISOString()
    .replace(/[^0-9]/g, "")
    .replace(dat_e.getFullYear(), uniqu_e);
  if (d == dat_e) dat_e = uniqueNumericId(dat_e);
  return dat_e;
};

module.exports = {
  uniqueNumericId,
};
