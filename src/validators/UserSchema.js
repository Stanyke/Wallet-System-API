const Joi = require("joi");

const UserRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().lowercase().required(),
  password: Joi.string().required(),
});

const UserLoginSchema = Joi.object({
  email: Joi.string().lowercase().required(),
  password: Joi.string().required(),
});

const FundWalletSchema = Joi.object({
  amount: Joi.string().required(),
});

const TransferWalletFundSchema = Joi.object({
  amount: Joi.string().required(),
  userId: Joi.string().required(),
});

const UserIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  UserRegistrationSchema,
  UserIdSchema,
  UserLoginSchema,
  FundWalletSchema,
  TransferWalletFundSchema,
};
