/* =====================================================================
   pricing.js  —  หน้าราคาที่แอดมินแก้ไขได้ (เพิ่ม/ลบ/แก้ แพ็กเกจและราคา)
   วิธีใช้: วางไฟล์นี้ไว้โฟลเดอร์เดียวกับ index.html
            แล้วเพิ่มบรรทัดนี้ก่อน </body> (ต่อจาก souvenir.js):
            <script src="pricing.js"></script>
   ไม่ต้องแก้โค้ดอื่นใน index.html
   ===================================================================== */

// เวอร์ชันของไฟล์นี้ (ไว้เช็กใน Console ว่าเบราว์เซอร์โหลดไฟล์ล่าสุดหรือยัง: พิมพ์ PRICING_JS_VERSION)
const PRICING_JS_VERSION = 'v7-autosync';
console.log('pricing.js loaded:', PRICING_JS_VERSION);

// ---------- ข้อมูลราคาเริ่มต้น (ถูกบันทึกไปกับ siteData เมื่อแอดมินกดบันทึก) ----------
if (!siteData.pricing) {
    siteData.pricing = { packages: [
        { badge:'PACKAGE', color:'#e94560', nameKey:'pkg_superfun_name', descKey:'pkg_superfun_desc', child:1400, adult:1700, fixed:[0,3,1,8] },
        { badge:'PACKAGE', color:'#ff8c00', nameKey:'pkg_happyfun_name', descKey:'pkg_happyfun_desc', child:1400, adult:1700, fixed:[7,4,5,8] },
        { badge:'COMBO',   color:'#4B0082', nameKey:'pkg_combo_name',    descKey:'pkg_combo_desc',    child:1900, adult:2200, fixed:[] }
    ]};
}

// ---------- หมายเหตุหน้าราคา (เพิ่ม/ลบ/แก้ไขได้จากแอดมิน) ----------
if (!siteData.pricing.notes) {
    siteData.pricing.notes = [
        { icon:'fa-lock',    textKey:'pricing_note_1' },
        { icon:'fa-list-ol', textKey:'pricing_note_2' }
    ];
}

// ---------- แก้คำแปลที่ผิด (แก้เฉพาะเมื่อค่ายังเป็นค่าผิดเดิม ไม่ทับสิ่งที่แอดมินแก้เอง) ----------
(function fixTranslations() {
    const fixes = [
        ['zh', 'coupon_scream',    '享受餐饮85折优惠',               '享受餐饮8折优惠'],
        ['ko', 'ticket_height_1',  '신장 80cm 이하: 물론 입장 👶',   '신장 80cm 이하: 무료 입장 👶']
    ];
    fixes.forEach(([lang, key, wrong, right]) => {
        if (translations[lang] && translations[lang][key] === wrong) translations[lang][key] = right;
    });
})();

// ---------- แสดงการ์ดแพ็กเกจในหน้าลูกค้า ----------
function pkgText(p, field, lang) {
    const o = p[field] || {};
    const key = p[field + 'Key'];
    return o[lang]
        || (key && translations[lang] && translations[lang][key])
        || o.en
        || (key && translations.en && translations.en[key])
        || o.th
        || '';
}

