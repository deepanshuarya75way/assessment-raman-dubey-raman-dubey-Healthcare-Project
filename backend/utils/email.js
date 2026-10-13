import nodemailer from 'nodemailer'

// Create a transporter using Gmail (or any SMTP service)
// For development, we use Ethereal (fake SMTP) if no credentials are set
let transporter = null

const getTransporter = async () => {
  if (transporter) return transporter

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production: use real SMTP
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  } else {
    // Development: use Ethereal test account
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
    console.log('📧 Using Ethereal test email account:', testAccount.user)
  }

  return transporter
}

// Send booking confirmation email
export const sendBookingConfirmation = async (userEmail, userName, doctorName, slotDate, slotTime) => {
  try {
    const transport = await getTransporter()

    const mailOptions = {
      from: `"DocConnect" <${process.env.EMAIL_USER || 'noreply@docconnect.com'}>`,
      to: userEmail,
      subject: '✅ Appointment Confirmed — DocConnect',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fdff; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">DocConnect</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your Healthcare Partner</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 32px;">
            <h2 style="color: #1B1B2F; margin: 0 0 16px;">Appointment Confirmed! 🎉</h2>
            <p style="color: #4A5568; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
            <p style="color: #4A5568; line-height: 1.6;">Your appointment has been successfully booked. Here are the details:</p>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(0,119,182,0.1);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-size: 14px;">Doctor</td>
                  <td style="padding: 8px 0; color: #1B1B2F; font-weight: 600; text-align: right;">${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-size: 14px;">Date</td>
                  <td style="padding: 8px 0; color: #1B1B2F; font-weight: 600; text-align: right;">${slotDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #718096; font-size: 14px;">Time</td>
                  <td style="padding: 8px 0; color: #1B1B2F; font-weight: 600; text-align: right;">${slotTime}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #718096; font-size: 13px; line-height: 1.6;">
              If you need to cancel or reschedule, please visit your appointments page on DocConnect.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f0f9ff; padding: 20px; text-align: center; border-top: 1px solid rgba(0,119,182,0.1);">
            <p style="color: #718096; font-size: 12px; margin: 0;">© 2024 DocConnect. All rights reserved.</p>
          </div>
        </div>
      `
    }

    const info = await transport.sendMail(mailOptions)

    // For development, log the preview URL
    if (!process.env.EMAIL_USER) {
      console.log('📧 Preview email URL:', nodemailer.getTestMessageUrl(info))
    }

    return info
  } catch (error) {
    console.error('Email sending failed:', error.message)
    // Don't throw — email failure shouldn't break the booking flow
  }
}

// Send cancellation email
export const sendCancellationEmail = async (userEmail, userName, doctorName, slotDate, slotTime) => {
  try {
    const transport = await getTransporter()

    const mailOptions = {
      from: `"DocConnect" <${process.env.EMAIL_USER || 'noreply@docconnect.com'}>`,
      to: userEmail,
      subject: '❌ Appointment Cancelled — DocConnect',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fdff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">DocConnect</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1B1B2F; margin: 0 0 16px;">Appointment Cancelled</h2>
            <p style="color: #4A5568;">Hi <strong>${userName}</strong>,</p>
            <p style="color: #4A5568;">Your appointment with <strong>${doctorName}</strong> on <strong>${slotDate}</strong> at <strong>${slotTime}</strong> has been cancelled.</p>
            <p style="color: #718096; font-size: 13px;">You can book a new appointment anytime on DocConnect.</p>
          </div>
          <div style="background: #f0f9ff; padding: 20px; text-align: center; border-top: 1px solid rgba(0,119,182,0.1);">
            <p style="color: #718096; font-size: 12px; margin: 0;">© 2024 DocConnect. All rights reserved.</p>
          </div>
        </div>
      `
    }

    const info = await transport.sendMail(mailOptions)

    if (!process.env.EMAIL_USER) {
      console.log('📧 Preview cancellation email URL:', nodemailer.getTestMessageUrl(info))
    }

    return info
  } catch (error) {
    console.error('Cancellation email failed:', error.message)
  }
}
