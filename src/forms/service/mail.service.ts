import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import { AnnualResubmitEmail } from 'src/config/annualResubmitEmail';
import { AnnualSubmitEmail } from 'src/config/annualSubmitEmail';
import { ProbationResubmitEmail } from 'src/config/probationResubmitEmail';
import { ProbationSubmitEmail } from 'src/config/probationSubmitEmail';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  async sendEmail(
    sendTo: string[],
    formType: string,
    resubmit: boolean,
    formId: string[]
  ): Promise<void> {
    console.log(formType+"..............")
    if (formType === 'Annual') {
      await Promise.all(
        sendTo.map(async (email, i) => {
          const mailOptions = {
            to: email,
            subject: resubmit
              ? 'Invite to resubmit survey'
              : 'Invite to submit survey',
            html: resubmit
              ? AnnualResubmitEmail(formId[i])
              : AnnualSubmitEmail(formId[i]),
          };

          try {
            const transporter = await mailConfig();
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${email}`);
          } catch (error) {
            console.error(`Failed to send email to ${email}: ${error.message}`);
          }
        })
      );
    }

    if (formType === 'Probation') {
      // Sử dụng Promise.all để gửi email song song
      await Promise.all(
        sendTo.map(async (email, i) => {
          const mailOptions = {
            to: email,
            subject: resubmit
              ? 'Invite to resubmit survey'
              : 'Invite to submit survey',
            html: resubmit
              ? ProbationResubmitEmail(formId[i])
              : ProbationSubmitEmail(formId[i]),
          };

          try {
            const transporter = await mailConfig();
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${email}`);
          } catch (error) {
            console.error(`Failed to send email to ${email}: ${error.message}`);
          }
        })
      );
    }
  }
}

async function mailConfig() {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  const accessTokenObject = await oauth2Client.getAccessToken();
  const accessToken = accessTokenObject?.token;

  if (!accessToken) {
    throw new Error('Failed to retrieve access token');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transporter;
}
