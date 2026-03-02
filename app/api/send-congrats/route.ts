import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { to_email } = await req.json();

        if (!to_email) {
            return NextResponse.json(
                { message: 'Missing recipient email address' },
                { status: 400 }
            );
        }

        const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificate of Completion</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Arial', sans-serif;
                  background-color: #030712; /* Tailwind gray-950 */
                  color: #e5e7eb; /* Tailwind gray-200 */
              }
              .container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #111827; /* Tailwind gray-900 */
                  border-radius: 16px;
                  overflow: hidden;
                  border: 1px solid #1f2937; /* Tailwind gray-800 */
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              }
              .header {
                  background: linear-gradient(to right, #064e3b, #022c22); /* Dark emerald gradient */
                  padding: 40px 20px;
                  text-align: center;
                  border-bottom: 2px solid #10b981; /* Tailwind emerald-500 */
              }
              .header h1 {
                  margin: 0;
                  color: #34d399; /* Tailwind emerald-400 */
                  font-size: 28px;
                  font-weight: 800;
                  text-transform: uppercase;
                  letter-spacing: 2px;
              }
              .content {
                  padding: 40px 30px;
                  text-align: left;
              }
              .content h2 {
                  color: #fca5a5;
                  font-size: 24px;
                  margin-top: 0;
                  background: linear-gradient(to right, #fbbf24, #d97706); /* Yellow text gradient */
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  display: inline-block;
              }
              .content p {
                  line-height: 1.6;
                  font-size: 16px;
                  color: #9ca3af; /* Tailwind gray-400 */
                  margin-bottom: 24px;
              }
              .highlight {
                  color: #fcd34d; /* Tailwind yellow-300 */
                  font-weight: bold;
              }
              .button-container {
                  text-align: center;
                  margin: 40px 0 20px 0;
              }
              .button {
                  background: linear-gradient(to right, #10b981, #059669); /* Emerald gradient */
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 32px;
                  border-radius: 8px;
                  font-weight: bold;
                  font-size: 16px;
                  display: inline-block;
                  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4);
              }
              .footer {
                  background-color: #030712; /* Tailwind gray-950 */
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #6b7280; /* Tailwind gray-500 */
                  border-top: 1px solid #1f2937;
              }
              .seal {
                  text-align: center;
                  margin-top: 30px;
              }
              .seal span {
                  display: inline-block;
                  width: 60px;
                  height: 60px;
                  line-height: 60px;
                  background: linear-gradient(135deg, #fbbf24, #b45309);
                  border-radius: 50%;
                  color: #111827;
                  font-weight: bold;
                  font-size: 10px;
                  text-transform: uppercase;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Trading LMS Masterclass</h1>
              </div>
              <div class="content">
                  <h2>Congratulations, Trader! 🏆</h2>
                  <p>
                      You have officially completed all the requirements for the 
                      <span class="highlight">Trading LMS Masterclass</span>. 
                      Your dedication to mastering the markets, understanding price action, and utilizing 
                      professional trading tools is truly outstanding.
                  </p>
                  <p>
                      Your verified Certificate of Completion is now permanently unlocked and available in your dashboard.
                      You are now equipped with the knowledge to navigate the financial markets with confidence.
                  </p>
                  
                  <div class="seal">
                      <span>✓ VERIFIED</span>
                  </div>

                  <div class="button-container">
                      <a href="http://localhost:3000/dashboard" class="button">View Your Certificate</a>
                  </div>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Trading LMS Masterclass. All rights reserved.</p>
                  <p>You received this email because you recently completed a course on our platform.</p>
              </div>
          </div>
      </body>
      </html>
    `;

        const data = await resend.emails.send({
            from: 'Trading LMS Masterclass <onboarding@resend.dev>',
            to: [to_email],
            subject: 'Congratulations on your Trading Masterclass Certification! 🏆',
            html: emailHtml,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error sending congratulatory email:", error);
        return NextResponse.json(
            { message: 'Failed to send email', error },
            { status: 500 }
        );
    }
}
