import express from "express";
import authController from "../../controllers/auth-controller.js";
import {validateBody} from "../../decorators/validateBody.js";
import usersSchemas from "../../Schemas/users-schemas.js";

const authRouter = express.Router();

authRouter.post("/singup", validateBody(usersSchemas.userSignupSchema), authController.singup);

authRouter.post("/singin", validateBody(usersSchemas.userSigninSchema), authController.singin);
