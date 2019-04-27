/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

import * as nodemailer from "nodemailer";
import { MailOptions as SESMailOptions } from "nodemailer/lib/ses-transport";
import { renderFile } from "pug";
import { APP_MODE, APP_PRODUCTION, APP_SES_OPTIONS } from "./environment";

export { MailOptions, MailReason, sendMail };

interface MailOptions extends SESMailOptions {
  html?: string;
  reason?: MailReason | string;
  returning?: boolean;
  subject: string;
  template?: string;
  templateData?: any;
  to: any; // @fixxxme(douggr) `any` is not acceptable
}

enum MailReason {
  ACCOUNT_CREATED = 1,
  ACCOUNT_IMPORTANT_CHANGES = 2,
  ANNOUNCEMENT = 3,
}

const sendMail = async(
  message: MailOptions,
  callback?: (err: Error | null, info: any) => void,
): Promise<any> => {
  if (message.html && message.template) {
    throw new Error(
      "you should fill either `html` or `template` options, but not both",
    );
  }

  //
  // don't send e-mails while testing, but yet simulate some delay
  if (APP_MODE === "test") {
    return new Promise((resolve) => setTimeout(resolve, 200));
  }

  const originalMessage = {};
  const ses = nodemailer.createTransport(APP_SES_OPTIONS);

  if (!APP_PRODUCTION) {
    Object.assign(originalMessage, message);

    Object.assign(message, {
      bcc: undefined,
      cc: undefined,
      subject: `[${APP_MODE} APP] ${message.subject}`,
      to: "DL2 DEVOPS <staging-app@dl2.dev>",
    });
  }

  Object.assign(message, {
    from: message.from || "no-reply@dl2.dev",
    html:
      message.html ||
      renderFile(`${__dirname}/templates/email/${message.template}.pug`, {
        ...message.templateData,
        originalMessage,
        production: APP_PRODUCTION,
        reason: message.reason || MailReason.ACCOUNT_IMPORTANT_CHANGES,
      }),
    to: message.to,
  });

  if (message.returning) {
    return await message.html;
  }

  if (!callback) {
    // tslint:disable-next-line no-console
    callback = (err: Error | null, info) => console.log(info || err);
  }

  return ses.sendMail(message, callback);
};
