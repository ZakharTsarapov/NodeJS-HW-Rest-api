import Joi from "joi";
import { subList } from "../constants/user-constants.js";

import { emailRegexp } from "../constants/user-constants.js";

const userSignupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const updateSubcriptionSchema = Joi.object({
    subscription: Joi.string()
    .valid(...subList)
    .required(),
});

const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})

export default {
    userSignupSchema,
    userSigninSchema,
    updateSubcriptionSchema,
    userEmailSchema,
}