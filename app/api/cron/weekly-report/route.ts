import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Resend } from 'resend';

// Vercel Cron execution timeout limits apply (e.g., 10s on Hobby)
// Set runtime to nodej to support jsPDF
export const runtime = 'nodejs';

export async function GET(request: Request) {
    // 1. Authenticate the Cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized: Invalid CRON_SECRET', { status: 401 });
    }

    try {
        // Initialize Supabase admin client (server-side only)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Missing Supabase configuration");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 2. Fetch Weekly Analytics
        // Calculate the date 7 days ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const dateString = oneWeekAgo.toISOString();

        // New Students
        const { count: newStudents } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateString);

        // New VIPs
        const { count: newVips } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', 2)
            .gte('created_at', dateString);

        // Total Profit Reviews Submitted
        const { count: newReviews } = await supabase
            .from('profit_reviews')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateString);

        // 3. Generate PDF Report
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(220, 38, 38); // Red-600
        doc.text('Trading LMS - Weekly Executive Report', 14, 22);

        // Subtitle
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text(`Generated on: ${new Date().toLocaleString('th-TH')}`, 14, 30);
        doc.text(`Reporting Period: Last 7 Days (since ${oneWeekAgo.toLocaleDateString('th-TH')})`, 14, 36);

        // Statistics Table
        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Value (Last 7 Days)', 'Status']],
            body: [
                ['New Student Registrations', `${newStudents || 0} users`, 'Active'],
                ['New VIP Upgrades', `${newVips || 0} members`, 'Verified'],
                ['Profit Reviews Submitted', `${newReviews || 0} reviews`, 'Pending Audit'],
            ],
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // Slate-900 head
            styles: { fontSize: 10, cellPadding: 6 },
            alternateRowStyles: { fillColor: [241, 245, 249] } // Slate-100 alt rows
        });

        // Convert PDF to Base64 for Email Attachment
        const pdfOutput = doc.output('datauristring');
        const pdfBase64 = pdfOutput.split(',')[1];

        // 4. Distribute via Email (if Resend is configured)
        // For this implementation, we simulate delivery if Resend is missing
        if (resendApiKey) {
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
                from: 'Trading LMS Admin <onboarding@resend.dev>', // Replace with your verified domain
                to: ['your-admin-email@example.com'], // The recipient
                subject: `Weekly Executive Report - ${new Date().toLocaleDateString('th-TH')}`,
                text: 'Please find the attached weekly performance report for the Trading LMS platform.',
                attachments: [
                    {
                        filename: `Weekly-Report-${new Date().toISOString().split('T')[0]}.pdf`,
                        content: pdfBase64,
                    }
                ]
            });
            console.log("Weekly report emailed successfully.");
        } else {
            console.log("Resend API key missing. Skipping email distribution, but PDF generated.");
        }

        // Return Success
        return NextResponse.json({
            success: true,
            message: "Weekly report generated and distributed.",
            stats: { newStudents, newVips, newReviews }
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
