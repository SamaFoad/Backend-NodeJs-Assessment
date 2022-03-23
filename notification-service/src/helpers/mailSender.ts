import nodemailer from 'nodemailer';
import path from 'path';
import {NotificationCreationAttributes}  from '../infrastructure/models/notification-model';
import { Logger } from 'logging';
// import * as utils from '../utils/utils';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');

// Configuración de handlebars
const hbsConfig = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.join(__dirname, '../views/'),
    layoutsDir: path.join(__dirname, '../views/'),
    defaultLayout: ''
  },
  viewPath: path.join(__dirname, '../views/'),
  extName: '.hbs'
};

// Configuración transportador NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: { user: process.env.SENDER_EMAIL, pass: process.env.EMAIL_PASSWORD }
});

/**
 * Envia un correo al administrador y copia a los involucrados en el evento
 * @param incident : Incident
 */
const mailSender = async function sendEmail(notification: NotificationCreationAttributes, dateNow:string) {
  transporter.use('compile', hbs(hbsConfig));

  const email = {
    from: notification.sender,
    to: notification.reciever,
    cc: '',
    subject: '👀 Hello, ' + notification.reciever,
    template: 'automatedEmailTemplate',
    context: { notification, dateNow }
  };
  await transporter.sendMail(email)
}

export default mailSender;