import { Schema, model } from "mongoose";
import { emailRegexp, phoneRegexp } from "../constants/contact-constants.js";
import { handleSaveError, validateAtUpdate } from "./hooks.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        required: true,
    },
    phone: {
        type: String,
        match: phoneRegexp,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true });

contactSchema.pre("findOneAndUpdate", validateAtUpdate);
contactSchema.post("save", handleSaveError);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;