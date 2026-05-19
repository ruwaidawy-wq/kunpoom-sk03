try {
  const res = await fetch("/api/submit", {  // ✅ เรียก proxy แทน GAS โดยตรง
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "saveAndPrint",
      item: finalData,
      videoBlob: videoBase64,
      videoName: videoFile ? videoFile.name : "",
    }),
  });

  const result = await res.json();
  if (result.status === "success") {
    alert("✅ บันทึกข้อมูลและสร้าง PDF สำเร็จแล้ว!\nระบบส่ง PDF ไปยังอีเมลของท่านแล้วค่ะ");
    window.open(result.url, "_blank");  // ✅ เปิดไฟล์ได้เลย
  } else {
    alert("❌ เกิดข้อผิดพลาด: " + result.message);
  }
} catch (err) {
  alert("❌ ไม่สามารถเชื่อมต่อได้: " + err.toString());
}
