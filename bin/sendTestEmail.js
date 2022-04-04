const { sendWelcomeEmail } = require('../api/email')

sendWelcomeEmail().catch(console.error)
