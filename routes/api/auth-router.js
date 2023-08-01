import express from "express";
import authController from "../../controllers/auth-controller.js";
import {validateBody} from "../../decorators/index.js";
import usersSchemas from "../../Schemas/users-schemas.js";
import {authenticate} from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/singup", validateBody(usersSchemas.userSignupSchema), authController.singup);

authRouter.post("/singin", validateBody(usersSchemas.userSigninSchema), authController.singin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/singout", authenticate, authController.singout);

authRouter.patch("/users", authenticate, validateBody(usersSchemas.updateSubcriptionSchema), authController.updateSubscription);


export default authRouter;