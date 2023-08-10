import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const { SENDGRID_API_KEY, SENDGRID_FROM} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async data => {
  const email = { ...data, from: SENDRGID_FROM };
  await sgMail.send(email);

  return true;
};

export default sendEmail;