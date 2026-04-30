import React, { useState } from "react";

// ==========================================
// นำ URL ของ Apps Script ที่ได้จากการ Deploy (ต้องลงท้ายด้วย /exec) มาวางในเครื่องหมายคำพูดด้านล่างนี้
// ==========================================
const scriptUrl =
  "https://script.google.com/macros/s/AKfycbxDZWuJc1nHxyaKT4vBymUlNnQCUN3-SXsxiLmqx6Ptr6IphfUZ06j7tlnNnoQCNi8i/exec";

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // ที่เก็บข้อมูลฟอร์มทั้งหมด (State) ครบทุกตัวแปร
  // ==========================================
  const [formData, setFormData] = useState({
    applicantEmail: "",

    // ข้อมูลเด็กและโรงเรียน
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
    housingStatus: "a1",
    address_now: "",
    address_reg: "",
    home_map: "",

    // ข้อมูลครอบครัว (บิดา-มารดา)
    f_status: "มีชีวิตอยู่",
    f_name: "",
    f_surname: "",
    f_id: "",
    f_job: "",
    f_income: "",
    f_tel: "",
    f_mobile: "",
    m_status: "มีชีวิตอยู่",
    m_name: "",
    m_surname: "",
    m_id: "",
    m_job: "",
    m_income: "",
    m_tel: "",
    m_mobile: "",
    maritalStatus: "s1",

    // ข้อมูลผู้ปกครอง (กรณีไม่ใช่บิดามารดา)
    g_type: "g1",
    g_name: "",
    g_surname: "",
    g_id: "",
    g_job: "",
    g_income: "",
    g_tel: "",
    g_mobile: "",
    g_relation: "ปู่ ย่า ตา ยาย",

    // ลงชื่อส่วนที่ 1
    parent_full_name: "",
    sign_d: "",
    sign_m: "",
    sign_y: "",

    // ส่วนที่ 2 แบบสอบข้อเท็จจริง
    quals: [],
    docs: [],
    helps: [],
    help_detail: "",
    family_count: "0",
    debt_amount: "0",
    family_detail: "",
    living: "ปานกลาง",
    env: "ปานกลาง",

    // ลงชื่อส่วนที่ 2 (ครูผู้สอบข้อเท็จจริง)
    applicant_full_name: "",
    interviewer_full_name: "",
    interviewer_pos: "",
    interviewer_org: "",
    int_d: "",
    int_m: "",
    int_y: "",

    // วันที่กดยื่นเรื่อง (บันทึกลง Sheet อัตโนมัติ)
    submitDay: new Date().getDate().toString(),
    submitMonth: (new Date().getMonth() + 1).toString(),
    submitYear: (new Date().getFullYear() + 543).toString(),
  });

  // ==========================================
  // ฟังก์ชันจัดการเมื่อพิมพ์ข้อความและเลือก Dropdown
  // ==========================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // ฟังก์ชันจัดการเมื่อติ๊ก Checkbox (เลือกได้หลายข้อ)
  // ==========================================
  const handleCheckbox = (e) => {
    const { name, value, checked } = e.target;
    let newArray = [...formData[name]];
    if (checked) {
      newArray.push(value);
    } else {
      newArray = newArray.filter((item) => item !== value);
    }
    setFormData({ ...formData, [name]: newArray });
  };

  // ==========================================
  // ฟังก์ชันกดส่งข้อมูล
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        "คุณตรวจสอบข้อมูลครบถ้วนแล้ว และต้องการส่งใบสมัครใช่หรือไม่?"
      )
    )
      return;

    setIsSubmitting(true);
    try {
      const res = await fetch(scriptUrl, {
        method: "POST",
        body: JSON.stringify({ action: "saveAndPrint", item: formData }),
      });
      const result = await res.json();

      if (result.status === "success") {
        alert(
          "✅ บันทึกข้อมูลและสร้าง PDF สำเร็จแล้ว!\nระบบจะเปิดไฟล์ PDF ให้ตรวจสอบ และได้ส่งอีเมลยืนยันไปแล้วครับ"
        );
        window.open(result.url, "_blank"); // เปิด PDF แท็บใหม่
        window.location.reload(); // รีเฟรชฟอร์มให้ว่าง
      } else {
        alert("❌ เกิดข้อผิดพลาดจากฝั่งเซิร์ฟเวอร์: " + result.message);
      }
    } catch (err) {
      alert(
        "❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าคุณใส่ URL ของ Apps Script ถูกต้อง และตั้งค่าสิทธิ์เป็น Anyone (ทุกคน) หรือไม่"
      );
      console.error(err);
    }
    setIsSubmitting(false);
  };

  // ==========================================
  // หน้าตาของฟอร์ม (HTML/JSX)
  // ==========================================
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        fontFamily: "'Sarabun', sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#800000" }}>
        ใบสมัครขอรับทุนการศึกษามูลนิธิคุณพุ่ม ปีการศึกษา 2569
      </h2>

      <form onSubmit={handleSubmit}>
        <Section title="✉️ อีเมลสำหรับรับเอกสารยืนยัน (PDF)">
          <Input
            type="email"
            name="applicantEmail"
            placeholder="ระบุอีเมลที่ใช้งานได้จริง เพื่อรับไฟล์ PDF"
            required
            onChange={handleChange}
          />
        </Section>

        <Section title="ส่วนที่ 1: ข้อมูลเด็กผู้ขอรับทุน">
          <Row>
            <Select
              label="ระบบการศึกษา"
              name="eduCategory"
              options={[
                { l: "เด็กในระบบการศึกษา", v: "e1" },
                { l: "เด็กขาดโอกาส (นอกระบบ)", v: "e2" },
                { l: "เด็กที่ยังไม่ได้เข้าสู่ระบบการศึกษา", v: "e3" },
              ]}
              onChange={handleChange}
            />
            <Select
              label="ประเภทความพิการ"
              name="disabilityType"
              options={[
                { l: "ออทิสติก", v: "d8" },
                { l: "บกพร่องทางสติปัญญา", v: "d3" },
                { l: "บกพร่องทางร่างกาย/สุขภาพ", v: "d4" },
                { l: "ทางการมองเห็น", v: "d1" },
                { l: "ทางการได้ยิน/สื่อความหมาย", v: "d2" },
                { l: "พิการซ้อน", v: "d9" },
              ]}
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Select
              label="คำนำหน้า"
              name="pre"
              options={["เด็กชาย", "เด็กหญิง", "นาย", "นางสาว"]}
              onChange={handleChange}
            />
            <Input
              label="ชื่อเด็ก"
              name="fname"
              onChange={handleChange}
              required
            />
            <Input
              label="นามสกุล"
              name="lname"
              onChange={handleChange}
              required
            />
          </Row>
          <Row>
            <Input label="เกิดวันที่ (วว)" name="d" onChange={handleChange} />
            <Input label="เดือน (ดด)" name="m" onChange={handleChange} />
            <Input label="พ.ศ. (ปปปป)" name="y" onChange={handleChange} />
            <Input label="อายุ (ปี)" name="age" onChange={handleChange} />
          </Row>
          <Row>
            <Input
              label="เลขประจำตัวประชาชน 13 หลัก"
              name="sid"
              maxLength="13"
              onChange={handleChange}
              required
            />
          </Row>
          <Row>
            <Input
              label="โรงเรียน/ศูนย์การศึกษา"
              name="school_name"
              onChange={handleChange}
              required
            />
            <Input
              label="ระดับชั้น"
              name="school_level"
              onChange={handleChange}
            />
          </Row>
          <Select
            label="สถานะที่อยู่อาศัย"
            name="housingStatus"
            options={[
              { l: "บ้านของตนเอง", v: "a1" },
              { l: "บ้านเช่า", v: "a2" },
              { l: "บ้านพักหน่วยงาน", v: "a3" },
              { l: "อาศัยผู้อื่นอยู่", v: "a4" },
              { l: "ไม่มีที่อยู่อาศัยเป็นหลักแหล่ง", v: "a5" },
            ]}
            onChange={handleChange}
          />
          <textarea
            name="address_now"
            placeholder="ที่อยู่ปัจจุบัน (บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์)..."
            style={textStyle}
            onChange={handleChange}
          ></textarea>
          <textarea
            name="address_reg"
            placeholder="ที่อยู่ตามทะเบียนบ้าน..."
            style={textStyle}
            onChange={handleChange}
          ></textarea>
          <Input
            label="ลิงก์พิกัดบ้าน (Google Map)"
            name="home_map"
            onChange={handleChange}
          />
        </Section>

        <Section title="ข้อมูลบิดา">
          <Select
            label="สถานะบิดา"
            name="f_status"
            options={["มีชีวิตอยู่", "ถึงแก่กรรม"]}
            onChange={handleChange}
          />
          <Row>
            <Input label="ชื่อบิดา" name="f_name" onChange={handleChange} />
            <Input
              label="นามสกุลบิดา"
              name="f_surname"
              onChange={handleChange}
            />
            <Input label="เลข ปชช. บิดา" name="f_id" onChange={handleChange} />
          </Row>
          <Row>
            <Input label="อาชีพ" name="f_job" onChange={handleChange} />
            <Input
              label="รายได้ต่อเดือน (บาท)"
              name="f_income"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="เบอร์โทรบ้าน" name="f_tel" onChange={handleChange} />
            <Input
              label="เบอร์มือถือ"
              name="f_mobile"
              onChange={handleChange}
            />
          </Row>
        </Section>

        <Section title="ข้อมูลมารดา">
          <Select
            label="สถานะมารดา"
            name="m_status"
            options={["มีชีวิตอยู่", "ถึงแก่กรรม"]}
            onChange={handleChange}
          />
          <Row>
            <Input label="ชื่อมารดา" name="m_name" onChange={handleChange} />
            <Input
              label="นามสกุลมารดา"
              name="m_surname"
              onChange={handleChange}
            />
            <Input label="เลข ปชช. มารดา" name="m_id" onChange={handleChange} />
          </Row>
          <Row>
            <Input label="อาชีพ" name="m_job" onChange={handleChange} />
            <Input
              label="รายได้ต่อเดือน (บาท)"
              name="m_income"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="เบอร์โทรบ้าน" name="m_tel" onChange={handleChange} />
            <Input
              label="เบอร์มือถือ"
              name="m_mobile"
              onChange={handleChange}
            />
          </Row>
        </Section>

        <Section title="สถานภาพครอบครัว และ ข้อมูลผู้ปกครอง">
          <Select
            label="สถานภาพบิดามารดา"
            name="maritalStatus"
            options={[
              { l: "อยู่ร่วมกัน (จดทะเบียนสมรส)", v: "s1" },
              { l: "อยู่ร่วมกัน (ไม่จดทะเบียนสมรส)", v: "s2" },
              { l: "แยกกันอยู่", v: "s3" },
              { l: "หย่าร้าง", v: "s4" },
            ]}
            onChange={handleChange}
          />

          <p style={{ marginTop: "15px", color: "#555" }}>
            <b>ข้อมูลผู้ปกครอง (กรอกกรณีที่ผู้ปกครองไม่ใช่บิดาหรือมารดา)</b>
          </p>
          <Select
            label="ประเภทผู้ปกครอง"
            name="g_type"
            options={[
              { l: "ปู่ ย่า ตา ยาย", v: "g1" },
              { l: "บุคคลอื่น", v: "g2" },
            ]}
            onChange={handleChange}
          />
          <Row>
            <Input
              label="ชื่อผู้ปกครอง"
              name="g_name"
              onChange={handleChange}
            />
            <Input label="นามสกุล" name="g_surname" onChange={handleChange} />
            <Input
              label="ความเกี่ยวข้องเป็น"
              name="g_relation"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input
              label="เลข ปชช. ผู้ปกครอง"
              name="g_id"
              onChange={handleChange}
            />
            <Input label="อาชีพ" name="g_job" onChange={handleChange} />
            <Input
              label="รายได้ต่อเดือน"
              name="g_income"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input label="เบอร์โทรบ้าน" name="g_tel" onChange={handleChange} />
            <Input
              label="เบอร์มือถือ"
              name="g_mobile"
              onChange={handleChange}
            />
          </Row>
        </Section>

        <Section title="ลงชื่อผู้ปกครอง (ส่วนที่ 1)">
          <Input
            label="ชื่อ-สกุล ผู้ยื่นความจำนง (พิมพ์ชื่อเต็ม)"
            name="parent_full_name"
            onChange={handleChange}
          />
          <Row>
            <Input label="วันที่ลงชื่อ" name="sign_d" onChange={handleChange} />
            <Input label="เดือน" name="sign_m" onChange={handleChange} />
            <Input label="ปี พ.ศ." name="sign_y" onChange={handleChange} />
          </Row>
        </Section>

        <Section title="ส่วนที่ 2: แบบสอบข้อเท็จจริงผู้ขอรับทุน">
          <p>
            <b>คุณสมบัติผู้ขอรับทุน (เลือกได้มากกว่า 1 ข้อ)</b>
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                name="quals"
                value="q1"
                onChange={handleCheckbox}
              />{" "}
              มีสัญชาติไทย
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
              มีสมุดประจำตัวคนพิการ / ใบรับรองความพิการ
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
              อายุไม่เกิน 18 ปีบริบูรณ์ (นับถึงวันที่ 31 พ.ค.
              ของปีการศึกษาที่ขอรับทุน)
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
              อายุเกิน 18 ปีบริบูรณ์ และกำลังศึกษาอยู่
            </label>
          </div>

          <p>
            <b>เอกสารที่แนบ (ติ๊กเอกสารที่มี)</b>
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                name="docs"
                value="doc1"
                onChange={handleCheckbox}
              />{" "}
              สำเนาทะเบียนบ้านผู้ปกครอง
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
              สำเนาบัตรประจำตัวประชาชนผู้ปกครอง
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
              สำเนาสูติบัตรเด็ก (กรณีเด็กอายุยังไม่ทำบัตร ปชช.)
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
              สำเนาทะเบียนบ้านเด็ก และ สำเนาบัตรประจำตัวประชาชนเด็ก
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
              สำเนาบัตรประจำตัวประชาชนผู้รับรองความพิการ
              (กรณีไม่จดทะเบียนคนพิการ)
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
              สำเนาสมุดประจำตัวคนพิการ
            </label>
          </div>

          <p>
            <b>ประวัติการรับความช่วยเหลือจากหน่วยงานอื่น</b>
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                name="helps"
                value="help1"
                onChange={handleCheckbox}
              />{" "}
              ไม่เคยได้รับความช่วยเหลือใดๆ
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
              ได้รับเบี้ยยังชีพคนพิการ เดือนละ 1,000 บาท
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
              ได้รับทุนอื่นๆ ระบุ:
            </label>{" "}
            <Input
              name="help_detail"
              placeholder="ระบุชื่อทุนและจำนวนเงิน (ถ้ามี)"
              onChange={handleChange}
            />
          </div>

          <p>
            <b>สภาพครอบครัว</b>
          </p>
          <Row>
            <Input
              label="จำนวนสมาชิกในครอบครัวทั้งหมด (คน)"
              name="family_count"
              type="number"
              onChange={handleChange}
            />
            <Input
              label="ภาระหนี้สินรวม (บาท)"
              name="debt_amount"
              type="number"
              onChange={handleChange}
            />
          </Row>
          <textarea
            name="family_detail"
            placeholder="โปรดระบุสภาพปัญหาความเดือดร้อนของครอบครัวอย่างละเอียด..."
            style={textStyle}
            onChange={handleChange}
          ></textarea>

          <Row>
            <Select
              label="สภาพความเป็นอยู่"
              name="living"
              options={["ดี", "ปานกลาง", "ขัดสนขาดแคลน"]}
              onChange={handleChange}
            />
            <Select
              label="สภาพสิ่งแวดล้อม"
              name="env"
              options={["ดี", "ปานกลาง", "ขัดสนขาดแคลน"]}
              onChange={handleChange}
            />
          </Row>
        </Section>

        <Section title="ลงชื่อครูผู้สอบข้อเท็จจริง (ส่วนที่ 2)">
          <Input
            label="ชื่อผู้ยื่นคำร้อง (ผู้ปกครอง)"
            name="applicant_full_name"
            onChange={handleChange}
          />
          <Input
            label="ชื่อ-สกุล ครูผู้สอบข้อเท็จจริง/ผู้รับรอง"
            name="interviewer_full_name"
            onChange={handleChange}
            required
          />
          <Row>
            <Input
              label="ตำแหน่ง"
              name="interviewer_pos"
              onChange={handleChange}
            />
            <Input
              label="หน่วยงานต้นสังกัด"
              name="interviewer_org"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Input
              label="วันที่สัมภาษณ์"
              name="int_d"
              onChange={handleChange}
            />
            <Input label="เดือน" name="int_m" onChange={handleChange} />
            <Input label="ปี พ.ศ." name="int_y" onChange={handleChange} />
          </Row>
        </Section>

        <button type="submit" disabled={isSubmitting} style={btnStyle}>
          {isSubmitting
            ? "⏳ กำลังบันทึกข้อมูล... กรุณารอสักครู่"
            : "ส่งใบสมัคร ➔"}
        </button>
      </form>
    </div>
  );
}

