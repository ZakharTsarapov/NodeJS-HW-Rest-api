import express from "express";
import authController from "../../controllers/auth-controller.js";
import {validateBody} from "../../decorators/index.js";
import usersSchemas from "../../Schemas/users-schemas.js";
import {authenticate, upload} from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/singup", validateBody(usersSchemas.userSignupSchema), authController.singup);

authRouter.post("/singin", validateBody(usersSchemas.userSigninSchema), authController.singin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/singout", authenticate, authController.singout);

authRouter.patch("/users", authenticate, validateBody(usersSchemas.updateSubcriptionSchema), authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post("/verify", validateBody(usersSchemas.userEmailSchema), authController.resendVerifyEmail);

export default authRouter;