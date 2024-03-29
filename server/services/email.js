const nodemailer = require('nodemailer')

sendEmail = async (body, to, subject, credentials) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: credentials.email || process.env.gmailUserName,
      pass: credentials.password || process.env.gmailPassword,
    },
  })
  const recipients = to.toString()
  const mailOptions = {
    from: '"Graymatics" <noreply@graymatics.com>',
    to: recipients,
    subject: subject ? subject : 'New Mail From Graymatics',
    generateTextFromHTML: true,
    html: body,
  }
  const sent = await transporter.sendMail(mailOptions)
  if (sent) {
    console.log('Mail Sent Successfully')
  }

  return sent
}

sendOTP = async (code, user, credentials) => {
  const message = `<h3>Hi ${user.name},</h3>
          <p>Here's the OTP for verification: <strong>${code}</strong></p>
          <p>If you believe you did this in error, please ignore this email.</p>`

  const sentMail = await sendEmail(
    message,
    [user.email],
    'OTP Verification Code',
    credentials,
  )
  if (!sentMail) {
    return false
  }
  return true
}

sendVerificationMail = async (user, credentials) => {
  const message = `<h3>Hi ${user.name},</h3>
        <p>You have registered & verified <strong>successfully</strong></p>`

  const sentMail = await sendEmail(
    message,
    [user.email],
    'Verified Successfully',
    credentials,
  )
  if (!sentMail) {
    return false
  }
  return true
}

generateOTP = () => {
  const randomNumbers = '0123456789'
  let OTP = ''
  for (let i = 0; i < 5; i++) {
    OTP += randomNumbers.charAt(
      Math.floor(Math.random() * randomNumbers.length),
    )
  }
  return OTP
}

const emailService = {
  sendOTP: sendOTP,
  generateOTP: generateOTP,
  sendVerificationMail: sendVerificationMail,
}
module.exports = emailService
