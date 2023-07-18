import Joi from "joi";

const addContactsSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().min(10).max(13).required()
})

export default {
    addContactsSchema,
}