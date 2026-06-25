import React, { useState } from "react";

const scriptUrl = "https://script.google.com/macros/s/AKfycbxKtzjYWSkRVG47df9DEorwj3vXkpSIYQN_mbRYmYYr9es6pJ6VAr1YGJLmEcnfKIs7/exec";

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
const [videoFile, setVideoFile] = useState(null);
const [sidWarning, setSidWarning] = useState("");
const [checkingSid, setCheckingSid] = useState(false);
 const [formData, setFormData] = useState({
    // --- ส่วนรับอีเมล ---
    applicantEmail: "",
teacher_tel: "",
    // --- ส่วนที่ 1: ข้อมูลเด็ก ---
    eduCategory: "e1",
    disabilityType: "d8",
    pre: "เด็กชาย",
    fname: "",
    lname: "",
    sid: "",
    d: "",
    m: "",
    y: "",
    age: "",
    school_name: "",
    school_level: "",
   student_photo: "",

    // --- ที่อยู่ ---
    address_now: "",
    address_reg: "",
    housingStatus: "a1", // สำหรับข้อ 1.3 (a1-a5)

    // --- ข้อมูลบิดา-มารดา ---
    f_status: "มีชีวิตอยู่",
    f_name: "",
    f_surname: "",
    f_id: "",
    f_job: "",
    f_income: "",
    f_tel: "",
    f_mobile: "", // เก็บไว้เผื่อฟอร์มใน React ยังมีช่องนี้อยู่
    m_status: "มีชีวิตอยู่",
    m_name: "",
    m_surname: "",
    m_id: "",
    m_job: "",
    m_income: "",
    m_tel: "",
    m_mobile: "", // เก็บไว้เผื่อฟอร์มใน React ยังมีช่องนี้อยู่
    maritalStatus: "s1", // สำหรับ s1-s4 ตาม Doc

    // --- ข้อมูลผู้ปกครอง (ข้อ 1.6) ---
    livingWith: "h1",    // สำหรับข้อ 1.6 (h1-h4)
    g_type: "g1",        // g1-g2
    g_relation: "",
    g_name: "",
    g_surname: "",
    g_id: "",
    g_job: "",
    g_income: "",
    g_tel: "",

    // --- ลงนามส่วนที่ 1 ---
    signer_name: "",     // ตรงกับ {{signer_name}} ใน Doc
    sign_d: "", 
    sign_m: "", 
    sign_y: "",
   parent_full_name: "",

    // --- ส่วนที่ 2: เช็คบ็อกซ์ ---
    quals: [], 
    docs: [], 
    helps: [],
    help_detail: "",

    // --- ภาระครอบครัวและสภาพแวดล้อม ---
    family_count: "0",
    debt_amount: "0",
    family_detail: "",
    living: "living2",
    env: "env2",

    // --- ลงนามส่วนที่ 2 ---
    applicant_full_name: "",
    interviewer_full_name: "",
    interviewer_pos: "",
    interviewer_org: "",
    int_d: "", 
    int_m: "", 
    int_y: "",

    // --- ส่วนที่ 3: ผู้รับรองคนที่ 1 (ชุมชน) ---
    cert1_name: "",
    cert1_surname: "",
    cert1_id: "",
    cert1_pos: "",
    cert1_tel: "",
    cert1_detail: "",

    // --- ส่วนที่ 3: ผู้รับรองคนที่ 2 (สถานศึกษา) ---
    cert2_name: "",
    cert2_surname: "",
    cert2_id: "",
    cert2_pos: "",
    cert2_tel: "",

    // --- ส่วนเจ้าหน้าที่ ---
    submit_d: "",
    submit_m: "",
    submit_y: "",
    submit_place: "",
    officer_name: "",
    officer_tel: "",

    // --- แผนที่ ---
    home_map: "",
});
 const checkSidDuplicate = async (sid) => {
    if (!sid || sid.length !== 13) {
      setSidWarning("");
      return;
    }
    setCheckingSid(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkSid", sid }),
      });
      const result = await res.json();
      if (result.isDuplicate) {
        setSidWarning("⚠️ เลขบัตรประชาชนนี้มีการสมัครในระบบแล้ว กรุณาติดต่อครูธัญวลัย 0805393980 เพื่อตรวจสอบ");
      } else {
        setSidWarning("");
      }
    } catch (err) {
      console.error("เช็คเลขบัตรซ้ำไม่สำเร็จ:", err);
    }
    setCheckingSid(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ✅ เช็คซ้ำทันทีเมื่อกรอกเลขบัตรประชาชนครบ 13 หลัก
    if (name === "sid") {
      checkSidDuplicate(value);
    }
  };

  const handleCheckbox = (e) => {
    const { name, value, checked } = e.target;
    let newArray = [...formData[name]];
    if (checked) newArray.push(value);
    else newArray = newArray.filter((item) => item !== value);
    setFormData({ ...formData, [name]: newArray });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, student_photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
if (sidWarning) {
  alert("⚠️ ไม่สามารถส่งใบสมัครได้ เนื่องจาก " + sidWarning);
  return;
}
  // --- ตรวจสอบช่องที่ HTML required ตรวจให้ไม่ได้ ---
  if (!formData.student_photo) {
    alert("⚠️ กรุณาแนบรูปภาพนักเรียน (ส่วนที่ 1)");
    return;
  }
  if (formData.quals.length === 0) {
    alert("⚠️ กรุณาเลือก 'คุณสมบัติของผู้ขอรับทุน' อย่างน้อย 1 ข้อ (ส่วนที่ 2 ข้อ 1)");
    return;
  }
  if (formData.docs.length === 0) {
    alert("⚠️ กรุณาเลือก 'หลักฐานที่นำมายื่น' อย่างน้อย 1 รายการ (ส่วนที่ 2 ข้อ 2)");
    return;
  }
  if (formData.helps.length === 0) {
    alert("⚠️ กรุณาเลือก 'ประวัติการได้รับความช่วยเหลือ' อย่างน้อย 1 ข้อ (ส่วนที่ 2 ข้อ 3)");
    return;
  }
  if (formData.helps.includes("help3") && !formData.help_detail.trim()) {
    alert("⚠️ กรุณาระบุรายละเอียดทุนที่เคยได้รับ (ส่วนที่ 2 ข้อ 3)");
    return;
  }

  if (!window.confirm("ยืนยันการส่งข้อมูลใบสมัคร?")) return;
  setIsSubmitting(true);

  const finalData = { ...formData };
  finalData.cert1_full = `${formData.cert1_name || ""} ${formData.cert1_surname || ""}`.trim();
  finalData.cert2_full = `${formData.cert2_name || ""} ${formData.cert2_surname || ""}`.trim();
  finalData.officer_full = formData.officer_name || "";
  finalData.video_url = formData.video_url || "";

  try {
    // ✅ เรียกผ่าน Proxy /api/submit เพื่อให้อ่าน response จริงได้
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "saveAndPrint",
        item: finalData,
      }),
    });

    const result = await res.json();

    if (result.status === "success") {
      alert("✅ บันทึกข้อมูลและสร้าง PDF สำเร็จแล้ว!\nระบบส่ง PDF ไปยังอีเมลของท่านแล้วค่ะ หากไม่พบอีเมล์ กรุณาตรวจสอบในจดหมายขยะ");
      window.open(result.url, "_blank");
    } else if (result.status === "duplicate") {
      alert("⚠️ " + result.message);
    } else {
      alert("❌ เกิดข้อผิดพลาด: " + result.message);
    }

  } catch (err) {
    console.error("Error:", err);
    alert("❌ ไม่สามารถเชื่อมต่อสำเร็จ: " + err.message);
  }

  setIsSubmitting(false);
};
  
