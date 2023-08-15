import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";
import dotenv from "dotenv";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

dotenv.config();
const { JWT_SECRET_KEY } = process.env;
const AvatarDir = path.resolve("public", "avatars")

const singup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid()
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });

  const verifyEmail = createVerifyEmail({email, verificationCode});

  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({verificationCode});
  if(!user) {
  throw HttpError(404, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: null})

  res.status(200).json({
    message: "Verify Success"
  });
};

const resendVerifyEmail = async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(404, "Email not Found")
  }
  if (user.verify) {
    throw HttpError(400, "Email already verify")
  }
  const verifyEmail = createVerifyEmail({email, verificationCode: user.verificationCode});

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  })
}

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({ token, user:{ 
    email: user.email, subscription: user.subscription } });
};

const getCurrent = (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const singout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Singout ssucess",
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ result });
};

const updateAvatar = async(req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  await Jimp.read(tempUpload)
  .then((avatar) => {
    avatar.resize(250, 250);
  })
  .catch(err => {
    throw err;
  })

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.resolve(AvatarDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.resolve("avatars", filename);
  await User.findByIdAndUpdate(_id, {avatarURL});

  res.status(200).json({ avatarURL })
}

export default {
  singup: ctrlWrapper(singup),
  singin: ctrlWrapper(singin),
  getCurrent: ctrlWrapper(getCurrent),
  singout: ctrlWrapper(singout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
