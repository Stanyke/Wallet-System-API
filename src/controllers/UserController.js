const bcrypt = require("bcrypt");
const UserService = require("../services/UserServices");
const { appResponse } = require("../../lib/appResponse");
const { MSG_TYPES } = require("../../constants/types");
const { uniqueNumericId } = require("../utils/tokens");
const { generateToken } = require("../utils/authTokenExplorer");

class UserCtrl {
  //Create a user
  async register(req, res) {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();
      req.body.email = email;
      const getUser = await UserService.findOne({ email });
      if (getUser) return appResponse(res, 409, MSG_TYPES.EMAIL_EXIST);

      //hash password
      req.body.password = await bcrypt.hash(password, 10);
      req.body.id = uniqueNumericId();

      const user = await UserService.register(req.body);
      const token = await generateToken(user);
      const data = { ...user, token };

      return appResponse(res, 201, MSG_TYPES.CREATED, data);
    } catch (err) {
      return appResponse(res, 500, MSG_TYPES.SERVER_ERROR(err));
    }
  }

  //login user
  async login(req, res) {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();

      const user = await UserService.findOne({ email }, true);
      if (!user) return appResponse(res, 409, MSG_TYPES.INVALID_CREDENTIALS);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return appResponse(res, 409, MSG_TYPES.INVALID_CREDENTIALS);

      //remove password from user
      delete user.password;

      const token = await generateToken(user);
      const data = { ...user, token };

      return appResponse(res, 200, MSG_TYPES.FETCHED, data);
    } catch (err) {
      return appResponse(res, 500, MSG_TYPES.SERVER_ERROR(err));
    }
  }

  //fund user wallet
  async fundWallet(req, res) {
    try {
      let { amount } = req.body;

      //use user id based on auth token
      const userId = req.auth.id;

      //add previous amount to new amount
      amount = Number(amount) + Number(req.auth.account_balance);

      const fundAcct = await UserService.updateWallet(amount, { id: userId });
      if (!fundAcct) return appResponse(res, 400, MSG_TYPES.FUND_FAILED);

      const user = await UserService.findOne({ id: userId });

      return appResponse(res, 200, MSG_TYPES.TRANSACTION_COMPLETED, user);
    } catch (err) {
      return appResponse(res, 500, MSG_TYPES.SERVER_ERROR(err));
    }
  }

  //tranfer wallet funds
  async transferWalletFund(req, res) {
    try {
      let { amount, userId } = req.body;
      amount = Number(amount);
      const currentUserWalletBalance = Number(req.auth.account_balance);
      const currentUserId = req.auth.id;

      //cancel self funding transaction
      if (userId == currentUserId)
        return appResponse(res, 409, MSG_TYPES.SELF_FUNDING_FAILED);

      const user = await UserService.findOne({ id: userId });
      if (!user) return appResponse(res, 404, MSG_TYPES.ID_NOT_FOUND);

      //check if user has up to amount to transfer
      if (amount > currentUserWalletBalance)
        return appResponse(res, 400, MSG_TYPES.AMOUNT_EXCEEDS);

      //make transfer to user id
      const transferFund = await UserService.updateWallet(amount, {
        id: userId,
      });
      if (!transferFund) return appResponse(res, 400, MSG_TYPES.FUND_FAILED);

      //remove amount from current user wallet balance
      const newUserWalletBalance = currentUserWalletBalance - amount;
      const removeFund = await UserService.updateWallet(newUserWalletBalance, {
        id: currentUserId,
      });

      if (!removeFund) {
        await UserService.updateWallet(currentUserWalletBalance, {
          id: currentUserId,
        });
        return appResponse(res, 400, MSG_TYPES.TRANSACTION_FAILED);
      }

      return appResponse(res, 200, MSG_TYPES.TRANSACTION_COMPLETED, removeFund);
    } catch (err) {
      return appResponse(res, 500, MSG_TYPES.SERVER_ERROR(err));
    }
  }

  //widthdraw user wallet
  async withdrawWalletFund(req, res) {
    try {
      let { amount } = req.body;
      const currentUserWalletBalance = Number(req.auth.account_balance);

      //use user id based on auth token
      const userId = req.auth.id;

      //check if user has up to amount to withdraw
      if (amount > currentUserWalletBalance)
        return appResponse(res, 400, MSG_TYPES.AMOUNT_EXCEEDS);

      //add previous amount to new amount
      amount = Number(req.auth.account_balance) - Number(amount);

      const fundAcct = await UserService.updateWallet(amount, { id: userId });
      if (!fundAcct) return appResponse(res, 400, MSG_TYPES.FUND_FAILED);

      const user = await UserService.findOne({ id: userId });

      return appResponse(res, 200, MSG_TYPES.TRANSACTION_COMPLETED, user);
    } catch (err) {
      return appResponse(res, 500, MSG_TYPES.SERVER_ERROR(err));
    }
  }
}

module.exports = new UserCtrl();
