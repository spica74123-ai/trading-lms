import AdminLiveSessions from "@/components/AdminLiveSessions";
import ManageReplays from "@/components/ManageReplays";

export default function LiveSessionsAdminPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Live Trading Management</h1>
                <p className="text-gray-500 text-sm font-light mb-8">
                    จัดการตารางสอนสดและการบันทึกวิดีโอย้อนหลังสำหรับนักเรียนและ VIP
                </p>
            </div>

            {/* Section 1: Schedule Upcoming Live */}
            <AdminLiveSessions />

            {/* Section 2: Manage Past Replays */}
            <ManageReplays />
        </div>
    );
}
