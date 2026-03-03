import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const runtime = 'nodejs'; // Required for jsPDF

export async function GET(req: Request) {
    // ตรวจสอบความปลอดภัยด้วย Cron Secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // ใช้ service_role_key สำหรับ Cron Job เพื่อให้มีสิทธิ์อ่านข้อมูลทั้งหมดข้าม RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // 1. ดึงข้อมูลสถิติ
        const { data: students } = await supabase.from('profiles').select('created_at');
        const { data: vips } = await supabase.from('vip_requests').select('*').eq('status', 'approved');

        // 2. สร้างไฟล์ PDF
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Creative Investment Space - Weekly Report", 20, 20);
        doc.setFontSize(12);
        doc.text(`Report Generated: ${new Date().toLocaleDateString('th-TH')}`, 20, 30);

        const totalStudents = students?.length || 0;
        const totalVips = vips?.length || 0;
        const conversionRate = totalStudents > 0 ? ((totalVips / totalStudents) * 100).toFixed(2) : "0.00";

        // ใส่ตารางสถิติ
        autoTable(doc, {
            startY: 40,
            head: [['Metrics', 'Value']],
            body: [
                ['Total Students', totalStudents.toString()],
                ['Total VIP Members', totalVips.toString()],
                ['Conversion Rate', `${conversionRate}%`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [29, 78, 216] } // สีน้ำเงินสถาบัน
        });

        const pdfBase64 = doc.output('datauristring').split(',')[1];

        // 3. ส่งอีเมลพร้อมแนบไฟล์ PDF
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'CIS Admin <onboarding@resend.dev>', // ใช้อีเมล test ของ Resend ไปก่อนหากยังไม่มี domain ตัวเอง
                to: ['noomindy4@gmail.com'], // ส่งหาตัวเองแทน
                subject: '📊 สรุปรายงานประจำสัปดาห์ - Creative Investment Space',
                html: '<p>สวัสดี Mentor SpikeTrader รายงานสถิติสถาบันประจำสัปดาห์นี้พร้อมแล้วครับ</p>',
                attachments: [
                    {
                        filename: `weekly-report-${new Date().toISOString().split('T')[0]}.pdf`,
                        content: pdfBase64,
                    },
                ],
            });
            console.log("Email sent successfully.");
        } else {
            console.log("RESEND_API_KEY missing, skipping email.");
        }

        return NextResponse.json({ success: true, message: "Weekly report processed" });

    } catch (error) {
        console.error("Error generating report:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
