// Cấu hình ngôn ngữ
const i18n = {
  vi: {
    selectType: "Chọn loại Anten",
    optDipole: "Anten Lưỡng cực (Dipole)",
    optMonopole: "Anten Đơn cực (Monopole)",
    optPatch: "Anten Vi dải (Microstrip)",
    lblFreq: "Tần số hoạt động (MHz)",
    lblEr: "Hằng số điện môi (εr)",
    lblH: "Độ dày mạch (h) - mm",
    btnCalc: "TÍNH TOÁN NGAY",
    lblResult: "Kết quả thiết kế",
    resL: "Chiều dài (L)",
    resW: "Chiều rộng (W)",
    resArm: "Mỗi nhánh",
    note: "Lưu ý: Kết quả mang tính chất lý thuyết.",
  },
  en: {
    selectType: "Select Antenna Type",
    optDipole: "Half-wave Dipole",
    optMonopole: "Quarter-wave Monopole",
    optPatch: "Microstrip Patch",
    lblFreq: "Frequency (MHz)",
    lblEr: "Dielectric Constant (εr)",
    lblH: "Substrate Height (h) - mm",
    btnCalc: "CALCULATE NOW",
    lblResult: "Design Results",
    resL: "Length (L)",
    resW: "Width (W)",
    resArm: "Each Arm",
    note: "Note: Theoretical results.",
  },
};

let currentLang = "vi";

// Chuyển đổi ngôn ngữ
function toggleLang() {
  currentLang = currentLang === "vi" ? "en" : "vi";
  document.getElementById("lang-btn").innerText =
    currentLang === "vi" ? "EN" : "VI";
  updateUIText();
}

function updateUIText() {
  const t = i18n[currentLang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.innerText = t[key];
  });
  // Update options text manually
  const sel = document.getElementById("antennaType");
  sel.options[0].text = t.optDipole;
  sel.options[1].text = t.optMonopole;
  sel.options[2].text = t.optPatch;
}

// Ẩn hiện input theo loại anten
function updateInputs() {
  const type = document.getElementById("antennaType").value;
  const microInputs = document.getElementById("microstrip-inputs");
  if (type === "patch") {
    microInputs.classList.remove("hidden");
  } else {
    microInputs.classList.add("hidden");
  }
  document.getElementById("result").classList.add("hidden");
}

// Hàm tính toán chính
function calculate() {
  const type = document.getElementById("antennaType").value;
  const f_MHz = parseFloat(document.getElementById("freq").value);
  const t = i18n[currentLang];

  if (!f_MHz || f_MHz <= 0) {
    alert("Vui lòng nhập tần số hợp lệ!");
    return;
  }

  let html = "";

  // 1. DIPOLE
  if (type === "dipole") {
    // L = 142.5 / f (m) -> đổi ra cm cho dễ nhìn
    let L_cm = (142.5 / f_MHz) * 100;
    let Arm_cm = L_cm / 2;
    html = `
            <div class="result-item"><span>${
              t.resL
            }</span> <span class="result-val">${L_cm.toFixed(2)} cm</span></div>
            <div class="result-item"><span>${
              t.resArm
            }</span> <span class="result-val">${Arm_cm.toFixed(
      2
    )} cm</span></div>
        `;
  }
  // 2. MONOPOLE
  else if (type === "monopole") {
    let L_cm = (71.25 / f_MHz) * 100;
    html = `
            <div class="result-item"><span>${
              t.resL
            }</span> <span class="result-val">${L_cm.toFixed(2)} cm</span></div>
        `;
  }
  // 3. MICROSTRIP PATCH
  else if (type === "patch") {
    let er = parseFloat(document.getElementById("er").value);
    let h_mm = parseFloat(document.getElementById("h").value);

    // Logic tính toán Vi dải
    const c = 3e8;
    let f = f_MHz * 1e6; // Hz
    let h = h_mm / 1000; // m

    let W = (c / (2 * f)) * Math.sqrt(2 / (er + 1));
    let term1 = (er + 1) / 2;
    let term2 = ((er - 1) / 2) * Math.pow(1 + 12 * (h / W), -0.5);
    let ereff = term1 + term2;
    let tu = (ereff + 0.3) * (W / h + 0.264);
    let mau = (ereff - 0.258) * (W / h + 0.8);
    let deltaL = 0.412 * h * (tu / mau);
    let Leff = c / (2 * f * Math.sqrt(ereff));
    let L = Leff - 2 * deltaL;

    html = `
            <div class="result-item"><span>${
              t.resW
            }</span> <span class="result-val">${(W * 1000).toFixed(
      2
    )} mm</span></div>
            <div class="result-item"><span>${
              t.resL
            }</span> <span class="result-val">${(L * 1000).toFixed(
      2
    )} mm</span></div>
        `;
  }

  document.getElementById("result-content").innerHTML = html;
  document.getElementById("result").classList.remove("hidden");
}

// Khởi tạo
updateUIText();
