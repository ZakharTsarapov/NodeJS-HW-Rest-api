import Joi from "joi";
import { emailRegexp, phoneRegexp } from "../constants/contact-constants.js";

const addContactsSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    favorite: Joi.boolean()
})

const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

export default {
    addContactsSchema,
    contactUpdateFavoriteSchema,
}