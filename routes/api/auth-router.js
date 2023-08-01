import express from "express";
import authController from "../../controllers/auth-controller.js";
import {validateBody} from "../../decorators/index.js";
import usersSchemas from "../../Schemas/users-schemas.js";
import {authenticate, upload} from "../../middlewares/index.js";
import fs from "fs/promises";
import path from "path";

const authRouter = express.Router();

authRouter.post("/singup", validateBody(usersSchemas.userSignupSchema), authController.singup);

authRouter.post("/singin", validateBody(usersSchemas.userSigninSchema), authController.singin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/singout", authenticate, authController.singout);

authRouter.patch("/users", authenticate, validateBody(usersSchemas.updateSubcriptionSchema), authController.updateSubscription);


const AvatarDir = path.resolve("public", "avatars")
authRouter.patch("/avatars", authenticate, upload.single("avatar", async(req, res) => {
    const {path: tempUpload, originalname} = req.file;
    const resultUpload = path.resolve(AvatarDir, originalname);
    await fs.rename(tempUpload, resultUpload);
    const avatarUrl = path.resolve("public", "avatars", originalname);
}))


export default authRouter;