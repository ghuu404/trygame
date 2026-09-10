/* ================================================================
 *  process-svg.js — 行医模块的 SVG 绘图工具
 * ================================================================ */

/* ----- 匾额 ----- */
function buildPlaqueSVG() {
  return `
    <rect x="110" y="14" width="140" height="42" rx="4" fill="#3a1a08" stroke="#1a0a00" stroke-width="2"/>
    <rect x="114" y="18" width="132" height="34" rx="3" fill="#5a2a10"/>
    <rect x="114" y="18" width="132" height="34" rx="3" fill="none" stroke="#c9a05a" stroke-width="1.5"/>
    <text x="180" y="42" text-anchor="middle" font-size="20" font-family="KaiTi, STKaiti, serif" fill="#e8c880" letter-spacing="2">妙手回春</text>
  `;
}

/* ----- 药柜 ----- */
function buildCabinetSVG() {
  let s = '';
  const cols = 6, rows = 4;
  const x0 = 12, y0 = 68, w = 56, h = 68;
  const totalW = cols * w, totalH = rows * h;
  s += `<rect x="${x0-6}" y="${y0-6}" width="${totalW+12}" height="${totalH+12}" rx="6" fill="#3a1e0a" stroke="#1a0a00" stroke-width="2"/>`;
  s += `<rect x="${x0-6}" y="${y0-10}" width="${totalW+12}" height="8" rx="2" fill="#5a2a10"/>`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c*w, y = y0 + r*h;
      s += `<rect x="${x+2}" y="${y+2}" width="${w-4}" height="${h-4}" rx="2" fill="#6a3a18" stroke="#2a1206" stroke-width="1.2"/>`;
      s += `<rect x="${x+7}" y="${y+10}" width="${w-14}" height="${h-20}" rx="2" fill="#8a4a22"/>`;
      s += `<rect x="${x+7}" y="${y+10}" width="${w-14}" height="${h-20}" rx="2" fill="none" stroke="#2a1206" stroke-width="0.8"/>`;
      s += `<circle cx="${x+w/2}" cy="${y+h/2+3}" r="3.8" fill="#c9a05a" stroke="#3a1a08" stroke-width="1"/>`;
      s += `<circle cx="${x+w/2}" cy="${y+h/2+3}" r="1.4" fill="#5a3a10"/>`;
    }
  }
  return s;
}

/* ----- 艾草 ----- */
function buildHangingHerbSVG() {
  return `
    <g opacity="0.85">
      <path d="M14 62 Q18 90 20 118" stroke="#4a6a2a" stroke-width="2" fill="none"/>
      <ellipse cx="18" cy="80" rx="6" ry="12" fill="#6a8a3a" transform="rotate(-15 18 80)"/>
      <ellipse cx="22" cy="98" rx="5" ry="10" fill="#5a7a2a" transform="rotate(10 22 98)"/>
      <ellipse cx="18" cy="112" rx="5" ry="9" fill="#6a8a3a" transform="rotate(-10 18 112)"/>
    </g>
    <g opacity="0.85">
      <path d="M346 62 Q342 90 340 118" stroke="#4a6a2a" stroke-width="2" fill="none"/>
      <ellipse cx="342" cy="80" rx="6" ry="12" fill="#6a8a3a" transform="rotate(15 342 80)"/>
      <ellipse cx="338" cy="98" rx="5" ry="10" fill="#5a7a2a" transform="rotate(-10 338 98)"/>
      <ellipse cx="342" cy="112" rx="5" ry="9" fill="#6a8a3a" transform="rotate(10 342 112)"/>
    </g>
  `;
}

