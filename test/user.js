/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = require("assert");
const server = require("../index");
const { MSG_TYPES } = require("../constants/types");
const {
  deleteOne,
} = require("../src/services/UserServices");

chai.should();
chai.use(chaiHttp);

const userData = {
  name: "John Doe",
  email: "johnDoe1@Test.com",
  password: "123456",
};

const otherUserData = {
  name: "Mary Jane",
  email: "maryJane@Test.com",
  password: "123456",
};

const incorrectLoginData = { email: "johnDoe1@Test.com", password: "123" };

let userId = null;
let otherUserId = null;
let userToken = null;

const userBaseUrl = "/api/v1/users";

const emailInLowerCase = userData.email.toLowerCase();
const otherEmailInLowerCase = otherUserData.email.toLowerCase();

describe("User Activity", () => {
  describe(`test POST route ${userBaseUrl}/register`, () => {
    it("it should register user account successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/register`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send(userData);

      res.should.have.status(201);
      res.body.should.have.property("message").and.is.equal(MSG_TYPES.CREATED);
      res.body.should.have.property("data");
      res.body.data.should.have
        .property("email")
        .and.is.equal(emailInLowerCase);
      res.body.data.should.have
        .property("account_balance")
        .and.is.equal("0.00");
      res.body.data.should.have.property("token");
      //set token for authentication
      userToken = res.body.data.token;
    }).timeout(10000);

    it("it should register other user account for test transfer successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/register`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send(otherUserData);

      res.should.have.status(201);
      res.body.should.have.property("message").and.is.equal(MSG_TYPES.CREATED);
      res.body.should.have.property("data");
      res.body.data.should.have
        .property("email")
        .and.is.equal(otherEmailInLowerCase);
      res.body.data.should.have
        .property("account_balance")
        .and.is.equal("0.00");

      //set other user id
      otherUserId = res.body.data.id;
    }).timeout(10000);

    it("it should fail when registering already registered email", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/register`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send(userData);

      res.should.have.status(409);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.EMAIL_EXIST);
    }).timeout(5000);
  });

  describe(`test POST route ${userBaseUrl}/login`, () => {
    it("it should login successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/login`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({ email: emailInLowerCase, password: userData.password });

      res.should.have.status(200);
      res.body.should.have.property("message").and.is.equal(MSG_TYPES.FETCHED);
      res.body.should.have.property("data");
      userToken = res.body.data.token;
      userId = res.body.data.id;
    }).timeout(5000);

    it("it should fail when logging in with incorrect details", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/login`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send(incorrectLoginData);

      res.should.have.status(409);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.INVALID_CREDENTIALS);
    }).timeout(5000);
  });

  describe(`test POST route ${userBaseUrl}/wallet/add-fund`, () => {
    it("it should fund current user wallet successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/add-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "50" });

      res.should.have.status(200);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.TRANSACTION_COMPLETED);
      res.body.should.have.property("data");
      res.body.data.should.have
        .property("account_balance")
        .and.is.equal("50.00");
    }).timeout(5000);
  });

  describe(`test POST route ${userBaseUrl}/wallet/transfer-fund`, () => {
    it("it should transfer fund from current user to other user wallet using their user id successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/transfer-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "20", userId: otherUserId });

      res.should.have.status(200);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.TRANSACTION_COMPLETED);
    }).timeout(5000);

    it("it should fail when user wants to transfer more than balance in wallet", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/transfer-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "100", userId: otherUserId });

      res.should.have.status(400);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.AMOUNT_EXCEEDS);
    }).timeout(5000);

    it("it should fail when user wants to transfer funds to his or her wallet", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/transfer-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "100", userId });

      res.should.have.status(409);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.SELF_FUNDING_FAILED);
    }).timeout(5000);

    it("it should fail when other user's id is incorrect", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/transfer-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "100", userId: "0x00www" });

      res.should.have.status(404);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.ID_NOT_FOUND);
    }).timeout(5000);

    it("it should check if other user account got the fund transfered to wallet, by logging in successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/login`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: otherEmailInLowerCase,
          password: otherUserData.password,
        });

      res.should.have.status(200);
      res.body.should.have.property("message").and.is.equal(MSG_TYPES.FETCHED);
      res.body.should.have.property("data");
      res.body.data.should.have
        .property("account_balance")
        .and.is.equal("20.00");
    }).timeout(5000);
  });

  describe(`test POST route ${userBaseUrl}/wallet/withdraw-fund`, () => {
    it("it should withdraw fund from current logged in user's wallet successfully", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/withdraw-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "10" });

      res.should.have.status(200);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.TRANSACTION_COMPLETED);
      res.body.should.have.property("data");
      res.body.data.should.have
        .property("account_balance")
        .and.is.equal("20.00");
    }).timeout(5000);

    it("it should fail when user wants to withdraw more than balance in wallet", async () => {
      const res = await chai
        .request(server.app)
        .post(`${userBaseUrl}/wallet/withdraw-fund`)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .set({ "x-access-token": `${userToken}` })
        .send({ amount: "100" });

      res.should.have.status(400);
      res.body.should.have
        .property("message")
        .and.is.equal(MSG_TYPES.AMOUNT_EXCEEDS);
    }).timeout(5000);
  });

  describe(`test function for deleting user`, () => {
    it("it should delete test user using user id", async () => {
      const user = await deleteOne({ id: userId });
      assert.strictEqual(true, user);
    }).timeout(5000);

    it("it should delete other test user using user id", async () => {
      const user = await deleteOne({ id: otherUserId });
      assert.strictEqual(true, user);
    }).timeout(5000);
  });
});
