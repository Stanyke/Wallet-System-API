const MSG_TYPES = Object.freeze({
  DELETED: "Resource Deleted Successfully",
  UPDATED: "Resource Updated Successfully",
  CREATED: "Resource Created Successfully",
  FETCHED: "Resource Fetched Successfully",
  DUPLICATE: "Resource Already Exist",
  ONE_OR_MORE_DUPLICATE: "One Or More Resource Already Exist",
  NOT_FOUND: "Resource Not Found",
  NOT_ALLOWED: "Resource Not Allowed",
  ID_NOT_FOUND: "ID not found",
  NO_TOKEN: "No token provided",
  INVALID_TOKEN: "Invalid token provided",
  LOGGED_IN: "Successfully logged in",
  EMAIL_EXIST: "Email address already in use",
  INVALID_CREDENTIALS: "Invalid credentials",
  FUND_FAILED: "Funding failed",
  SELF_FUNDING_FAILED: "Self funding failed",
  TRANSACTION_FAILED: "Transaction failed",
  TRANSACTION_COMPLETED: "Transaction completed",
  AMOUNT_EXCEEDS: "Amount exceeds wallet balance",
  PERMISSION: "You don't have enough permission to perform this action",
  SERVER_ERROR: (msg) => {
    return msg || "An internal error occurred. Try again";
  },
});

module.exports = { MSG_TYPES };