/* ----- 医生把脉的手 ----- */
function buildDoctorHandSVG() {
  return `
    <path d="M360 480 Q312 458 278 420 L292 384 Q328 408 360 420 Z" fill="#f5ecd6" stroke="#b0a080" stroke-width="2"/>
    <path d="M278 420 Q300 402 316 408 L292 384 Q272 382 264 398 Z" fill="#ddd0a8" opacity="0.6"/>
    <path d="M292 384 Q308 396 322 396" stroke="#8a7a50" stroke-width="1.5" fill="none"/>
    <ellipse cx="268" cy="362" rx="22" ry="18" fill="#f6d5b4" stroke="#b88a60" stroke-width="2"/>
    <ellipse cx="256" cy="330" rx="6" ry="15" fill="#f6d5b4" stroke="#b88a60" stroke-width="1.5" transform="rotate(-14 256 330)"/>
    <ellipse cx="268" cy="325" rx="6" ry="15" fill="#f6d5b4" stroke="#b88a60" stroke-width="1.5" transform="rotate(-14 268 325)"/>
    <ellipse cx="280" cy="328" rx="6" ry="15" fill="#f6d5b4" stroke="#b88a60" stroke-width="1.5" transform="rotate(-14 280 328)"/>
    <ellipse cx="255" cy="321" rx="2.6" ry="3.8" fill="#f0c8a8" opacity="0.8"/>
    <ellipse cx="267" cy="316" rx="2.6" ry="3.8" fill="#f0c8a8" opacity="0.8"/>
    <ellipse cx="279" cy="319" rx="2.6" ry="3.8" fill="#f0c8a8" opacity="0.8"/>
    <ellipse cx="290" cy="362" rx="12" ry="7" fill="#f6d5b4" stroke="#b88a60" stroke-width="1.5" transform="rotate(20 290 362)"/>
    <path d="M256 356 Q268 366 282 358" stroke="#c9a07a" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M292 384 Q282 396 272 406" stroke="#b0a080" stroke-width="2" fill="none"/>
  `;
}

/* ----- 患者身体 ----- */
function buildBodySVG(look) {
  const { skin, skinShade, robe, robeDark } = look;
  let s = '';
  s += `<rect x="161" y="184" width="38" height="42" rx="8" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>`;
  s += `<path d="M161 206 Q180 216 199 206" stroke="${skinShade}" stroke-width="1.2" fill="none" opacity="0.55"/>`;
  s += `<path d="M100 234 Q180 200 260 234 L280 430 L80 430 Z" fill="${robe}"/>`;
  s += `<path d="M100 234 Q180 200 260 234 L280 430 L80 430 Z" fill="url(#robeShade)" opacity="0.4"/>`;
  s += `<path d="M180 224 L180 430" stroke="${robeDark}" stroke-width="2.4" fill="none" opacity="0.55"/>`;
  s += `<path d="M156 216 L180 270 L204 216 Q180 232 156 216 Z" fill="${robeDark}"/>`;
  s += `<path d="M120 268 Q145 300 132 360" stroke="${robeDark}" stroke-width="1.6" fill="none" opacity="0.35"/>`;
  s += `<path d="M240 268 Q215 300 228 360" stroke="${robeDark}" stroke-width="1.6" fill="none" opacity="0.35"/>`;
  return s;
}