const validateVideo = (event) => {
  const file = event.target.files[0];
  const errorElement = document.getElementById("video_error");
  
  if (errorElement) errorElement.innerText = ""; 

  if (file) {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration; 
      const maxDuration = 2 * 60; 

      if (duration > maxDuration) {
        if (errorElement) {
          errorElement.innerText = "❌ วิดีโอมีความยาวเกิน 2 นาที กรุณาตัดต่อใหม่ให้อยู่ในเกณฑ์ที่กำหนดค่ะ";
        }
        event.target.value = ""; 
        setVideoFile(null); // ถ้าเกินเวลา ไม่เก็บไฟล์
      } else {
        setVideoFile(file); // ถ้าผ่านเกณฑ์ ให้เก็บไฟล์นี้ไว้เตรียมส่ง
      }
    };

    video.src = URL.createObjectURL(file);
  }
};
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        fontFamily: "'Sarabun', sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#800000" }}>
        แบบขอรับทุนการศึกษาสำหรับเด็กออทิสติกและเด็กที่มีความต้องการพิเศษ
        <br />
        มูลนิธิคุณพุ่ม ปีการศึกษา 2569
      </h2>

      <form onSubmit={handleSubmit}>
<Section title="ข้อมูลผู้รับผิดชอบ (ครู)">
          <Row>
            <Input
              type="email"
              label="อีเมลสำหรับรับเอกสาร PDF"
              name="applicantEmail"
              placeholder="example@gmail.com"
              required
              onChange={handleChange}
            />
            <Input
              type="tel"
              label="เบอร์โทรติดต่อครูที่รับผิดชอบ"
              name="teacher_tel"
              placeholder="08X-XXXXXXX"
              required
              onChange={handleChange}
            />
          </Row>
        </Section>

        <Section title="ส่วนที่ 1: แบบประวัติของเด็กที่มีความต้องการพิเศษ">
          <Select
            label="ระบบการศึกษา"
            name="eduCategory"
            options={[
              { l: "เด็กที่เรียนในระบบ", v: "e1" },
              { l: "เด็กที่ขาดโอกาสเรียน/ออกกลางคัน", v: "e2" },
              { l: "เด็กที่ไม่ได้เข้าสู่ระบบโรงเรียน", v: "e3" },
            ]}
            onChange={handleChange}
          />
         <Select
  label="ประเภทความพิการ"
  name="disabilityType"
  value={formData.disabilityType} // เพิ่มบรรทัดนี้ครับ
