import React from "react";
// นำเข้าไฟล์ฟอร์มตัวเต็มที่เราเพิ่งสร้าง
// (ตรวจสอบให้แน่ใจว่าไฟล์ฟอร์มของคุณชื่อ ApplicationForm.js)
import ApplicationForm from "./ApplicationForm";

export default function App() {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5", // ใส่สีพื้นหลังให้ดูสบายตา
        minHeight: "100vh", // ให้พื้นหลังคลุมเต็มหน้าจอ
        padding: "20px 0", // เว้นระยะขอบบน-ล่างนิดหน่อย
      }}
    >
      {/* เรียกใช้งาน Component ฟอร์มตรงนี้ */}
      <ApplicationForm />
    </div>
  );
}
