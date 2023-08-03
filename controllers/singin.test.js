/*

1. res status 200.
2. res return token.
3. res return obj user with 2 fields email and subscription.

*/

import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import authController from "./auth-controller.js";

dotenv.config();
const { DB_HOST, PORT } = process.env;

describe("login test", () => {
 
  beforeAll(async() => {
   await mongoose
      .connect(DB_HOST)
      .then(() => {
        app.listen(PORT, () => {
          console.log(`Server running. Use our API on port: ${PORT}`);
        });
      })
      .catch((error) => {
        process.exit(1);
      });
  });

  afterAll(async() => {
    await mongoose
    .disconnect(DB_HOST)
  })

  test("res status 200, return token and user object with 2 fileds email and subscription", async() => {
    const response = await request(app).post("/api/auth/singin", authController.singin).send({ email: "Test@gmail.com", password: "123456"});
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("token")
    expect(response.body).toMatchObject({
        user: {
            email: expect.any(String),
            subscription: expect.any(String),
        }
    })
  });
});
