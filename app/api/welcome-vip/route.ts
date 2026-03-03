import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json();

        const data = await resend.emails.send({
            from: 'Creative Investment <onboarding@resend.dev>', // ในอนาคตเปลี่ยนเป็นโดเมนของคุณได้
            to: [email],
            subject: 'ยินดีต้อนรับสู่ครอบครัว VIP - Creative Investment Space 💎',
            html: `
        <div style="font-family: sans-serif; background-color: #020617; color: #ffffff; padding: 40px; border-radius: 20px;">
          <h1 style="color: #ef4444;">Welcome to VIP, ${name}!</h1>
          <p>ยินดีด้วย! บัญชีของคุณได้รับการอัปเกรดเป็นระดับ <strong>VIP Member</strong> เรียบร้อยแล้ว</p>
          <div style="background-color: #0f172a; padding: 20px; border-radius: 10px; border: 1px solid #1e293b;">
            <p style="margin: 0;">✨ <strong>สิทธิ์ที่คุณได้รับทันที:</strong></p>
            <ul style="color: #94a3b8;">
              <li>เข้าถึงบทเรียน SMC & ICT Mastery ทั้งหมด</li>
              <li>ระบบตรวจการบ้านแบบตัวต่อตัวจาก Mentor</li>
              <li>สิทธิ์เข้าใช้ Trading Tools ขั้นสูง</li>
            </ul>
          </div>
          <br />
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
             style="background: linear-gradient(to right, #1d4ed8, #dc2626); color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold;">
             เข้าสู่หน้า Dashboard
          </a>
          <p style="margin-top: 30px; font-size: 12px; color: #475569;">หากคุณมีคำถาม สอบถาม Mentor ได้ทันทีผ่านระบบหลังบ้านครับ</p>
        </div>
      `,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
