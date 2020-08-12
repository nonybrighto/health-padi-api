/* eslint-disable class-methods-use-this */
import nodemailer from 'nodemailer';
import config from '../../config/config';

class EmailHelper {
  recoveryEmail() {
    return config.get('no-reply-email');
  }

  userContactEmail() {
    return config.get('no-reply-email');
  }

  async sendEmail({ from, to, subject, text = null, html = null }) {
    let mailOptions = {
      from,
      to,
      subject
    };

    if (text) {
      mailOptions = { text, ...mailOptions };
    }
    if (html) {
      mailOptions = { html, ...mailOptions };
    }

    try {
      await this.createTransporter().sendMail(mailOptions);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return false;
    }
  }

  createTransporter() {
    const transporter = nodemailer.createTransport({
      host: config.get('email-host'),
      port: 465,
      secure: true,
      auth: {
        user: config.get('no-reply-email'),
        pass: config.get('email-password')
      }
    });

    return transporter;
  }
}

export default new EmailHelper();
