import { Schema, model } from "mongoose";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegexp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

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

const Contact = model("contact", contactSchema);

export default Contact;