/* ----- 患者头发 ----- */
function buildHairSVG(look) {
  const { hair, hairDark, hairStyle } = look;
  let s = '';
  if (hairStyle === 'bun') {
    s += `<path d="M118 128 Q120 78 180 76 Q240 78 242 128 Q234 100 180 98 Q126 100 118 128 Z" fill="${hair}"/>`;
    s += `<ellipse cx="180" cy="66" rx="26" ry="18" fill="${hair}"/>`;
    s += `<ellipse cx="180" cy="66" rx="26" ry="18" fill="none" stroke="${hairDark}" stroke-width="1.6"/>`;
    s += `<path d="M148 70 Q180 64 212 70" stroke="#8b2a2a" stroke-width="3.5" fill="none"/>`;
  } else if (hairStyle === 'topknot') {
    s += `<path d="M118 128 Q120 78 180 76 Q240 78 242 128 Q234 100 180 98 Q126 100 118 128 Z" fill="${hair}"/>`;
    s += `<circle cx="180" cy="62" r="17" fill="${hair}"/>`;
    s += `<circle cx="180" cy="62" r="17" fill="none" stroke="${hairDark}" stroke-width="1.6"/>`;
  } else if (hairStyle === 'old-bun') {
    s += `<path d="M116 128 Q118 74 180 72 Q242 74 244 128 Q234 98 180 96 Q126 98 116 128 Z" fill="${hair}"/>`;
    s += `<ellipse cx="180" cy="60" rx="24" ry="17" fill="${hair}"/>`;
    s += `<ellipse cx="180" cy="60" rx="24" ry="17" fill="none" stroke="${hairDark}" stroke-width="1.6"/>`;
    s += `<path d="M154 62 Q180 58 206 62" stroke="${hairDark}" stroke-width="1.6" fill="none"/>`;
  } else if (hairStyle === 'longhair') {
    s += `<path d="M112 128 Q112 66 180 64 Q248 66 248 128 Q254 190 244 240 L248 268 L212 268 L212 200 Q214 118 180 116 Q146 118 148 200 L148 268 L112 268 L116 240 Q106 190 112 128 Z" fill="${hair}"/>`;
    s += `<ellipse cx="180" cy="54" rx="30" ry="20" fill="${hair}"/>`;
    s += `<ellipse cx="180" cy="54" rx="30" ry="20" fill="none" stroke="${hairDark}" stroke-width="1.6"/>`;
    s += `<line x1="156" y1="54" x2="206" y2="46" stroke="#d4af37" stroke-width="3"/>`;
    s += `<circle cx="206" cy="46" r="4" fill="#d4af37" stroke="#8a6a10" stroke-width="1"/>`;
  } else if (hairStyle === 'towel') {
    s += `<path d="M116 124 Q120 76 180 74 Q240 76 244 124 Q234 100 180 98 Q126 100 116 124 Z" fill="${hair}" opacity="0.75"/>`;
    s += `<path d="M114 124 Q120 74 180 72 Q240 74 246 124 Q246 134 240 142 Q232 116 180 114 Q128 116 120 142 Q114 134 114 124 Z" fill="#4a6a8a"/>`;
    s += `<path d="M114 124 Q110 138 116 152" stroke="#4a6a8a" stroke-width="5" fill="none"/>`;
    s += `<path d="M246 124 Q250 138 244 152" stroke="#4a6a8a" stroke-width="5" fill="none"/>`;
  }
  return s;
}

