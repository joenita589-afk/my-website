/* =====================================================================
   pricing.js  —  หน้าราคาที่แอดมินแก้ไขได้ (เพิ่ม/ลบ/แก้ แพ็กเกจและราคา)
   วิธีใช้: วางไฟล์นี้ไว้โฟลเดอร์เดียวกับ index.html
            แล้วเพิ่มบรรทัดนี้ก่อน </body> (ต่อจาก souvenir.js):
            <script src="pricing.js"></script>
   ไม่ต้องแก้โค้ดอื่นใน index.html
   ===================================================================== */

// ---------- ข้อมูลราคาเริ่มต้น (ถูกบันทึกไปกับ siteData เมื่อแอดมินกดบันทึก) ----------
if (!siteData.pricing) {
    siteData.pricing = { packages: [
        { badge:'PACKAGE', color:'#e94560', nameKey:'pkg_superfun_name', descKey:'pkg_superfun_desc', child:1400, adult:1700, fixed:[0,3,1,8] },
        { badge:'PACKAGE', color:'#ff8c00', nameKey:'pkg_happyfun_name', descKey:'pkg_happyfun_desc', child:1400, adult:1700, fixed:[7,4,5,8] },
        { badge:'COMBO',   color:'#4B0082', nameKey:'pkg_combo_name',    descKey:'pkg_combo_desc',    child:1900, adult:2200, fixed:[] }
    ]};
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

// ---------- เติมคำแปลที่ขาดของแพ็กเกจที่ระบุไว้ (เติมเฉพาะช่องที่ยังว่าง ไม่ทับสิ่งที่แอดมินแก้เอง) ----------
(function fillMissingPackageDesc() {
    const known = {
        'Double Attraction Special': {
            th: 'สามารถเลือกได้ 2 เครื่องเล่น ในราคา 900 บาท',
            en: 'Choose any 2 attractions for 900 Baht',
            zh: '任选2项游乐设施，仅需900泰铢',
            ru: 'Выберите любые 2 аттракциона за 900 бат',
            hi: '900 बात में कोई भी 2 आकर्षण चुनें',
            he: 'בחרו 2 מתקנים כלשהם ב-900 באט',
            ja: 'お好きなアトラクションを2つ選べて900バーツ',
            ko: '원하는 어트랙션 2개를 900바트에',
            ar: 'اختر أي لعبتين مقابل 900 بات'
        }
    };
    (siteData.pricing.packages || []).forEach(p => {
        const nm = p.name && (p.name.en || p.name.th);
        const dict = known[nm];
        if (!dict) return;
        if (!p.desc) p.desc = {};
        Object.keys(dict).forEach(l => { if (!p.desc[l]) p.desc[l] = dict[l]; });
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
function renderPackageFixed() { renderPricingPackages(); }

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
                    <small style="color:#666;">แปลจากช่องภาษาไทย (ถ้าไม่มีภาษาไทยจะแปลจากอังกฤษ) เป็นอีก 8 ภาษา ข้อความเดิมของภาษาอื่นจะถูกแทนที่ ควรตรวจทานอีกครั้ง</small>
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

    const textKeys = [
        ['pricing_title', 'หัวข้อหน้าราคา'],
        ['pricing_sub', 'หัวข้อรอง (PROMOTION...)'],
        ['pricing_note_title', 'หัวข้อ: หมายเหตุ'],
        ['pricing_note_1', 'หมายเหตุข้อ 1'],
        ['pricing_note_2', 'หมายเหตุข้อ 2'],
        ['single_price_title', 'หัวข้อ: ราคาเดี่ยวแต่ละเครื่องเล่น']
    ];
    const textHtml = textKeys.map(([key, label]) => `
        <div class="form-group"><label>${label} <small style="color:#999;">(${key})</small></label>
            <input type="text" value="${q(t[key])}" onchange="updateCouponText('${key}', this.value)"></div>`).join('');

    el.innerHTML = `<h4>📦 แพ็กเกจ</h4>${pkgHtml}
        <h4 style="margin-top:30px;">🎢 ราคาเดี่ยวแต่ละเครื่องเล่น</h4>
        <div class="admin-section">${singleHtml}</div>
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
}

function updatePkgTextLang(i, field, lang, value) {
    const p = siteData.pricing.packages[i];
    if (!p[field]) p[field] = {};
    p[field][lang] = value;
    renderPricingPackages();
}

function togglePkgFixed(i, idx, checked) {
    const p = siteData.pricing.packages[i];
    p.fixed = p.fixed || [];
    if (checked && !p.fixed.includes(idx)) p.fixed.push(idx);
    if (!checked) p.fixed = p.fixed.filter(x => x !== idx);
    renderPricingPackages();
}

// ---------- แปลอัตโนมัติ (ใช้บริการแปลฟรี MyMemory) ----------
const PKG_LANG_CODES = { th:'th', en:'en', zh:'zh-CN', ru:'ru', hi:'hi', he:'he', ja:'ja', ko:'ko', ar:'ar' };
const pkgHasThai = s => /[\u0E00-\u0E7F]/.test(s || '');

async function pkgTranslate(text, from, to) {
    if (!text || from === to) return text;
    const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to);
    const j = await r.json();
    const out = j && j.responseData && j.responseData.translatedText;
    // MyMemory บางครั้งตอบ status 200 แต่ส่งข้อความเตือนโควต้าหมดมาแทนคำแปล ต้องกันไม่ให้บันทึกข้อความนั้น
    if (!j || String(j.responseStatus) !== '200' || !out || /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID/i.test(out)) {
        throw new Error('บริการแปลไม่ตอบกลับหรือโควต้าฟรีวันนี้หมด');
    }
    return out;
}

// แปลชื่อ/คำอธิบายเป็นทุกภาษา (ตรวจภาษาต้นฉบับอัตโนมัติ: มีตัวอักษรไทย = ไทย ไม่งั้น = อังกฤษ)
// ชื่อที่ไม่ใช่ภาษาไทย (เช่น SUPER MAX, Double Attraction Special) จะคงเดิมทุกภาษา
async function translatePkgAll(p, srcName, srcDesc, onProgress) {
    const srcLang = pkgHasThai(srcDesc || srcName) ? 'th' : 'en';
    const nameIsThai = pkgHasThai(srcName);
    const newName = {}, newDesc = {};   // เก็บผลไว้ก่อน ถ้าแปลพังกลางทางจะไม่ทับข้อมูลเดิมครึ่ง ๆ กลาง ๆ
    for (const [lang, code] of Object.entries(PKG_LANG_CODES)) {
        if (onProgress) onProgress(lang);
        newDesc[lang] = (lang === srcLang) ? srcDesc : await pkgTranslate(srcDesc, PKG_LANG_CODES[srcLang], code);
        newName[lang] = nameIsThai ? ((lang === 'th') ? srcName : await pkgTranslate(srcName, 'th', code)) : srcName;
    }
    p.name = newName;
    p.desc = newDesc;
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
        await translatePkgAll(p, srcName, srcDesc, lang => { if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase(); });
        renderPricingPackages();
        renderPricingEditor();
        alert('แปลเสร็จแล้ว ลองสลับภาษาดูผล แล้วกดบันทึกไปยัง GitHub');
    } catch (e) {
        alert('แปลอัตโนมัติไม่สำเร็จ: ' + e.message + '\nลองใหม่ภายหลัง หรือกรอกเองในแต่ละภาษา');
        renderPricingEditor();
    }
}

// ---------- เพิ่ม / ลบ แพ็กเกจ ----------
async function addPackage() {
    const name = prompt('ชื่อแพ็กเกจ เช่น SUPER MAX');
    if (!name) return;
    const desc = prompt('คำอธิบายแพ็กเกจ (พิมพ์ภาษาไทยหรืออังกฤษ ระบบจะแปลให้ทุกภาษาอัตโนมัติ)\nเว้นว่างได้') || '';
    const srcLang = pkgHasThai(desc || name) ? 'th' : 'en';
    const p = {
        badge: 'PACKAGE', color: '#3498db',
        name: { [srcLang]: name },
        desc: { [srcLang]: desc },
        child: 0, adult: 0, fixed: []
    };
    siteData.pricing.packages.push(p);
    renderPricingPackages();
    renderPricingEditor();

    if (!desc && !pkgHasThai(name)) return;   // ไม่มีอะไรต้องแปล (ชื่ออังกฤษล้วน ไม่มีคำอธิบาย)
    const i = siteData.pricing.packages.length - 1;
    const btn = document.getElementById('autoTrBtn' + i);
    try {
        await translatePkgAll(p, name, desc, lang => { if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase(); });
        renderPricingPackages();
        renderPricingEditor();
        alert('เพิ่มแพ็กเกจและแปลให้ครบทุกภาษาแล้ว อย่าลืมกรอกราคา แล้วกดบันทึกไปยัง GitHub');
    } catch (e) {
        renderPricingEditor();
        alert('เพิ่มแพ็กเกจแล้ว แต่แปลอัตโนมัติไม่สำเร็จ (' + e.message + ')\nกดปุ่ม "แปลอัตโนมัติ" ในแพ็กเกจนั้นเพื่อลองใหม่ หรือกรอกเองในแต่ละภาษา');
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

// ---------- ติดตั้งส่วนหน้าเว็บ + เชื่อมกับฟังก์ชันเดิม ----------
(function installPricingUI() {
    // 1) หน้าลูกค้า: เปลี่ยนการ์ดแพ็กเกจเดิมให้เรนเดอร์จากข้อมูล
    const grid = document.querySelector('#pricing .price-grid');
    if (grid) { grid.id = 'priceGrid'; grid.innerHTML = ''; }

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
})();