options={[
                { l: "บกพร่องทางการมองเห็น", v: "d1" },
                { l: "บกพร่องทางการได้ยินหรือสื่อความหมาย", v: "d2" },
                { l: "บกพร่องทางการเคลื่อนไหวหรือทางร่างกาย", v: "d4" },
                { l: "บกพร่องทางการเรียนรู้", v: "d5" },
                { l: "บกพร่องทางการพูดและภาษา", v: "d6" },
                { l: "บกพร่องทางสติปัญญา", v: "d3" },
                { l: "บกพร่องทางจิตใจหรือพฤติกรรมทางการเรียนรู้", v: "d7" },
                { l: "บุคคลออทิสติก", v: "d8" },
                { l: "บุคคลพิการซ้อน", v: "d9" },
              ]}
  onChange={handleChange}
/>

          <h4>1.1 ข้อมูลเด็ก</h4>
          <Row>
            <Select
              label="คำนำหน้า"
              name="pre"
              options={["เด็กชาย", "เด็กหญิง", "นาย", "นางสาว"]}
              onChange={handleChange}
            />
            <Input label="ชื่อ" name="fname" onChange={handleChange} required />
            <Input
              label="นามสกุล"
              name="lname"
              onChange={handleChange}
              required
            />
          </Row>
          <Row>
            <Input label="เกิดวันที่" name="d" onChange={handleChange} />
            <Input label="เดือน" name="m" onChange={handleChange} />
            <Input label="ปี พ.ศ." name="y" onChange={handleChange} />
            <Input label="อายุ (ปี)" name="age" onChange={handleChange} />
          </Row>
          <Row>
  <Input
    label="รหัสประจำตัวประชาชน"
    name="sid"
    maxLength="13"
    onChange={handleChange}
    required
  />
