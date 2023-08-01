import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import "dotenv/config";

const {JWT_SECRET_KEY} = process.env;

const singup = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription,
    })
}

const singin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({ token, })
}

const getCurrent = (req, res) => {
   const {name, email} = req.user;

   res.json({
    name,
    email,
   })
}

const singout = async ( req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});
    res.json({
        message: "Singout ssucess"
    })
}

const updateSubscription = async (req, res) => {
    const { _id } = req.user;
  
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ result });
  };

export default {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    singout: ctrlWrapper(singout),
    updateSubscription: ctrlWrapper(updateSubscription),
}