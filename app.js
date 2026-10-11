const opsins = {
  chr2: {
    name: "ChR2",
    type: "兴奋型",
    ideal: 470,
    color: "#2d7dff",
    glow: "rgba(45, 125, 255, 0.32)",
    direction: 1,
    baseDelta: 22,
    note: "ChR2 常用于蓝光激活神经元，教学模型中表现为去极化和放电概率上升。"
  },
  nphr: {
    name: "NpHR",
    type: "抑制型",
    ideal: 590,
    color: "#f0a22a",
    glow: "rgba(240, 162, 42, 0.32)",
    direction: -1,
    baseDelta: 18,
    note: "NpHR 常用黄光激活，教学模型中表现为膜电位更负、神经元活动降低。"
  },
  archt: {
    name: "ArchT",
    type: "抑制型",
    ideal: 530,
    color: "#1fa87a",
    glow: "rgba(31, 168, 122, 0.32)",
    direction: -1,
    baseDelta: 16,
    note: "ArchT 常用绿光激活，适合用来说明不同抑制工具与光谱选择。"
  }
};

const state = {
  opsin: "chr2",
  wavelength: 470,
  intensity: 60,
  frequency: 20,
  duration: 2,
  running: false,
  startedAt: 0,
  phase: 0
};

const els = {
  heroCanvas: document.getElementById("heroCanvas"),
  neuronCanvas: document.getElementById("neuronCanvas"),
  opsinSelect: document.getElementById("opsinSelect"),
  wavelength: document.getElementById("wavelength"),
  intensity: document.getElementById("intensity"),
  frequency: document.getElementById("frequency"),
  duration: document.getElementById("duration"),
  wavelengthValue: document.getElementById("wavelengthValue"),
  intensityValue: document.getElementById("intensityValue"),
  frequencyValue: document.getElementById("frequencyValue"),
  durationValue: document.getElementById("durationValue"),
  proteinNote: document.getElementById("proteinNote"),
  responseTitle: document.getElementById("responseTitle"),
  potentialValue: document.getElementById("potentialValue"),
  wavePath: document.getElementById("wavePath"),
  lightPath: document.getElementById("lightPath"),
  stimulateBtn: document.getElementById("stimulateBtn"),
  resetBtn: document.getElementById("resetBtn"),
  quizForm: document.getElementById("quizForm"),
  quizResult: document.getElementById("quizResult")
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wavelengthMatch(opsin, wavelength) {
  const distance = Math.abs(wavelength - opsin.ideal);
  return clamp(1 - distance / 110, 0.08, 1);
}

function predictedDelta() {
  const opsin = opsins[state.opsin];
  const match = wavelengthMatch(opsin, state.wavelength);
  const intensity = state.intensity / 100;
  const frequencyBoost = 0.72 + Math.min(state.frequency, 40) / 95;
  return opsin.direction * opsin.baseDelta * match * intensity * frequencyBoost;
}

function predictedPeak() {
  return Math.round(-70 + predictedDelta());
}

function updateLabels() {
  const opsin = opsins[state.opsin];
  els.wavelengthValue.textContent = `${state.wavelength} nm`;
  els.intensityValue.textContent = `${state.intensity}%`;
  els.frequencyValue.textContent = `${state.frequency} Hz`;
  els.durationValue.textContent = `${Number(state.duration).toFixed(1)} s`;
  els.proteinNote.textContent = opsin.note;
  els.responseTitle.textContent = `预测反应：${opsin.type === "兴奋型" ? "去极化增强" : "活动受到抑制"}`;
  els.potentialValue.textContent = `${predictedPeak()} mV`;
  els.potentialValue.style.color = opsin.direction > 0 ? "#2478ff" : "#15956f";
}

function drawHero(time) {
  const canvas = els.heroCanvas;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const pulse = (Math.sin(time / 420) + 1) / 2;

  ctx.clearRect(0, 0, w, h);
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#071326");
  gradient.addColorStop(1, "#113e57");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 90; i += 1) {
    const x = (i * 89 + time * 0.018) % w;
    const y = (i * 47) % h;
    ctx.fillStyle = `rgba(105, 184, 255, ${0.08 + (i % 5) * 0.018})`;
    ctx.fillRect(x, y, 2, 2);
  }

  drawNeuronShape(ctx, w * 0.48, h * 0.53, 1.1, "#9ed8ff", pulse);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `rgba(56, 143, 255, ${0.35 + pulse * 0.45})`;
  ctx.lineWidth = 18 + pulse * 8;
  ctx.beginPath();
  ctx.moveTo(w * 0.12, h * 0.18);
  ctx.lineTo(w * 0.48, h * 0.48);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#d8edff";
  ctx.font = "700 24px Microsoft YaHei, Arial";
  ctx.fillText("蓝光刺激", 48, 68);
  ctx.font = "16px Microsoft YaHei, Arial";
  ctx.fillStyle = "rgba(216, 237, 255, 0.76)";
  ctx.fillText("光敏蛋白表达后，光才具有细胞特异性控制意义", 48, 98);
}

