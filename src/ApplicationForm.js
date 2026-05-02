import React, { useState } from "react";

// ⚠️ อย่าลืมแก้ URL ตรงนี้ให้เป็นของคุณ (Deploy แบบ Anyone)
const scriptUrl = "https://script.google.com/macros/s/AKfycbxKtzjYWSkRVG47df9DEorwj3vXkpSIYQN_mbRYmYYr9es6pJ6VAr1YGJLmEcnfKIs7/exec";

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

 const [formData, setFormData] = useState({
    // --- ส่วนรับอีเมล ---
    applicantEmail: "",

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
    livingWith: "l1",    // สำหรับข้อ 1.6 (l1-l4)
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
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckbox = (e) => {
    const { name, value, checked } = e.target;
    let newArray = [...formData[name]];
    if (checked) newArray.push(value);
    else newArray = newArray.filter((item) => item !== value);
    setFormData({ ...formData, [name]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("ยืนยันการส่งข้อมูล?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(scriptUrl, {
        method: "POST",
        body: JSON.stringify({ action: "saveAndPrint", item: formData }),
      });
      const result = await res.json();
      if (result.status === "success") {
        alert("✅ บันทึกข้อมูลและสร้าง PDF สำเร็จแล้ว!");
        window.open(result.url, "_blank");
      } else alert("❌ เกิดข้อผิดพลาด: " + result.message);
    } catch (err) {
      alert(
        "❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ตรวจสอบ URL หรือการอนุญาตสิทธิ์"
      );
    }
    setIsSubmitting(false);
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
        <Section title="อีเมลสำหรับรับเอกสารยืนยัน (PDF)">
          <Input
            type="email"
            name="applicantEmail"
            placeholder="ระบุอีเมลครูหรือผู้รับผิดชอบ"
            required
            onChange={handleChange}
          />
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
                { l: "บกพทางการมองเห็น", v: "d1" },
                { l: "ทางการได้ยินหรือสื่อความหมาย", v: "d2" },
                { l: "ทางการเคลื่อนไหวหรือทางร่างกาย", v: "d4" },
                { l: "ทางจิตใจหรือพฤติกรรม", v: "d5" },
                { l: "การพูดและภาษา", v: "d5" },
                { l: "ทางสติปัญญา", v: "d3" },
                { l: "ทางการเรียนรู้", v: "d7" },
                { l: "ทางออทิสติก", v: "d8" },
                { l: "พิการซ้อน", v: "d9" },
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
            onChange={handleChange}
          ></textarea>
          <textarea
            name="address_reg"
            placeholder="1.3.2 ที่อยู่ตามทะเบียนบ้าน..."
            style={textS}
            onChange={handleChange}
          ></textarea>

{formData.housingStatus === "a4" && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px dashed #2196F3",
                borderRadius: "8px",
                backgroundColor: "#f0f7ff",
              }}
            >
              <h4 style={{ color: "#1976d2", marginTop: 0 }}>
                1.6 ข้อมูลผู้ปกครอง (กรณีไม่ได้อยู่กับบิดามารดา)
              </h4>
              <Select
                label="อาศัยอยู่กับผู้ปกครองคือ"
                name="g_type"
                value={formData.g_type}
                options={[
                  { l: "ปู่ ย่า ตา ยาย", v: "g1" },
                  { l: "อื่นๆ", v: "g2" },
                ]}
                onChange={handleChange}
              />

              {formData.g_type === "g2" && (
                <Input
                  label="ระบุความสัมพันธ์ (เช่น พี่สาว, ลุง, น้า)"
                  name="g_relation"
                  value={formData.g_relation}
                  onChange={handleChange}
                />
              )}

              <Row>
                <Input label="ชื่อผู้ปกครอง" name="g_name" onChange={handleChange} />
                <Input label="นามสกุล" name="g_surname" onChange={handleChange} />
                <Input label="รหัสประจำตัวประชาชน" name="g_id" onChange={handleChange} />
              </Row>
              <Row>
                <Input label="อาชีพ" name="g_job" onChange={handleChange} />
                <Input label="รายได้เดือนละ" name="g_income" onChange={handleChange} />
                <Input label="โทรศัพท์" name="g_tel" onChange={handleChange} />
              </Row>
            </div>
          )}
        </Section>

        <hr style={{ margin: "30px 0", border: "0.5px solid #eee" }} />

        <Section title="ลงลายมือชื่อ">
          <div style={{ marginBottom: "15px" }}>
            {formData.housingStatus === "a4" ? (
              <Input
                label="ชื่อ-สกุล ผู้ปกครองตัวบรรจง (คนเดียวกับด้านบน)"
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
                <strong>✓ ระบบลงนามอัตโนมัติ:</strong> เนื่องจากอาศัยอยู่กับบิดา/มารดา เอกสารจะใช้ชื่อบิดาหรือมารดาเป็นผู้รับรองโดยอัตโนมัติ
              </div>
            )}
          </div>

          <Row>
            <Input label="วันที่" name="sign_d" placeholder="เช่น 01" onChange={handleChange} />
            <Input label="เดือน" name="sign_m" placeholder="เช่น มกราคม" onChange={handleChange} />
            <Input label="ปี พ.ศ." name="sign_y" placeholder="เช่น 2569" onChange={handleChange} />
          </Row>
        </Section>
        <Section title="ส่วนที่ 2: แบบสอบข้อเท็จจริงเด็กที่มีความต้องการพิเศษ">
          <p>
            <b>1. คุณสมบัติของผู้ขอรับทุนการศึกษา</b>
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
            <b>2. หลักฐานที่นำมายื่นทั้งหมด</b>
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
            <b>3. ประวัติการได้รับความช่วยเหลือ</b>
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
            placeholder="ระบุทุนที่เคยได้รับ..."
            onChange={handleChange}
          />

          <Row>
            <Input
              label="4. จำนวนสมาชิกในครอบครัว (คน)"
              name="family_count"
              type="number"
              onChange={handleChange}
            />
            <Input
              label="5. ภาระหนี้สิน (ถ้ามี ระบุจำนวนบาท)"
              name="debt_amount"
              type="number"
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
            label="ชื่อผู้ยื่นคำร้อง (วงเล็บตัวบรรจง)"
            name="applicant_full_name"
            onChange={handleChange}
          />
          <Row>
            <Input
              label="ชื่อผู้สอบข้อเท็จจริง"
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

        <Section title="ส่วนที่ 3 และ ส่วนของเจ้าหน้าที่ (เว้นว่างได้ถ้าต้องการเขียนด้วยมือทีหลัง)">
          <p>
            <b>1. หนังสือรับรองจากชุมชนหรือผู้ที่น่าเชื่อถือ</b>
          </p>
          <Row>
            <Input
              label="ชื่อผู้รับรอง"
              name="cert1_name"
              onChange={handleChange}
            />
            <Input
              label="นามสกุล"
              name="cert1_surname"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="รหัส ปชช." name="cert1_id" onChange={handleChange} />
            <Input label="ตำแหน่ง" name="cert1_pos" onChange={handleChange} />
            <Input label="โทรศัพท์" name="cert1_tel" onChange={handleChange} />
          </Row>
          <Input
            label="ความเดือดร้อนคือ..."
            name="cert1_detail"
            onChange={handleChange}
          />

          <p>
            <b>2. หนังสือรับรองจากโรงเรียน/สถานศึกษา</b>
          </p>
          <Row>
            <Input
              label="ชื่อผู้รับรอง"
              name="cert2_name"
              onChange={handleChange}
            />
            <Input
              label="นามสกุล"
              name="cert2_surname"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="รหัส ปชช." name="cert2_id" onChange={handleChange} />
            <Input label="ตำแหน่ง" name="cert2_pos" onChange={handleChange} />
            <Input label="โทรศัพท์" name="cert2_tel" onChange={handleChange} />
          </Row>

          <p>
            <b>ส่วนของเจ้าหน้าที่รับสมัคร</b>
          </p>
          <Row>
            <Input
              label="วันที่รับสมัคร"
              name="submit_d"
              onChange={handleChange}
            />
            <Input label="เดือน" name="submit_m" onChange={handleChange} />
            <Input label="พ.ศ." name="submit_y" onChange={handleChange} />
          </Row>
          <Row>
            <Input
              label="สถานที่รับสมัคร"
              name="submit_place"
              onChange={handleChange}
            />
            <Input
              label="เจ้าหน้าที่ผู้รับสมัคร"
              name="officer_name"
              onChange={handleChange}
            />
            <Input
              label="โทรศัพท์"
              name="officer_tel"
              onChange={handleChange}
            />
          </Row>

          <p>
            <b>แผนที่บ้าน</b>
          </p>
          <Input
            label="ลิงก์แผนที่ (Google Map)"
            name="home_map"
            onChange={handleChange}
          />
        </Section>

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
    <input {...props} style={inputS} />
  </div>
);
const Select = ({ label, name, options, onChange, value }) => ( // เพิ่ม value ตรงนี้
  <div style={{ flex: 1, minWidth: "200px" }}>
    <label style={{ fontSize: "13px", color: "#444", fontWeight: "bold" }}>
      {label}
    </label>
    <select name={name} onChange={onChange} value={value} style={inputStyle}> {/* เพิ่ม value={value} ตรงนี้ */}
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
// วางไว้ล่างสุดของไฟล์ ApplicationForm.js
const inputStyle = { 
  width: "100%", 
  padding: "8px", 
  borderRadius: "4px", 
  border: "1px solid #ccc",
  marginTop: "5px"
};

const btnStyle = { 
  width: "100%", 
  padding: "15px", 
  background: "#800000", 
  color: "#fff", 
  border: "none", 
  borderRadius: "8px", 
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
};

const textStyle = { 
  width: "100%", 
  height: "80px", 
  padding: "8px", 
  borderRadius: "4px", 
  border: "1px solid #ccc",
  marginTop: "10px" 
};