</Row>
{checkingSid && (
  <p style={{ color: "#888", fontSize: "13px" }}>🔍 กำลังตรวจสอบ...</p>
)}
{sidWarning && (
  <div
    style={{
      padding: "10px",
      backgroundColor: "#fff3cd",
      border: "1px solid #ffc107",
      borderRadius: "6px",
      color: "#856404",
      fontSize: "14px",
      marginBottom: "10px",
    }}
  >
    {sidWarning}
  </div>
)}

          <h4>1.2 สถานศึกษา</h4>
          <Row>
            <Input
              label="ชื่อสถานศึกษา"
              name="school_name"
              onChange={handleChange}
            />
            <Input
              label="กำลังศึกษาอยู่ในระดับ"
              name="school_level"
              onChange={handleChange}
            />
          </Row>
<Section title="รูปภาพนักเรียน">
    <div style={{ marginBottom: "15px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} required style={inputS} />
        {formData.student_photo && (
            <div style={{ marginTop: "10px" }}>
                <img src={formData.student_photo} alt="Preview" style={{ width: "120px", height: "150px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }} />
                <p style={{ fontSize: "12px", color: "#666" }}>ตัวอย่างรูปภาพ</p>
            </div>
        )}
    </div>
</Section>
          <h4>1.3 ที่อยู่ปัจจุบัน</h4>
          <Select
            label="ลักษณะที่อยู่"
            name="housingStatus"
            options={[
              { l: "เป็นของตนเอง", v: "a1" },
              { l: "เช่า", v: "a2" },
              { l: "บ้านพักหน่วยงาน", v: "a3" },
              { l: "อาศัยผู้อื่น", v: "a4" },
              { l: "ไม่มีที่อยู่", v: "a5" },
            ]}
            onChange={handleChange}
          />
          <textarea
            name="address_now"
            placeholder="1.3.1 ที่อยู่ปัจจุบัน..."
            style={textS}
            required
            onChange={handleChange}
          ></textarea>
          <textarea
            name="address_reg"
            placeholder="1.3.2 ที่อยู่ตามทะเบียนบ้าน..."
            style={textS}
            required
            onChange={handleChange}
          ></textarea>
          <p>
            <b>แผนที่บ้าน</b>
          </p>
          <Input
            label="ลิงก์แผนที่ (Google Map)"
            name="home_map"
            onChange={handleChange}
          />
<h4>1.4 ข้อมูลบิดา</h4>
          <Select
            label="สถานะบิดา"
            name="f_status"
            options={["มีชีวิตอยู่", "ถึงแก่กรรม"]}
            onChange={handleChange}
          />
          <Row>
            <Input label="ชื่อบิดา(ระบุคำนำหน้า)" name="f_name" onChange={handleChange} />
            <Input label="นามสกุล" name="f_surname" onChange={handleChange} />
            <Input
              label="เลขบัตรประจำตัวประชาชน"
              name="f_id"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="อาชีพ" name="f_job" onChange={handleChange} />
            <Input
              label="รายได้เดือนละ(ใส่เฉพาะตัวเลขและระบุเครื่องหมาย , ให้ครบถ้วน)"
              name="f_income"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="โทรศัพท์" name="f_tel" onChange={handleChange} />
          </Row>

          <h4>1.5 ข้อมูลมารดา</h4>
          <Select
            label="สถานะมารดา"
            name="m_status"
            options={["มีชีวิตอยู่", "ถึงแก่กรรม"]}
            onChange={handleChange}
          />
          <Row>
            <Input label="ชื่อมารดา(ระบุคำนำหน้า)" name="m_name" onChange={handleChange} />
            <Input label="นามสกุล" name="m_surname" onChange={handleChange} />
            <Input
              label="เลขบัตรประจำตัวประชาชน"
              name="m_id"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="อาชีพ" name="m_job" onChange={handleChange} />
            <Input
              label="รายได้เดือนละ(ใส่เฉพาะตัวเลขและระบุเครื่องหมาย , ให้ครบถ้วน)"
              name="m_income"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="โทรศัพท์" name="m_tel" onChange={handleChange} />
          </Row>

          <Select
            label="สถานภาพ บิดาและมารดาขณะนี้"
            name="maritalStatus"
            options={[
              { l: "สมรส", v: "s1" },
              { l: "อยู่ด้วยกันแต่ไม่จดทะเบียน", v: "s2" },
              { l: "แยกกันอยู่", v: "s3" },
              { l: "หย่าร้าง", v: "s4" },
            ]}
            onChange={handleChange}
          />

        {/* ----- เริ่มต้นส่วนที่ 1.6 ที่แก้ไขใหม่ (วางทับของเดิม) ----- */}
          <h4 style={{ color: "#1976d2", marginTop: 0 }}>
            1.6 ปัจจุบันอาศัยอยู่กับ
          </h4>
          
          <div style={{ marginBottom: "20px", marginLeft: "10px" }}>
            <label style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
              <input type="radio" name="livingWith" value="h1" checked={formData.livingWith === "h1"} onChange={handleChange} /> 
              <span style={{ marginLeft: "8px" }}>บิดา-มารดา</span>
            </label>
            <label style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
              <input type="radio" name="livingWith" value="h2" checked={formData.livingWith === "h2"} onChange={handleChange} /> 
              <span style={{ marginLeft: "8px" }}>บิดา</span>
            </label>
            <label style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
              <input type="radio" name="livingWith" value="h3" checked={formData.livingWith === "h3"} onChange={handleChange} /> 
              <span style={{ marginLeft: "8px" }}>มารดา</span>
            </label>
            <label style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
              <input type="radio" name="livingWith" value="h4" checked={formData.livingWith === "h4"} onChange={handleChange} /> 
              <span style={{ marginLeft: "8px" }}>ผู้ปกครองที่ไม่ใช่บิดา/มารดา</span>
            </label>
          </div>

          {/* กล่องนี้จะกางลงมาให้กรอก ก็ต่อเมื่อติ๊กเลือกข้อ 4 "ผู้ปกครองที่ไม่ใช่บิดา/มารดา" */}
          {formData.livingWith === "h4" && (
            <div
              style={{
                marginTop: "10px",
                padding: "20px",
                border: "1px dashed #2196F3",
                borderRadius: "8px",
                backgroundColor: "#f0f7ff",
              }}
            >
              <h5 style={{ marginTop: 0 }}>ระบุผู้ปกครอง:</h5>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ marginRight: "20px", cursor: "pointer" }}>
                  <input type="radio" name="g_type" value="g1" checked={formData.g_type === "g1"} onChange={handleChange} />
                  <span style={{ marginLeft: "8px" }}>ปู่ ย่า ตา ยาย</span>
                </label>
                <label style={{ cursor: "pointer" }}>
                  <input type="radio" name="g_type" value="g2" checked={formData.g_type === "g2"} onChange={handleChange} />
                  <span style={{ marginLeft: "8px" }}>อื่นๆ</span>
                </label>
              </div>

              {/* ช่องให้พิมพ์ความสัมพันธ์ จะโชว์เมื่อเลือก "อื่นๆ" */}
              {formData.g_type === "g2" && (
                <div style={{ marginBottom: "15px" }}>
                  <Input
                    label="ระบุความสัมพันธ์ (เช่น พี่สาว, ลุง, น้า)"
                    name="g_relation"
                    value={formData.g_relation}
                    onChange={handleChange}
                  />
                </div>
              )}

              <Row>
                <Input label="ชื่อผู้ปกครอง" name="g_name" onChange={handleChange} />
                <Input label="นามสกุล" name="g_surname" onChange={handleChange} />
                <Input label="เลขบัตรประจำตัวประชาชน" name="g_id" onChange={handleChange} />
              </Row>
              <Row>
                <Input label="อาชีพ" name="g_job" onChange={handleChange} />
                <Input label="รายได้/เดือน" name="g_income" onChange={handleChange} />
                <Input label="โทรศัพท์" name="g_tel" onChange={handleChange} />
              </Row>
            </div>
          )}
        </Section>

        {/* แยกส่วนลายเซ็นออกมาให้ดูเป็นระเบียบ */}
        <hr style={{ margin: "30px 0", border: "0.5px solid #eee" }} />

        <Section title="ลงลายมือชื่อผู้ปกครอง">
          <div style={{ marginBottom: "15px" }}>
            {formData.livingWith === "h4" ? (
              <Input
                label="ชื่อ-สกุล ผู้ปกครองตัวบรรจง"
                name="parent_full_name"
                value={formData.parent_full_name}
                onChange={handleChange}
                placeholder="ระบุชื่อเพื่อใช้ในช่องลายเซ็น"
              />
            ) : (
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "8px",
                  color: "#2e7d32",
                }}
              >
                <strong>✓ ระบบลงนามอัตโนมัติ:</strong> เนื่องจากอาศัยอยู่กับบิดา/มารดา เอกสารจะดึงชื่อบิดาหรือมารดาไปใส่ในช่องผู้รับรองให้อัตโนมัติ 
              </div>
            )}
          </div>

          <Row>
            <Input label="วันที่" name="sign_d" placeholder="เช่น 12" onChange={handleChange} />
            <Input label="เดือน" name="sign_m" placeholder="เช่น มิถุนายน" onChange={handleChange} />
            <Input label="ปี พ.ศ." name="sign_y" placeholder="เช่น 2569" onChange={handleChange} />
          </Row>
        </Section>
        {/* ----- จบส่วนที่แก้ไข ----- */}

        <Section title="ส่วนที่ 2: แบบสอบข้อเท็จจริงเด็กที่มีความต้องการพิเศษ">
          <p>
            <b>1. คุณสมบัติของผู้ขอรับทุนการศึกษา</b> <span style={{ color: "#c00", fontSize: "13px" }}>(เลือกอย่างน้อย 1 ข้อ)</span>
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                name="quals"
                value="q1"
                onChange={handleCheckbox}
              />{" "}
              เป็นคนเชื้อชาติไทย สัญชาติไทย
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="quals"
                value="q2"
                onChange={handleCheckbox}
              />{" "}
              เป็นเด็กพิการทุกประเภทที่มีการจดทะเบียนคนพิการ
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="quals"
                value="q3"
                onChange={handleCheckbox}
              />{" "}
              อายุไม่เกิน 18 ปีบริบูรณ์
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="quals"
                value="q4"
                onChange={handleCheckbox}
              />{" "}
              เป็นผู้ที่มีทะเบียนบ้านอยู่ในจังหวัดสงขลา
            </label>
          </div>

          <p>
            <b>2. หลักฐานที่นำมายื่นทั้งหมด</b> <span style={{ color: "#c00", fontSize: "13px" }}>(เลือกอย่างน้อย 1 รายการ)</span>
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc1"
                onChange={handleCheckbox}
              />{" "}
              สำเนาทะเบียนบ้านของบิดา/มารดา/ผู้ปกครอง
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc2"
                onChange={handleCheckbox}
              />{" "}
              สำเนาบัตรประชาชนของบิดา/มารดา/ผู้ปกครอง
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc3"
                onChange={handleCheckbox}
              />{" "}
              สำเนาสูติบัตรเด็ก
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc4"
                onChange={handleCheckbox}
              />{" "}
              สำเนาทะเบียนบ้านเด็กและสำเนาบัตรประชาชนเด็ก (กรณีอายุเกิน 15
              ปีขึ้น)
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc5"
                onChange={handleCheckbox}
              />{" "}
              สำเนาบัตรประชาชนผู้รับรอง (ส่วนที่ 3)
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc6"
                onChange={handleCheckbox}
              />{" "}
              สำเนาบัตรคนพิการหรือเอกสารรับรองความพิการ
            </label>
          </div>

          <p>
            <b>3. ประวัติการได้รับความช่วยเหลือ</b> <span style={{ color: "#c00", fontSize: "13px" }}>(เลือกอย่างน้อย 1 ข้อ)</span>
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                name="helps"
                value="help1"
                onChange={handleCheckbox}
              />{" "}
              ไม่เคยได้รับความช่วยเหลือ / ทุนสนับสนุนการศึกษาจากหน่วยงานใดมา
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="helps"
                value="help2"
                onChange={handleCheckbox}
              />{" "}
              ได้รับเบี้ยยังชีพคนพิการ 1,000 บาทต่อเดือน
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="helps"
                value="help3"
                onChange={handleCheckbox}
              />{" "}
              เคยได้รับความช่วยเหลือ / ทุนสนับสนุนการศึกษา ได้แก่
            </label>
          </div>
          <Input
            name="help_detail"
            placeholder="ระบุทุนที่เคยได้รับ... (กรอกเมื่อเลือกข้อ 'เคยได้รับความช่วยเหลือ')"
            onChange={handleChange}
            required={false}
          />

          <Row>
            <Input
              label="4. จำนวนสมาชิกในครอบครัว (คน)"
              name="family_count"
              type="number"
              onChange={handleChange}
            />
            <Input
              label="5. ภาระหนี้สิน (ถ้ามี ให้ใส่เฉพาะตัวเลขและระบุเครื่องหมาย , ให้ครบถ้วน)"
              name="debt_amount"
              type="text"
              onChange={handleChange}
            />
          </Row>

          <p>
            <b>6. สภาพครอบครัว และปัญหาความเดือดร้อน</b>
          </p>
          <textarea
            name="family_detail"
            placeholder="อธิบายโดยย่อ..."
            style={textS}
            required
            onChange={handleChange}
          ></textarea>

          <Row>
            <Select
              label="สภาพความเป็นอยู่"
              name="living"
              options={[
                { l: "ดี", v: "living1" },
                { l: "ปานกลาง", v: "living2" },
                { l: "ขัดสนขาดแคลน", v: "living3" },
              ]}
              onChange={handleChange}
            />
            <Select
              label="สภาพสิ่งแวดล้อม"
              name="env"
              options={[
                { l: "ดี", v: "env1" },
                { l: "ปานกลาง", v: "env2" },
                { l: "ขัดสนขาดแคลน", v: "env3" },
              ]}
              onChange={handleChange}
            />
          </Row>

          <h4>ลายมือชื่อ</h4>
          <Input
            label="ชื่อผู้ยื่นคำร้อง (ระบุคำนำหน้าเต็ม)"
            name="applicant_full_name"
            onChange={handleChange}
          />
          <Row>
            <Input
              label="ชื่อผู้สอบข้อเท็จจริง(ระบุคำนำหน้าเต็ม)"
              name="interviewer_full_name"
              onChange={handleChange}
            />
            <Input
              label="ตำแหน่ง"
              name="interviewer_pos"
              onChange={handleChange}
            />
            <Input
              label="ชื่อหน่วยงาน"
              name="interviewer_org"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="วันที่" name="int_d" onChange={handleChange} />
            <Input label="เดือน" name="int_m" onChange={handleChange} />
            <Input label="ปี พ.ศ." name="int_y" onChange={handleChange} />
          </Row>
        </Section>

        <Section title="ส่วนที่ 3 ผู้รับรอง">
          <p>
            <b>1. หนังสือรับรองจากชุมชนหรือผู้ที่น่าเชื่อถือ</b>
          </p>
          <Row>
            <Input
  label="ชื่อผู้รับรอง(ระบุคำนำหน้า)"
  name="cert1_name"
  placeholder="เช่น นายสมชาย" // ใส่ตัวอย่างเพื่อให้เขากรอกคำนำหน้ามาด้วย
  onChange={handleChange}