function drawNeuronShape(ctx, cx, cy, scale, color, pulse) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const branches = [
    [-55, -20, -180, -98],
    [-48, 18, -160, 82],
    [12, -42, 95, -140],
    [42, 20, 210, 68],
    [10, 48, 70, 150],
    [56, -8, 190, -50]
  ];

  ctx.lineCap = "round";
  branches.forEach(([x1, y1, x2, y2], index) => {
    ctx.strokeStyle = `rgba(158, 216, 255, ${0.45 + pulse * 0.18})`;
    ctx.lineWidth = 8 - (index % 3);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1 * 1.4, y1 * 0.8, x2 * 0.75, y2 * 0.8, x2, y2);
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1 * 1.4, y1 * 0.8, x2 * 0.75, y2 * 0.8, x2, y2);
    ctx.stroke();
  });

  const soma = ctx.createRadialGradient(-18, -18, 8, 0, 0, 58 + pulse * 8);
  soma.addColorStop(0, "#ffffff");
  soma.addColorStop(0.42, color);
  soma.addColorStop(1, "rgba(36, 120, 255, 0.18)");
  ctx.fillStyle = soma;
  ctx.beginPath();
  ctx.ellipse(0, 0, 62 + pulse * 4, 48 + pulse * 3, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(13, 29, 51, 0.64)";
  ctx.beginPath();
  ctx.arc(8, -4, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNeuron(time) {
  const canvas = els.neuronCanvas;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const opsin = opsins[state.opsin];
  const elapsed = state.running ? (time - state.startedAt) / 1000 : 0;
  const active = state.running && elapsed <= state.duration;
  const pulse = active ? (Math.sin(time / Math.max(28, 800 / state.frequency)) + 1) / 2 : 0.15;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#081527";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 40; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  if (active) {
    const beam = ctx.createLinearGradient(0, 0, w * 0.52, h * 0.48);
    beam.addColorStop(0, opsin.glow);
    beam.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(0, 78);
    ctx.lineTo(w * 0.58, h * 0.43);
    ctx.lineTo(w * 0.42, h * 0.65);
    ctx.lineTo(0, 180);
    ctx.closePath();
    ctx.fill();
  }

  drawNeuronShape(ctx, w * 0.54, h * 0.51, 1.05, active ? opsin.color : "#9ed8ff", pulse);

  const ionCount = Math.round(8 + state.intensity / 6);
  for (let i = 0; i < ionCount; i += 1) {
    const angle = (i / ionCount) * Math.PI * 2 + time / 800;
    const radius = 70 + (i % 4) * 13 + pulse * 16;
    const x = w * 0.54 + Math.cos(angle) * radius;
    const y = h * 0.51 + Math.sin(angle) * radius * 0.72;
    ctx.fillStyle = opsin.direction > 0 ? "rgba(84, 169, 255, 0.82)" : "rgba(74, 218, 166, 0.78)";
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.font = "700 22px Microsoft YaHei, Arial";
  ctx.fillText(`${opsin.name} · ${opsin.type}`, 28, 42);
  ctx.font = "16px Microsoft YaHei, Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.66)";
  ctx.fillText(`波长 ${state.wavelength} nm ｜ 光强 ${state.intensity}% ｜ 频率 ${state.frequency} Hz`, 28, 70);

  if (state.running && elapsed > state.duration) {
    state.running = false;
  }
}

function buildWavePath() {
  const opsin = opsins[state.opsin];
  const delta = predictedDelta();
  const durationFactor = state.duration / 5;
  const points = [];
  const lightPoints = [];
  const total = 160;
  for (let i = 0; i <= total; i += 1) {
    const t = i / total;
    const x = 40 + t * 830;
    const stimWindow = t > 0.2 && t < 0.2 + durationFactor * 0.56;
    const envelope = stimWindow ? Math.sin(((t - 0.2) / Math.max(0.1, durationFactor * 0.56)) * Math.PI) : 0;
    const pulses = Math.sin(t * Math.PI * state.frequency * 0.85);
    const mv = -70 + delta * envelope + (stimWindow ? pulses * 2.8 * Math.abs(delta / 20) : 0);
    const y = 145 - ((mv + 90) / 60) * 120;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${clamp(y, 22, 154).toFixed(1)}`);

    const ly = stimWindow ? 132 - Math.max(8, state.intensity / 2) * (0.55 + 0.45 * Math.abs(pulses)) : 145;
    lightPoints.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${ly.toFixed(1)}`);
  }
  els.wavePath.setAttribute("d", points.join(" "));
  els.wavePath.style.stroke = opsin.direction > 0 ? "#2478ff" : "#15956f";
  els.lightPath.setAttribute("d", lightPoints.join(" "));
}

function syncFromInputs() {
  state.opsin = els.opsinSelect.value;
  state.wavelength = Number(els.wavelength.value);
  state.intensity = Number(els.intensity.value);
  state.frequency = Number(els.frequency.value);
  state.duration = Number(els.duration.value);
  updateLabels();
  buildWavePath();
}

function setDefaultsForOpsin() {
  const opsin = opsins[els.opsinSelect.value];
  els.wavelength.value = opsin.ideal;
  syncFromInputs();
}

function animate(time) {
  drawHero(time);
  drawNeuron(time);
  window.requestAnimationFrame(animate);
}

els.opsinSelect.addEventListener("change", setDefaultsForOpsin);
["wavelength", "intensity", "frequency", "duration"].forEach((id) => {
  els[id].addEventListener("input", syncFromInputs);
});

els.stimulateBtn.addEventListener("click", () => {
  state.running = true;
  state.startedAt = performance.now();
});

els.resetBtn.addEventListener("click", () => {
  els.opsinSelect.value = "chr2";
  els.wavelength.value = 470;
  els.intensity.value = 60;
  els.frequency.value = 20;
  els.duration.value = 2;
  state.running = false;
  syncFromInputs();
});

els.quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answers = { q1: "b", q2: "a", q3: "b", q4: "a", q5: "c" };
  const form = new FormData(els.quizForm);
  let score = 0;
  Object.entries(answers).forEach(([key, value]) => {
    if (form.get(key) === value) score += 1;
  });
  const advice = score >= 4
    ? "概念掌握较好。下一步可以让学生解释为什么波长匹配会影响反应强度。"
    : "建议回到三步原理：表达光敏蛋白、给予特定光、观察细胞反应。尤其要分清动物研究、人体研究和常规临床治疗。";
  els.quizResult.classList.add("show");
  els.quizResult.innerHTML = `<strong>得分：${score}/5。</strong><p>${advice}</p>`;
});

syncFromInputs();
buildWavePath();
window.requestAnimationFrame(animate);