/* ----- 患者面部 ----- */
function buildFaceSVG(look, expr) {
  const arr = [];
  const dark = '#3a2a1a';
  const { hair, blush, redFace, sweat, wrinkles, beard } = look;

  if (blush) {
    arr.push(`<ellipse cx="138" cy="172" rx="14" ry="8" fill="#e88a8a" opacity="0.42"/>`);
    arr.push(`<ellipse cx="222" cy="172" rx="14" ry="8" fill="#e88a8a" opacity="0.42"/>`);
  }
  if (redFace) {
    arr.push(`<ellipse cx="138" cy="172" rx="20" ry="13" fill="#e06060" opacity="0.48"/>`);
    arr.push(`<ellipse cx="222" cy="172" rx="20" ry="13" fill="#e06060" opacity="0.48"/>`);
    arr.push(`<ellipse cx="180" cy="158" rx="42" ry="12" fill="#e06060" opacity="0.2"/>`);
  }

  if (expr.eyebrow === 'worried') {
    arr.push(`<path d="M138 124 Q152 116 166 124" stroke="${dark}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M194 124 Q208 116 222 124" stroke="${dark}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`);
  } else if (expr.eyebrow === 'angry') {
    arr.push(`<path d="M138 126 L168 118" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M192 118 L222 126" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  } else if (expr.eyebrow === 'sad') {
    arr.push(`<path d="M138 120 Q152 126 166 128" stroke="${dark}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M194 128 Q208 126 222 120" stroke="${dark}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`);
  } else {
    arr.push(`<path d="M138 124 Q152 120 166 124" stroke="${dark}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M194 124 Q208 120 222 124" stroke="${dark}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`);
  }

  if (expr.eye === 'closed') {
    arr.push(`<path d="M140 150 Q152 158 164 150" stroke="${dark}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M196 150 Q208 158 220 150" stroke="${dark}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`);
  } else if (expr.eye === 'wide') {
    arr.push(`<ellipse cx="152" cy="150" rx="12" ry="13" fill="#fff" stroke="${dark}" stroke-width="1.2"/>`);
    arr.push(`<ellipse cx="208" cy="150" rx="12" ry="13" fill="#fff" stroke="${dark}" stroke-width="1.2"/>`);
    arr.push(`<circle cx="152" cy="151" r="8" fill="${dark}"/>`);
    arr.push(`<circle cx="208" cy="151" r="8" fill="${dark}"/>`);
    arr.push(`<circle cx="149" cy="148" r="3" fill="#fff"/>`);
    arr.push(`<circle cx="205" cy="148" r="3" fill="#fff"/>`);
  } else if (expr.eye === 'squint') {
    arr.push(`<ellipse cx="152" cy="150" rx="11" ry="7" fill="#fff"/>`);
    arr.push(`<ellipse cx="208" cy="150" rx="11" ry="7" fill="#fff"/>`);
    arr.push(`<circle cx="152" cy="151" r="5.5" fill="${dark}"/>`);
    arr.push(`<circle cx="208" cy="151" r="5.5" fill="${dark}"/>`);
    arr.push(`<path d="M140 146 Q152 141 164 146" stroke="${dark}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M196 146 Q208 141 220 146" stroke="${dark}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`);
  } else if (expr.eye === 'tired') {
    arr.push(`<ellipse cx="152" cy="151" rx="10" ry="7" fill="#fff"/>`);
    arr.push(`<ellipse cx="208" cy="151" rx="10" ry="7" fill="#fff"/>`);
    arr.push(`<circle cx="152" cy="152" r="5" fill="${dark}"/>`);
    arr.push(`<circle cx="208" cy="152" r="5" fill="${dark}"/>`);
    arr.push(`<path d="M140 148 Q152 146 164 148" stroke="${dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    arr.push(`<path d="M196 148 Q208 146 220 148" stroke="${dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  }

  arr.push(`<path d="M178 168 Q174 178 183 183" stroke="#b88060" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);

  if (expr.mouth === 'pain') {
    arr.push(`<path d="M160 198 Q180 190 200 198" stroke="#8b3a3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`);
  } else if (expr.mouth === 'open') {
    arr.push(`<ellipse cx="180" cy="198" rx="9" ry="7" fill="#5a1010"/>`);
    arr.push(`<ellipse cx="180" cy="196" rx="6.5" ry="3.5" fill="#8b3a3a"/>`);
  } else if (expr.mouth === 'sigh') {
    arr.push(`<path d="M164 198 Q180 206 196 198" stroke="#8b3a3a" stroke-width="2.8" fill="none" stroke-linecap="round"/>`);
  } else {
    arr.push(`<path d="M164 198 Q180 204 196 198" stroke="#8b3a3a" stroke-width="2.8" fill="none" stroke-linecap="round"/>`);
  }

  if (beard === 'short') {
    arr.push(`<path d="M154 216 Q180 240 206 216 Q204 232 180 235 Q156 232 154 216 Z" fill="${hair}" opacity="0.75"/>`);
  } else if (beard === 'long-white') {
    arr.push(`<path d="M150 214 Q180 252 210 214 Q215 252 180 270 Q145 252 150 214 Z" fill="#ececea" stroke="#a8a8a0" stroke-width="1"/>`);
    arr.push(`<path d="M158 194 Q168 202 180 197 Q192 202 202 194" stroke="#ececea" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  }

  if (sweat) {
    arr.push(`<ellipse cx="128" cy="108" rx="3.6" ry="5.4" fill="#7ec8e3" opacity="0.9"/>`);
    arr.push(`<ellipse cx="234" cy="120" rx="3" ry="4.6" fill="#7ec8e3" opacity="0.9"/>`);
    arr.push(`<ellipse cx="122" cy="126" rx="2.4" ry="4" fill="#7ec8e3" opacity="0.7"/>`);
    arr.push(`<ellipse cx="240" cy="140" rx="2.4" ry="3.5" fill="#7ec8e3" opacity="0.7"/>`);
  }

  if (wrinkles) {
    arr.push(`<path d="M142 122 Q180 114 218 122" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.4"/>`);
    arr.push(`<path d="M144 116 Q180 108 216 116" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.3"/>`);
    arr.push(`<path d="M134 146 L126 141" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.55"/>`);
    arr.push(`<path d="M134 151 L126 151" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.55"/>`);
    arr.push(`<path d="M226 146 L234 141" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.55"/>`);
    arr.push(`<path d="M226 151 L234 151" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.55"/>`);
  }
  return arr.join('');
}

/* ----- 头部 ----- */
function buildHeadSVG(look, expr) {
  const { skin, skinShade } = look;
  let s = '';
  s += `<ellipse cx="116" cy="152" rx="11" ry="16" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>`;
  s += `<ellipse cx="244" cy="152" rx="11" ry="16" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>`;
  s += `<ellipse cx="180" cy="146" rx="66" ry="72" fill="${skin}"/>`;
  s += `<ellipse cx="180" cy="184" rx="50" ry="26" fill="${skinShade}" opacity="0.15"/>`;
  s += buildHairSVG(look);
  s += buildFaceSVG(look, expr);
  return s;
}

/* ----- 望诊异常手臂 ----- */
function buildAbnormalArmSVG(look, pose) {
  const { skin, skinShade, robe, robeDark } = look;
  if (pose === 'neck') {
    return `
      <path d="M260 234 Q268 200 216 196" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <path d="M260 234 Q268 200 216 196" stroke="${robeDark}" stroke-width="28" fill="none" stroke-linecap="round" opacity="0.15"/>
      <ellipse cx="196" cy="200" rx="15" ry="13" fill="${skin}" stroke="${skinShade}" stroke-width="1" transform="rotate(-25 196 200)"/>
      <path d="M100 234 Q88 296 96 356" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="96" cy="358" rx="14" ry="13" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    `;
  }
  if (pose === 'hug') {
    return `
      <path d="M260 234 Q212 278 118 266" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <path d="M100 240 Q158 296 246 286" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="118" cy="268" rx="14" ry="12" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
      <ellipse cx="246" cy="288" rx="14" ry="12" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    `;
  }
  if (pose === 'ribs') {
    return `
      <path d="M260 234 Q296 268 262 306" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="256" cy="308" rx="15" ry="13" fill="${skin}" stroke="${skinShade}" stroke-width="1" transform="rotate(20 256 308)"/>
      <path d="M100 234 Q88 296 96 356" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="96" cy="358" rx="14" ry="13" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    `;
  }
  if (pose === 'collar') {
    return `
      <path d="M100 240 Q84 200 138 200" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <path d="M260 240 Q276 200 222 200" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="144" cy="204" rx="14" ry="12" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
      <ellipse cx="216" cy="204" rx="14" ry="12" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    `;
  }
  if (pose === 'belly') {
    return `
      <path d="M100 234 Q88 300 150 322" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <path d="M260 234 Q272 300 210 322" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="156" cy="324" rx="15" ry="13" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
      <ellipse cx="204" cy="324" rx="15" ry="13" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    `;
  }
  return '';
}

/* ----- 切脉姿态手臂 ----- */
function buildArmOnTableSVG(look) {
  const { skin, skinShade, robe, robeDark } = look;
  return `
    <path d="M100 234 Q88 300 96 380" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
    <path d="M260 234 Q300 272 296 330 Q292 358 268 372" stroke="${robe}" stroke-width="28" fill="none" stroke-linecap="round"/>
    <path d="M260 234 Q300 272 296 330 Q292 358 268 372" stroke="${robeDark}" stroke-width="28" fill="none" stroke-linecap="round" opacity="0.12"/>
    <path d="M292 336 L268 348 Q256 362 258 380 L286 370 Q296 356 292 336 Z" fill="${robeDark}" opacity="0.65"/>
    <ellipse cx="256" cy="382" rx="20" ry="14" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    <ellipse cx="234" cy="378" rx="10" ry="5" fill="${skin}" stroke="${skinShade}" stroke-width="1" transform="rotate(-10 234 378)"/>
    <ellipse cx="232" cy="388" rx="10" ry="5" fill="${skin}" stroke="${skinShade}" stroke-width="1" transform="rotate(-8 232 388)"/>
    <ellipse cx="234" cy="398" rx="9" ry="4.5" fill="${skin}" stroke="${skinShade}" stroke-width="1" transform="rotate(-5 234 398)"/>
    <ellipse cx="238" cy="408" rx="8" ry="4" fill="${skin}" stroke="${skinShade}" stroke-width="1"/>
    <ellipse cx="258" cy="366" rx="9" ry="5" fill="${skin}" stroke="${skinShade}" stroke-width="1" transform="rotate(-30 258 366)"/>
    <path d="M252 376 Q260 384 256 392" stroke="${skinShade}" stroke-width="1" fill="none" opacity="0.6"/>
  `;
}

/* ----- 患者整体 ----- */
function buildPatientSVG(p, isPulseStage) {
  let s = '';
  s += `<ellipse cx="180" cy="430" rx="120" ry="14" fill="rgba(0,0,0,0.18)"/>`;
  s += buildBodySVG(p.look);
  if (isPulseStage) {
    s += buildArmOnTableSVG(p.look);
  } else {
    s += buildAbnormalArmSVG(p.look, p.pose);
  }
  s += buildHeadSVG(p.look, p.expression);
  return s;
}

/* ----- 桌面器物 ----- */
function buildTableObjectsSVG() {
  return `
    <rect x="0" y="380" width="360" height="120" fill="url(#tableGrad)"/>
    <rect x="0" y="376" width="360" height="10" rx="3" fill="#b87848"/>
    <rect x="0" y="376" width="360" height="3" fill="#e6b87a" opacity="0.7"/>
    <path d="M0 386 L360 386" stroke="#3a2010" stroke-width="1.2" opacity="0.5"/>
    <path d="M20 410 Q100 408 200 412 T340 410" stroke="#3a2010" stroke-width="0.8" fill="none" opacity="0.25"/>
    <path d="M30 440 Q120 436 220 442 T340 440" stroke="#3a2010" stroke-width="0.8" fill="none" opacity="0.2"/>
    <path d="M10 470 Q100 468 200 472 T350 470" stroke="#3a2010" stroke-width="0.8" fill="none" opacity="0.2"/>
    <ellipse cx="242" cy="408" rx="64" ry="10" fill="#3a0808" opacity="0.35"/>
    <rect x="186" y="376" width="112" height="36" rx="14" fill="#a02828" stroke="#4a0808" stroke-width="1.5"/>
    <rect x="186" y="376" width="112" height="14" rx="7" fill="#d04040"/>
    <ellipse cx="242" cy="398" rx="52" ry="6" fill="#7a1818" opacity="0.4"/>
    <path d="M200 388 Q242 384 284 388" stroke="#e07070" stroke-width="1" fill="none" opacity="0.6"/>
    <ellipse cx="62" cy="404" rx="34" ry="7" fill="#3a2010" opacity="0.35"/>
    <ellipse cx="62" cy="376" rx="28" ry="26" fill="#b8a888" stroke="#5a4a30" stroke-width="1.5"/>
    <ellipse cx="62" cy="366" rx="22" ry="8" fill="#d8c8a8"/>
    <ellipse cx="62" cy="366" rx="22" ry="8" fill="none" stroke="#5a4a30" stroke-width="1.2"/>
    <circle cx="62" cy="352" r="6" fill="#b8a888" stroke="#5a4a30" stroke-width="1.2"/>
    <path d="M88 366 Q104 362 102 376 Q100 388 92 390" stroke="#5a4a30" stroke-width="3" fill="none"/>
    <path d="M40 376 Q24 372 22 384" stroke="#5a4a30" stroke-width="3" fill="none"/>
    <path d="M44 350 Q62 344 80 350" stroke="#5a4a30" stroke-width="2" fill="none"/>
    <g transform="translate(288, 430)">
      <rect x="0" y="0" width="56" height="40" rx="2" fill="#f5ecd6" stroke="#8a7a50" stroke-width="1" transform="rotate(-8 28 20)"/>
      <line x1="8" y1="10" x2="42" y2="8" stroke="#8a7a50" stroke-width="0.8" transform="rotate(-8 28 20)"/>
      <line x1="8" y1="18" x2="46" y2="16" stroke="#8a7a50" stroke-width="0.8" transform="rotate(-8 28 20)"/>
      <line x1="8" y1="26" x2="38" y2="25" stroke="#8a7a50" stroke-width="0.8" transform="rotate(-8 28 20)"/>
    </g>
    <g transform="translate(20, 432)">
      <rect x="0" y="0" width="30" height="6" rx="2" fill="#6a4a2a"/>
      <rect x="6" y="-2" width="4" height="8" rx="1" fill="#6a4a2a"/>
      <rect x="20" y="-2" width="4" height="8" rx="1" fill="#6a4a2a"/>
      <path d="M10 -6 L12 -20 L14 -6 Z" fill="#3a2a1a"/>
      <path d="M22 -4 L24 -18 L26 -4 Z" fill="#3a2a1a"/>
    </g>
  `;
}

/* ----- 完整场景 ----- */
function buildSceneSVG(opts) {
  const { isPulseStage, hotspots, actionClass, patient } = opts;
  let s = `<svg viewBox="0 0 360 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">`;
  s += `
    <defs>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8d0a0"/>
        <stop offset="50%" stop-color="#d4b880"/>
        <stop offset="100%" stop-color="#b89868"/>
      </linearGradient>
      <linearGradient id="tableGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9a5a2a"/>
        <stop offset="40%" stop-color="#7a3e18"/>
        <stop offset="100%" stop-color="#3a1a08"/>
      </linearGradient>
      <linearGradient id="robeShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.35)"/>
      </linearGradient>
      <radialGradient id="vignette" cx="0.5" cy="0.4" r="0.75">
        <stop offset="55%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.45)"/>
      </radialGradient>
      <radialGradient id="lampGlow" cx="0.5" cy="0.15" r="0.5">
        <stop offset="0%" stop-color="rgba(255,230,160,0.35)"/>
        <stop offset="100%" stop-color="rgba(255,230,160,0)"/>
      </radialGradient>
    </defs>
  `;
  s += `<rect x="0" y="0" width="360" height="500" fill="url(#wallGrad)"/>`;
  s += `<rect x="0" y="0" width="360" height="500" fill="url(#lampGlow)"/>`;
  s += buildCabinetSVG();
  s += buildPlaqueSVG();
  s += buildHangingHerbSVG();
  s += `<rect x="0" y="0" width="360" height="500" fill="url(#vignette)"/>`;
  s += `<g class="patient-group ${actionClass || ''}">${buildPatientSVG(patient, isPulseStage)}</g>`;
  s += buildTableObjectsSVG();
  if (isPulseStage) s += buildDoctorHandSVG();
  if (hotspots && hotspots.length) {
    hotspots.forEach(h => {
      s += `
        <g class="hotspot" data-id="${h.id}" data-correct="${!!h.correct}">
          <circle class="hotspot-ring" cx="${h.cx}" cy="${h.cy}" r="${h.r}" fill="none" stroke="rgba(255,215,80,0.95)" stroke-width="3"/>
          <circle class="hotspot-ring" cx="${h.cx}" cy="${h.cy}" r="${h.r}" fill="rgba(255,215,80,0.15)" stroke="rgba(255,215,80,0.65)" stroke-width="1.5"/>
          <circle class="hotspot-dot" cx="${h.cx}" cy="${h.cy}" r="6" fill="rgba(255,215,80,0.95)" stroke="#a06000" stroke-width="1"/>
        </g>
      `;
    });
  }
  s += `</svg>`;
  return s;
}