/>
            <Input
              label="นามสกุล"
              name="cert1_surname"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="เลขบัตรประจำตัวประชาชน" name="cert1_id" onChange={handleChange} />
            <Input label="ตำแหน่ง" name="cert1_pos" onChange={handleChange} />
            <Input label="โทรศัพท์" name="cert1_tel" onChange={handleChange} />
          </Row>
          <p>
            <b>2. หนังสือรับรองจากโรงเรียน/สถานศึกษา</b>
          </p>
          <Row>
            <Input
  label="ชื่อผู้รับรอง(ระบุคำนำหน้า)"
  name="cert2_name"
  placeholder="เช่น นายสมชาย" // ใส่ตัวอย่างเพื่อให้เขากรอกคำนำหน้ามาด้วย
  onChange={handleChange}
/>
            <Input
              label="นามสกุล"
              name="cert2_surname"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="เลขบัตรประจำตัวประชาชน" name="cert2_id" onChange={handleChange} />
            <Input label="ตำแหน่ง" name="cert2_pos" onChange={handleChange} />
            <Input label="โทรศัพท์" name="cert2_tel" onChange={handleChange} />
          </Row>
        </Section>
{/* --- บล็อกแสดงวิดีโอตัวอย่างก่อนแนบไฟล์ (เหลือเฉพาะจุดนี้จุดเดียวพอค่ะ) --- */}
<div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
  <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
    🎬 วิดีโอตัวอย่างคำแนะนำในการแนบไฟล์และถ่ายคลิป (กรุณาเปิดเพื่อทำความเข้าใจในการบันทึกวิดีโอแนบนะคะ)
  </p>
  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px' }}>
    <iframe
      src="https://drive.google.com/file/d/1VBMw-ilzqCCEqEMK2AuaGhCwsBN7xwVx/preview"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      allow="autoplay; encrypted-media"
      allowFullScreen
      title="วิดีโอตัวอย่างก่อนแนบไฟล์"
    ></iframe>
  </div>
