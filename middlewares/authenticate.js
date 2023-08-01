import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();
const {JWT_SECRET_KEY} = process.env;

const authenticate = async( req, res, next) => {
   const { authorization } = req.headers;
   const [bearer, token] = authorization.split(' ');
   if(bearer !== "Bearer") {
       throw HttpError(401);
   }
    try {
      const {id} = jwt.verify(token, JWT_SECRET_KEY);
      const user = await User.findById(id);
      if(!user || !user.token) {
        throw HttpError(401);
      }
      req.user = user;
      next();
   }
    catch(error) {
      throw HttpError(401, error.message);
   }
}

export default ctrlWrapper(authenticate);