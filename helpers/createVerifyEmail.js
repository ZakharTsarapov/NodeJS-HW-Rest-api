import dotenv from "dotenv";

dotenv.config();
const { BASE_URL } = process.env;

const createVerifyEmail = ({email, verificationCode}) => {
    const verifyEmail = {
        to: email,
        subject: "Verify Email",
        html: `<a href="${BASE_URL}/api/auth/verify/${user.verificationCode}" target="_blank">Click verify email</a>`,
      }

      return verifyEmail;
}

export default createVerifyEmail;