import {Schema, model} from "mongoose";
import {handleSaveError, validateAtUpdate} from "./hooks.js";
import { emailRegexp, subList } from "../constants/user-constants.js";

const userSchema = new Schema ({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "password is required"]
    },
    token: {
        type: String,
        default: null,
    },
    subscription: {
        type: String,
        enum: subList,
        default: "starter",
    },
}, {versionKey: false, timestamps: true});

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;