</div>

{/* --- ส่วนของช่องอัปโหลดไฟล์วิดีโอ --- */}
{/* --- ส่วนของช่องแนบลิงก์วิดีโอแทนการอัปโหลดไฟล์ --- */}
<div style={{ marginBottom: "20px" }}>
  <Input 
    label="🎥 ลิงก์วิดีโอแนะนำตัว (เช่น ลิงก์ Google Drive, YouTube ที่เปิดสาธารณะแล้ว)" 
    name="video_url" 
    placeholder="https://drive.google.com/..."
    onChange={handleChange} 
    required
  />
</div>
        <button type="submit" disabled={isSubmitting} style={btnS}>
          {isSubmitting ? "⏳ กำลังประมวลผล..." : "ส่งข้อมูลและสร้าง PDF ➔"}
        </button>
      </form>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      backgroundColor: "#fff",
    }}
  >
    <h3
      style={{
        marginTop: 0,
        color: "#800000",
        borderBottom: "1px solid #eee",
        paddingBottom: "10px",
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);
const Row = ({ children }) => (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginBottom: "10px",
      flexWrap: "wrap",
    }}
  >
    {children}
  </div>
);
const Input = ({ label, ...props }) => (
  <div style={{ flex: 1, minWidth: "180px" }}>
    {label && (
      <label style={{ fontSize: "13px", color: "#666" }}>{label}</label>
    )}
    <input required {...props} style={inputS} />
  </div>
);
const Select = ({ label, name, options, onChange, value }) => ( // เพิ่ม value ตรงนี้
  <div style={{ flex: 1, minWidth: "200px" }}>
    <label style={{ fontSize: "13px", color: "#444", fontWeight: "bold" }}>
      {label}
    </label>
    <select name={name} onChange={onChange} value={value} required style={inputS}> {/* เพิ่ม value={value} ตรงนี้ */}
      {options.map((opt) => (
        <option key={opt.v || opt} value={opt.v || opt}>
          {opt.l || opt}
        </option>
      ))}
    </select>
  </div>
);
const inputS = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  marginTop: "4px",
  boxSizing: "border-box",
};
const textS = { ...inputS, height: "60px", resize: "vertical" };
const btnS = {
  width: "100%",
  padding: "15px",
  background: "#800000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const textStyle = { 
  width: "100%", 
  height: "80px", 
  padding: "8px", 
  borderRadius: "4px", 
  border: "1px solid #ccc",
  marginTop: "10px" 
};
