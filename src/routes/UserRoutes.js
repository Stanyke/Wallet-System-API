const router = require("express").Router();
const userCtrl = require("../controllers/UserController");
const joiValidator = require("../validators/index");
const { identify } = require("../middlewares/authMiddleware");
const {
  UserRegistrationSchema,
  UserIdSchema,
  UserLoginSchema,
  FundWalletSchema,
  TransferWalletFundSchema
} = require("../validators/UserSchema");

module.exports = function () {
  router.post(
    "/users/register",
    joiValidator(UserRegistrationSchema),
    userCtrl.register
  );

  router.post("/users/login", joiValidator(UserLoginSchema), userCtrl.login);

  router.post(
    "/users/wallet/add-fund",
    joiValidator(FundWalletSchema),
    identify,
    userCtrl.fundWallet
  );

  router.post(
    "/users/wallet/transfer-fund",
    joiValidator(TransferWalletFundSchema),
    identify,
    userCtrl.transferWalletFund
  );

  router.post(
    "/users/wallet/withdraw-fund",
    joiValidator(FundWalletSchema),
    identify,
    userCtrl.withdrawWalletFund
  );

  return router;
};
