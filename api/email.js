'use strict'
const hbs = require('hbs')
const fs = require('fs')
const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
async function sendWelcomeEmail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  })

  const name = 'Robin James Kerrison'
  const templateFile = fs.readFileSync(
    __dirname + '/../views/emails/welcome.hbs',
    'utf8'
  )

  const html = hbs.handlebars.compile(templateFile)({ username: 'rjkerrison' })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Ciaocine" <foo@ciaocine.com>', // sender address
    to: 'bob@bobmail.bob', // list of receivers
    subject: `Hello ${name}`, // Subject line
    html,
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {
  sendWelcomeEmail,
}