// ==========================================
// Component ย่อยเพื่อจัดระเบียบหน้าตาเว็บให้โค้ดสั้นและสวยงาม
// ==========================================
const Section = ({ title, children }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      backgroundColor: "#fafafa",
    }}
  >
    <h3
      style={{
        marginTop: 0,
        color: "#800000",
        borderBottom: "1px solid #ccc",
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
      gap: "15px",
      marginBottom: "15px",
      flexWrap: "wrap",
    }}
  >
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ flex: 1, minWidth: "200px" }}>
    <label style={{ fontSize: "13px", color: "#444", fontWeight: "bold" }}>
      {label}
    </label>
    <input {...props} style={inputStyle} />
  </div>
);

const Select = ({ label, name, options, onChange }) => (
  <div style={{ flex: 1, minWidth: "200px" }}>
    <label style={{ fontSize: "13px", color: "#444", fontWeight: "bold" }}>
      {label}
    </label>
    <select name={name} onChange={onChange} style={inputStyle}>
      {options.map((opt) => (
        <option key={opt.v || opt} value={opt.v || opt}>
          {opt.l || opt}
        </option>
      ))}
    </select>
  </div>
);

// ==========================================
// CSS Styles
// ==========================================
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #bbb",
  marginTop: "5px",
  boxSizing: "border-box",
  fontSize: "15px",
};
const textStyle = {
  width: "100%",
  height: "80px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #bbb",
  marginTop: "10px",
  boxSizing: "border-box",
  fontSize: "15px",
  resize: "vertical",
};
const btnStyle = {
  width: "100%",
  padding: "15px",
  background: "#800000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
};