function renderPricingPackages() {
    const grid = document.getElementById('priceGrid');
    if (!grid) return;
    const t = translations[currentLang] || translations['en'];
    const atts = getAttractions(currentLang);
    grid.innerHTML = (siteData.pricing.packages || []).map(p => {
        const fixedHtml = (p.fixed && p.fixed.length)
            ? `<div class="pkg-fixed-list"><div class="pkg-fixed-title"><i class="fas fa-lock"></i> ${t.pkg_fixed_label || ''}</div>` +
              p.fixed.map(i => {
                  const a = atts[i];
                  if (!a) return '';
                  const thumb = a.logo
                      ? `<img class="pkg-fixed-thumb" src="${a.logo}" alt="${a.title}">`
                      : `<i style="background:${a.color || '#999'}" class="fas ${a.icon || 'fa-star'}"></i>`;
                  return `<div class="pkg-fixed-item">${thumb}<span>${a.title}</span></div>`;
              }).join('') + `</div>`
            : '';
        return `
        <div class="price-card" style="border-top-color:${p.color || '#e94560'};">
            ${p.badge ? `<span class="price-badge">${p.badge}</span>` : ''}
            <h3>${pkgText(p, 'name', currentLang)}</h3>
            <p class="price-sub">${pkgText(p, 'desc', currentLang)}</p>
            ${fixedHtml}
            <div class="price-row">
                <div class="price-box">
                    <div class="price-label">${t.price_child || 'Child'}</div>
                    <div class="price-value">${Number(p.child).toLocaleString()}</div>
                    <div class="price-unit">${t.baht || 'Baht'}</div>
                </div>
                <div class="price-box">
                    <div class="price-label">${t.price_adult || 'Adult'}</div>
                    <div class="price-value">${Number(p.adult).toLocaleString()}</div>
                    <div class="price-unit">${t.baht || 'Baht'}</div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// เดิม index.html เรียกฟังก์ชันนี้ตอนเปลี่ยนภาษา — ให้ไปเรียกตัวแสดงราคาใหม่แทน
function renderPackageFixed() { renderPricingPackages(); renderPricingNotes(); }

// ---------- ตัวแก้ไขราคาในหน้าแอดมิน ----------
function renderPricingEditor() {
    const el = document.getElementById('pricingEditor');
    if (!el) return;
    const langNames = { th:'ไทย', en:'English', zh:'中文', ru:'Русский', hi:'हिन्दी', he:'עברית', ja:'日本語', ko:'한국어', ar:'العربية' };
    const t = translations[currentLang] || translations['en'];
    const q = s => String(s == null ? '' : s).replace(/"/g, '&quot;');
    const atts = getAttractions(currentLang);

    const note = document.getElementById('pricingLangNote');
    if (note) note.innerHTML = `<i class="fas fa-language"></i> กำลังแก้ไขข้อความของภาษา: <strong>${langNames[currentLang] || currentLang}</strong>` +
        `<br>ราคา ป้าย สี และรายการเครื่องเล่นใช้ร่วมกันทุกภาษา ส่วนชื่อ/คำอธิบายแพ็กเกจและข้อความหมายเหตุแยกตามภาษา (สลับภาษาที่มุมขวาบน)`;

    const pkgHtml = siteData.pricing.packages.map((p, i) => `
        <div class="admin-section">
            <h4>${pkgText(p, 'name', currentLang) || 'แพ็กเกจใหม่'}</h4>
            <div class="form-group"><label>ชื่อแพ็กเกจ (${langNames[currentLang]})</label>
                <input type="text" value="${q(pkgText(p, 'name', currentLang))}" onchange="updatePkgText(${i}, 'name', this.value)"></div>
            <div class="form-group"><label>คำอธิบาย (${langNames[currentLang]})</label>
                <textarea onchange="updatePkgText(${i}, 'desc', this.value)">${pkgText(p, 'desc', currentLang)}</textarea></div>
            <details style="margin:10px 0 15px;">
                <summary style="cursor:pointer;font-weight:bold;color:var(--primary);">🌐 ชื่อ/คำอธิบายทุกภาษา (กรอกครบทุกภาษาในที่เดียว)</summary>
                <div style="margin:10px 0;">
                    <button class="btn btn-secondary" id="autoTrBtn${i}" onclick="autoTranslatePkg(${i})">🤖 แปลอัตโนมัติเป็นทุกภาษา</button>
                    <small style="color:#666;">แปลจากช่องภาษาไทยเป็นอีก 8 ภาษา (ข้อความเดิมของภาษาอื่นจะถูกแทนที่) ควรตรวจทานอีกครั้ง</small>
                </div>
                ${Object.keys(langNames).map(l => `
                    <div style="margin:10px 0;padding:10px;background:#fff;border:1px solid #eee;border-radius:8px;">
                        <strong>${langNames[l]}</strong>
                        <input type="text" placeholder="ชื่อแพ็กเกจ" value="${q(pkgText(p, 'name', l))}" onchange="updatePkgTextLang(${i}, 'name', '${l}', this.value)" style="margin:6px 0;">
                        <textarea placeholder="คำอธิบาย" onchange="updatePkgTextLang(${i}, 'desc', '${l}', this.value)">${pkgText(p, 'desc', l)}</textarea>
                    </div>`).join('')}
            </details>
            <div class="form-group"><label>ป้ายเล็กบนการ์ด (เช่น PACKAGE, COMBO, HOT)</label>
                <input type="text" value="${q(p.badge)}" onchange="updatePkg(${i}, 'badge', this.value)"></div>
            <div class="form-group"><label>สีขอบการ์ด</label>
                <input type="color" value="${p.color || '#e94560'}" onchange="updatePkg(${i}, 'color', this.value)"></div>
            <div class="form-group"><label>ราคาเด็ก (บาท)</label>
                <input type="number" min="0" value="${p.child}" onchange="updatePkg(${i}, 'child', this.value)"></div>
            <div class="form-group"><label>ราคาผู้ใหญ่ (บาท)</label>
                <input type="number" min="0" value="${p.adult}" onchange="updatePkg(${i}, 'adult', this.value)"></div>
            <div class="form-group"><label>เครื่องเล่นที่กำหนดในแพ็กเกจ (ไม่ติ๊กเลย = ไม่แสดงรายการ)</label>
                ${atts.map((a, idx) => `
                    <label style="display:flex;align-items:center;gap:8px;font-weight:normal;">
                        <input type="checkbox" style="width:auto;" ${(p.fixed || []).includes(idx) ? 'checked' : ''} onchange="togglePkgFixed(${i}, ${idx}, this.checked)"> ${a.title}
                    </label>`).join('')}
            </div>
            <button class="btn btn-danger" onclick="deletePackage(${i})"><i class="fas fa-trash"></i> ลบแพ็กเกจนี้</button>
        </div>`).join('');

    const singleHtml = atts.map((a, idx) => `
        <div class="form-group" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <div style="flex:2;min-width:180px;font-weight:bold;">${a.title}</div>
            <div style="flex:1;min-width:110px;"><small>ผู้ใหญ่</small>
                <input type="number" min="0" value="${a.price !== undefined ? a.price : ''}" onchange="updateSinglePrice(${idx}, 'price', this.value)"></div>
            <div style="flex:1;min-width:110px;"><small>เด็ก (เว้นว่างได้)</small>
                <input type="number" min="0" value="${a.childPrice !== undefined ? a.childPrice : ''}" onchange="updateSinglePrice(${idx}, 'childPrice', this.value)"></div>
        </div>`).join('');

    const iconOptions = [
        ['fa-lock','🔒 ล็อก'], ['fa-list-ol','🔢 รายการ'], ['fa-info-circle','ℹ️ ข้อมูล'],
        ['fa-exclamation-triangle','⚠️ เตือน'], ['fa-clock','🕒 เวลา'], ['fa-ban','🚫 ห้าม'],
        ['fa-check-circle','✅ ถูกต้อง'], ['fa-star','⭐ ดาว'], ['fa-child','🧒 เด็ก'], ['fa-ticket-alt','🎟️ ตั๋ว']
    ];
    const notesHtml = (siteData.pricing.notes || []).map((n, i) => `
        <div class="admin-section">
            <div class="form-group"><label>ข้อความหมายเหตุข้อ ${i + 1} (${langNames[currentLang]})</label>
                <textarea onchange="updateNoteText(${i}, this.value)">${noteText(n, currentLang)}</textarea></div>
            <div class="form-group"><label>ไอคอน</label>
                <select onchange="updateNote(${i}, 'icon', this.value)">
                    ${iconOptions.map(([v, l]) => `<option value="${v}" ${n.icon === v ? 'selected' : ''}>${l}</option>`).join('')}
                </select></div>
            <details style="margin:10px 0 15px;">
                <summary style="cursor:pointer;font-weight:bold;color:var(--primary);">🌐 ข้อความทุกภาษา</summary>
                <div style="margin:10px 0;">
                    <button class="btn btn-secondary" id="autoTrNote${i}" onclick="autoTranslateNote(${i})">🤖 แปลอัตโนมัติเป็นทุกภาษา</button>
                    <small style="color:#666;">แปลจากช่องภาษาไทยเป็นอีก 8 ภาษา (ข้อความเดิมของภาษาอื่นจะถูกแทนที่)</small>
                </div>
                ${Object.keys(langNames).map(l => `
                    <div style="margin:10px 0;padding:10px;background:#fff;border:1px solid #eee;border-radius:8px;">
                        <strong>${langNames[l]}</strong>
                        <textarea onchange="updateNoteTextLang(${i}, '${l}', this.value)">${noteText(n, l)}</textarea>
                    </div>`).join('')}
            </details>
            <button class="btn btn-secondary" onclick="moveNote(${i}, -1)" ${i === 0 ? 'disabled' : ''}>▲ ขึ้น</button>
            <button class="btn btn-secondary" onclick="moveNote(${i}, 1)" ${i === siteData.pricing.notes.length - 1 ? 'disabled' : ''}>▼ ลง</button>
            <button class="btn btn-danger" onclick="deleteNote(${i})"><i class="fas fa-trash"></i> ลบ</button>
        </div>`).join('');

    const textKeys = [
        ['pricing_title', 'หัวข้อหน้าราคา'],
        ['pricing_sub', 'หัวข้อรอง (PROMOTION...)'],
        ['pricing_note_title', 'หัวข้อ: หมายเหตุ'],
        ['single_price_title', 'หัวข้อ: ราคาเดี่ยวแต่ละเครื่องเล่น']
    ];
    const textHtml = textKeys.map(([key, label]) => `
        <div class="form-group"><label>${label} <small style="color:#999;">(${key})</small></label>
            <input type="text" value="${q(t[key])}" onchange="updateCouponText('${key}', this.value)"></div>`).join('');

    el.innerHTML = `<h4>📦 แพ็กเกจ</h4>${pkgHtml}
        <h4 style="margin-top:30px;">🎢 ราคาเดี่ยวแต่ละเครื่องเล่น</h4>
        <div class="admin-section">${singleHtml}</div>
        <h4 style="margin-top:30px;">📌 หมายเหตุ</h4>
        ${notesHtml}
        <button class="btn btn-success" onclick="addNote()"><i class="fas fa-plus"></i> เพิ่มหมายเหตุ</button>
        <h4 style="margin-top:30px;">📝 ข้อความหน้าราคา</h4>
        <div class="admin-section">${textHtml}</div>`;
}

function updatePkg(i, field, value) {
    const p = siteData.pricing.packages[i];
    p[field] = (field === 'child' || field === 'adult') ? (parseInt(value) || 0) : value;
    renderPricingPackages();
}

function updatePkgText(i, field, value) {
    const p = siteData.pricing.packages[i];
    if (!p[field]) p[field] = {};
    p[field][currentLang] = value;
    renderPricingPackages();
    if (currentLang === 'th') autoSyncPkg(i);   // แก้ภาษาไทย = แปลให้ภาษาอื่นอัตโนมัติ
}

// ---------- แปลอัตโนมัติ (ใช้บริการแปลฟรี MyMemory) ----------
const PKG_LANG_CODES = { th:'th', en:'en', zh:'zh-CN', ru:'ru', hi:'hi', he:'he', ja:'ja', ko:'ko', ar:'ar' };
const pkgHasThai = s => /[\u0E00-\u0E7F]/.test(s || '');

async function pkgTranslate(text, from, to) {
    if (!text || from === to) return text;
    // 1) Google Translate (endpoint ไม่เป็นทางการ ใช้ฟรี)
    try {
        const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + from + '&tl=' + to + '&dt=t&q=' + encodeURIComponent(text));
        const j = await r.json();
        const out = (j && j[0] ? j[0].map(x => x[0] || '').join('') : '').trim();
        if (out) return out;
    } catch (e) { /* ลองตัวสำรองต่อ */ }
    // 2) สำรอง: MyMemory
    const r2 = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + (from === 'auto' ? 'Autodetect' : from) + '|' + to);
    const j2 = await r2.json();
    if (!j2 || String(j2.responseStatus) !== '200' || !j2.responseData || !j2.responseData.translatedText) throw new Error('แปลไม่สำเร็จ');
    return j2.responseData.translatedText;
}

// สรุปผลการแปล: บอกว่าภาษาไหนแปลไม่สำเร็จ
function pkgTrMsg(failed, okMsg) {
    return (failed && failed.length)
        ? 'แปลสำเร็จบางภาษา แต่ภาษาเหล่านี้แปลไม่สำเร็จ (ใช้ข้อความต้นฉบับแทน): ' + failed.join(', ').toUpperCase() + '\nกดปุ่ม "แปลอัตโนมัติ" อีกครั้งเพื่อลองใหม่'
        : okMsg;
}

// แปลชื่อ/คำอธิบายของแพ็กเกจเป็นทุกภาษา (ตรวจภาษาต้นฉบับอัตโนมัติ: มีตัวอักษรไทย = ไทย ไม่งั้น = อังกฤษ)
// ชื่อที่ไม่ใช่ภาษาไทย (เช่น SUPER MAX) จะคงเดิมทุกภาษา
async function translatePkgAll(p, srcName, srcDesc, onProgress, forceTh) {
    const srcLang = (forceTh || pkgHasThai(srcDesc || srcName)) ? 'th' : 'en';
    const fromCode = (srcLang === 'th' && !pkgHasThai(srcDesc || srcName)) ? 'auto' : PKG_LANG_CODES[srcLang];
    const nameIsThai = pkgHasThai(srcName);
    const failed = [];
    if (!p.name) p.name = {};
    if (!p.desc) p.desc = {};
    for (const [lang, code] of Object.entries(PKG_LANG_CODES)) {
        if (onProgress) onProgress(lang);
        let d = srcDesc, n = srcName;
        try {
            d = (lang === srcLang) ? srcDesc : await pkgTranslate(srcDesc, fromCode, code);
            n = nameIsThai ? ((lang === 'th') ? srcName : await pkgTranslate(srcName, 'th', code)) : srcName;
        } catch (e) { failed.push(lang); d = srcDesc; n = srcName; }
        p.desc[lang] = d;
        p.name[lang] = n;
    }
    return failed;
}

async function autoTranslatePkg(i) {
    const p = siteData.pricing.packages[i];
    const srcName = pkgText(p, 'name', 'th');
    const srcDesc = pkgText(p, 'desc', 'th');
    if (!srcName && !srcDesc) { alert('กรุณากรอกชื่อ/คำอธิบายก่อน (ช่องภาษาไทย)'); return; }
    if (!confirm('แปลข้อความเป็นทุกภาษาอัตโนมัติ?\nข้อความเดิมของภาษาอื่นจะถูกแทนที่ และควรตรวจทานผลอีกครั้ง')) return;
    const btn = document.getElementById('autoTrBtn' + i);
    if (btn) btn.disabled = true;
    try {
        const failed = await translatePkgAll(p, srcName, srcDesc, lang => { if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase(); }, true);
        renderPricingPackages();
        renderPricingEditor();
        alert(pkgTrMsg(failed, 'แปลเสร็จแล้ว ลองสลับภาษาดูผล แล้วกดบันทึกไปยัง GitHub'));
    } catch (e) {
        alert('แปลอัตโนมัติไม่สำเร็จ: ' + e.message + '\nลองใหม่อีกครั้ง หรือกรอกเองในแต่ละภาษา');
        renderPricingEditor();
    }
}

function updatePkgTextLang(i, field, lang, value) {
    const p = siteData.pricing.packages[i];
    if (!p[field]) p[field] = {};
    p[field][lang] = value;
    renderPricingPackages();
    if (lang === 'th') autoSyncPkg(i);   // แก้ภาษาไทย = แปลให้ภาษาอื่นอัตโนมัติ
}

function togglePkgFixed(i, idx, checked) {
    const p = siteData.pricing.packages[i];
    p.fixed = p.fixed || [];
    if (checked && !p.fixed.includes(idx)) p.fixed.push(idx);
    if (!checked) p.fixed = p.fixed.filter(x => x !== idx);
    renderPricingPackages();
}

// เพิ่มแพ็กเกจใหม่ + แปลให้ทุกภาษาอัตโนมัติ
async function addPackage() {
    const name = prompt('ชื่อแพ็กเกจ เช่น SUPER MAX');
    if (!name) return;
    const desc = prompt('คำอธิบายแพ็กเกจ (พิมพ์ภาษาไทยหรืออังกฤษ ระบบจะแปลให้ทุกภาษาอัตโนมัติ)\nเว้นว่างได้') || '';
    const nm = {}, ds = {};
    Object.keys(translations).forEach(l => { nm[l] = name; ds[l] = desc; });   // ใส่ข้อความเดิมให้ทุกภาษาก่อน เผื่อแปลไม่สำเร็จ
    siteData.pricing.packages.push({
        badge: 'PACKAGE', color: '#3498db',
        name: nm, desc: ds,
        child: 0, adult: 0, fixed: []
    });
    renderPricingPackages();
    renderPricingEditor();

    if (!desc && !pkgHasThai(name)) return;   // ไม่มีอะไรต้องแปล (เช่น ชื่อภาษาอังกฤษล้วน ไม่มีคำอธิบาย)
    const i = siteData.pricing.packages.length - 1;
    const p = siteData.pricing.packages[i];
    const btn = document.getElementById('autoTrBtn' + i);
    try {
        const failed = await translatePkgAll(p, name, desc, lang => { if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase(); });
        renderPricingPackages();
        renderPricingEditor();
        alert(pkgTrMsg(failed, 'เพิ่มแพ็กเกจและแปลให้ครบทุกภาษาแล้ว อย่าลืมกรอกราคา แล้วกดบันทึกไปยัง GitHub'));
    } catch (e) {
        renderPricingEditor();
        alert('เพิ่มแพ็กเกจแล้ว แต่แปลอัตโนมัติไม่สำเร็จ (' + e.message + ')\nทุกภาษาใช้ข้อความที่พิมพ์ไว้ก่อน กดปุ่ม "แปลอัตโนมัติ" ในแพ็กเกจนั้นเพื่อลองใหม่ได้');
    }
}

function deletePackage(i) {
    if (!confirm('ต้องการลบแพ็กเกจนี้?')) return;
    siteData.pricing.packages.splice(i, 1);
    renderPricingPackages();
    renderPricingEditor();
}

// ราคาเดี่ยวใช้ร่วมกันทุกภาษา: อัปเดตทุกชุดภาษาให้ตรงกัน
function updateSinglePrice(idx, field, value) {
    const v = value === '' ? undefined : parseInt(value);
    Object.keys(siteData.attractions).forEach(l => {
        const item = siteData.attractions[l] && siteData.attractions[l][idx];
        if (item) item[field] = v;
    });
    renderSinglePrices();
    renderAttractions();
}

// ---------- แปลอัตโนมัติทันทีเมื่อแก้ข้อความภาษาไทย ----------
function pricingToast(msg, ms) {
    let t = document.getElementById('pricingToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'pricingToast';
        t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:12px 22px;border-radius:25px;z-index:5000;font-size:14px;box-shadow:0 4px 15px rgba(0,0,0,.4);max-width:90vw;text-align:center;';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._h);
    if (ms) t._h = setTimeout(() => { t.style.display = 'none'; }, ms);
}

function refreshEditorIfIdle() {
    const ed = document.getElementById('pricingEditor');
    const ae = document.activeElement;
    if (!ed || !ae || ae === document.body || !ed.contains(ae)) renderPricingEditor();
}

async function autoSyncPkg(i) {
    const p = siteData.pricing.packages[i];
    const srcName = pkgText(p, 'name', 'th');
    const srcDesc = pkgText(p, 'desc', 'th');
    if (!srcName && !srcDesc) return;
    pricingToast('⏳ กำลังแปลเป็นทุกภาษาอัตโนมัติ...');
    try {
        const failed = await translatePkgAll(p, srcName, srcDesc, null, true);
        renderPricingPackages();
        refreshEditorIfIdle();
        pricingToast(failed.length ? '⚠️ แปลไม่สำเร็จบางภาษา: ' + failed.join(', ').toUpperCase() + ' (กดปุ่ม 🤖 ในแพ็กเกจนั้นเพื่อลองใหม่)' : '✅ แปลทุกภาษาแล้ว อย่าลืมกดบันทึกไปยัง GitHub', 5000);
    } catch (e) {
        pricingToast('⚠️ แปลอัตโนมัติไม่สำเร็จ: ' + e.message, 5000);
    }
}

async function autoSyncNote(i) {
    const n = siteData.pricing.notes[i];
    const src = noteText(n, 'th');
    if (!src) return;
    pricingToast('⏳ กำลังแปลเป็นทุกภาษาอัตโนมัติ...');
    try {
        const failed = await translateNoteAll(n, src, null, true);
        renderPricingNotes();
        refreshEditorIfIdle();
        pricingToast(failed.length ? '⚠️ แปลไม่สำเร็จบางภาษา: ' + failed.join(', ').toUpperCase() + ' (กดปุ่ม 🤖 ในหมายเหตุนั้นเพื่อลองใหม่)' : '✅ แปลทุกภาษาแล้ว อย่าลืมกดบันทึกไปยัง GitHub', 5000);
    } catch (e) {
        pricingToast('⚠️ แปลอัตโนมัติไม่สำเร็จ: ' + e.message, 5000);
    }
}

// ---------- หมายเหตุ: แสดงผล/แก้ไข ----------
function noteText(n, lang) {
    const o = n.text || {};
    const key = n.textKey;
    return o[lang]
        || (key && translations[lang] && translations[lang][key])
        || o.en
        || (key && translations.en && translations.en[key])
        || o.th
        || '';
}

function renderPricingNotes() {
    const box = document.getElementById('pricingNotes');
    if (!box) return;
    const notes = siteData.pricing.notes || [];
    box.innerHTML = notes.map((n, i) => `
        <div class="step"${i === notes.length - 1 ? ' style="margin-bottom:0;"' : ''}>
            <div class="step-num"><i class="fas ${n.icon || 'fa-info-circle'}"></i></div>
            <div>${noteText(n, currentLang)}</div>
        </div>`).join('');
    const info = box.closest('.info-box');
    if (info) info.style.display = notes.length ? '' : 'none';
}

function updateNote(i, field, value) {
    siteData.pricing.notes[i][field] = value;
    renderPricingNotes();
}

function updateNoteText(i, value) {
    updateNoteTextLang(i, currentLang, value);
}

function updateNoteTextLang(i, lang, value) {
    const n = siteData.pricing.notes[i];
    if (!n.text) n.text = {};
    n.text[lang] = value;
    renderPricingNotes();
    if (lang === 'th') autoSyncNote(i);   // แก้ภาษาไทย = แปลให้ภาษาอื่นอัตโนมัติ
}

function moveNote(i, dir) {
    const arr = siteData.pricing.notes;
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    renderPricingNotes();
    renderPricingEditor();
}

function deleteNote(i) {
    if (!confirm('ต้องการลบหมายเหตุนี้?')) return;
    siteData.pricing.notes.splice(i, 1);
    renderPricingNotes();
    renderPricingEditor();
}

async function translateNoteAll(n, src, onProgress, forceTh) {
    const srcLang = (forceTh || pkgHasThai(src)) ? 'th' : 'en';
    const fromCode = (srcLang === 'th' && !pkgHasThai(src)) ? 'auto' : PKG_LANG_CODES[srcLang];
    const failed = [];
    if (!n.text) n.text = {};
    for (const [lang, code] of Object.entries(PKG_LANG_CODES)) {
        if (onProgress) onProgress(lang);
        let t = src;
        try {
            t = (lang === srcLang) ? src : await pkgTranslate(src, fromCode, code);
        } catch (e) { failed.push(lang); t = src; }
        n.text[lang] = t;
    }
    return failed;
}

// เพิ่มหมายเหตุใหม่ + แปลให้ทุกภาษาอัตโนมัติ
async function addNote() {
    const text = prompt('ข้อความหมายเหตุ (พิมพ์ภาษาไทยหรืออังกฤษ ระบบจะแปลให้ทุกภาษาอัตโนมัติ)');
    if (!text) return;
    const tx = {};
    Object.keys(translations).forEach(l => { tx[l] = text; });   // ใส่ข้อความเดิมให้ทุกภาษาก่อน เผื่อแปลไม่สำเร็จ
    siteData.pricing.notes.push({ icon: 'fa-info-circle', text: tx });
    renderPricingNotes();
    renderPricingEditor();

    const i = siteData.pricing.notes.length - 1;
    const n = siteData.pricing.notes[i];
    const btn = document.getElementById('autoTrNote' + i);
    try {
        const failed = await translateNoteAll(n, text, lang => { if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase(); });
        renderPricingNotes();
        renderPricingEditor();
        alert(pkgTrMsg(failed, 'เพิ่มหมายเหตุและแปลให้ครบทุกภาษาแล้ว อย่าลืมกดบันทึกไปยัง GitHub'));
    } catch (e) {
        renderPricingEditor();
        alert('เพิ่มหมายเหตุแล้ว แต่แปลอัตโนมัติไม่สำเร็จ (' + e.message + ')\nทุกภาษาใช้ข้อความที่พิมพ์ไว้ก่อน กดปุ่ม "แปลอัตโนมัติ" ในหมายเหตุนั้นเพื่อลองใหม่ได้');
    }
}

async function autoTranslateNote(i) {
    const n = siteData.pricing.notes[i];
    const src = noteText(n, 'th');
    if (!src) { alert('กรุณากรอกข้อความภาษาไทยก่อน'); return; }
    if (!confirm('แปลข้อความเป็นทุกภาษาอัตโนมัติ?\nข้อความเดิมของภาษาอื่นจะถูกแทนที่ และควรตรวจทานผลอีกครั้ง')) return;
    const btn = document.getElementById('autoTrNote' + i);
    if (btn) btn.disabled = true;
    try {
        const failed = await translateNoteAll(n, src, lang => { if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase(); }, true);
        renderPricingNotes();
        renderPricingEditor();
        alert(pkgTrMsg(failed, 'แปลเสร็จแล้ว ลองสลับภาษาดูผล แล้วกดบันทึกไปยัง GitHub'));
    } catch (e) {
        alert('แปลอัตโนมัติไม่สำเร็จ: ' + e.message + '\nลองใหม่อีกครั้ง หรือกรอกเองในแต่ละภาษา');
        renderPricingEditor();
    }
}

// ---------- ติดตั้งส่วนหน้าเว็บ + เชื่อมกับฟังก์ชันเดิม ----------
(function installPricingUI() {
    // 1) หน้าลูกค้า: เปลี่ยนการ์ดแพ็กเกจเดิมให้เรนเดอร์จากข้อมูล
    const grid = document.querySelector('#pricing .price-grid');
    if (grid) { grid.id = 'priceGrid'; grid.innerHTML = ''; }

    // 1.1) หน้าลูกค้า: เปลี่ยนหมายเหตุเดิม (2 ข้อ) ให้เรนเดอร์จากข้อมูล
    const noteBox = document.querySelector('#pricing .info-box:not(.single-price-list)');
    if (noteBox && !document.getElementById('pricingNotes')) {
        noteBox.querySelectorAll('.step').forEach(el => el.remove());
        const holder = document.createElement('div');
        holder.id = 'pricingNotes';
        noteBox.appendChild(holder);
    }

    // 2) แอดมิน: ปุ่มแท็บ "ราคา"
    const tabs = document.querySelector('#adminDashboard .tabs');
    if (tabs && !document.getElementById('pricingTabBtn')) {
        const b = document.createElement('button');
        b.className = 'tab';
        b.id = 'pricingTabBtn';
        b.textContent = '💰 ราคา';
        b.onclick = function () { showAdminTab('pricing'); };
        tabs.appendChild(b);
    }

    // 3) แอดมิน: เนื้อหาแท็บ "ราคา"
    if (!document.getElementById('adminTabPricing')) {
        const sec = document.createElement('div');
        sec.id = 'adminTabPricing';
        sec.className = 'admin-section';
        sec.style.display = 'none';
        sec.innerHTML = `
            <h3><i class="fas fa-tag"></i> จัดการหน้าราคา</h3>
            <div id="pricingLangNote" class="lang-editing-note"></div>
            <div id="pricingEditor"></div>
            <button class="btn btn-success" onclick="addPackage()"><i class="fas fa-plus"></i> เพิ่มแพ็กเกจ</button>
            <button class="btn" onclick="saveAllChanges()" style="margin-top: 20px;">
                <i class="fas fa-save"></i> บันทึกการเปลี่ยนแปลงทั้งหมดไปยัง GitHub
            </button>`;
        const anchor = document.getElementById('adminTabCoupon') || document.getElementById('adminTabContent');
        if (anchor) anchor.insertAdjacentElement('afterend', sec);
    }

    // 4) เชื่อมกับฟังก์ชันเดิม
    const origShowAdminTab = window.showAdminTab;
    window.showAdminTab = function (tab) {
        origShowAdminTab.apply(this, arguments);
        if (tab === 'pricing') renderPricingEditor();
        if (tab === 'menu') renderMenuEditor();
    };

    const origCheckAdmin = window.checkAdmin;
    window.checkAdmin = function () {
        origCheckAdmin.apply(this, arguments);
        renderPricingEditor();
    };

    const origChangeLang = window.changeLang;
    window.changeLang = function () {
        origChangeLang.apply(this, arguments);
        const tab = document.getElementById('adminTabPricing');
        if (tab && tab.style.display !== 'none') renderPricingEditor();
    };

    // 5) วาดการ์ดแพ็กเกจรอบแรก (กรณีหน้าเว็บโหลดเสร็จก่อนสคริปต์นี้)
    renderPricingPackages();
    renderPricingNotes();
})();
