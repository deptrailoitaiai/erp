import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { AnnualReportForm } from '../config/annualForm';
import { AdminRepository } from 'src/admin/repositories/admin.repository';
import { informationsType } from './annualForm.service';
import { ProbationReportForm } from '../config/probationForm';
import { ResubmitAnnualReportForm } from '../config/annualResubmitForm';
import { ResubmitProbationReportForm } from '../config/probationResumitForm';
dotenv.config();

@Injectable()
export class MailService {
  constructor(private readonly adminRepo: AdminRepository) {}

  async annualReportFormAnnouncement(
    informations: informationsType[],
    formType: string,
    status?: boolean,
  ) {
    if (status) {
      console.log('............')
      for (let i = 0; i < informations.length; i++) {
        const mailOptions = {
          to: informations[i].email,
          subject: 'Invite to resubmit servay',
          html:
            formType == 'annual'
              ? ResubmitAnnualReportForm(informations[i].id)
              : ResubmitProbationReportForm(informations[i].id),
        };

        const transporter = await mailConfig();
        await transporter.sendMail(mailOptions);
      }
      return;
    }
    for (let i = 0; i < informations.length; i++) {
      const mailOptions = {
        to: informations[i].email,
        subject: 'Invite to complete servay',
        html:
          formType == 'annual'
            ? AnnualReportForm(informations[i].id)
            : ProbationReportForm(informations[i].id),
      };

      const transporter = await mailConfig();
      await transporter.sendMail(mailOptions);
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
