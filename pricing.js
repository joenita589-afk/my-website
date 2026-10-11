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
                    <button class="btn btn-secondary" id="autoTrBtn${i}" onclick="autoTranslatePkg(${i})">🤖 แปลอัตโนมัติจากภาษาไทย</button>
                    <small style="color:#666;">แปลคำอธิบายภาษาไทยเป็นอีก 8 ภาษา (ข้อความเดิมของภาษาอื่นจะถูกแทนที่) ควรตรวจทานอีกครั้ง</small>
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

// แปลชื่อ/คำอธิบายภาษาไทยเป็นภาษาอื่นอัตโนมัติ (ใช้บริการแปลฟรี MyMemory)
async function autoTranslatePkg(i) {
    const p = siteData.pricing.packages[i];
    const srcName = pkgText(p, 'name', 'th');
    const srcDesc = pkgText(p, 'desc', 'th');
    if (!srcName && !srcDesc) { alert('กรุณากรอกชื่อ/คำอธิบายภาษาไทยก่อน'); return; }
    if (!confirm('แปลข้อความภาษาไทยเป็นภาษาอื่นอัตโนมัติ?\nข้อความเดิมของภาษาอื่นจะถูกแทนที่ และควรตรวจทานผลอีกครั้ง')) return;

    const targets = { en:'en', zh:'zh-CN', ru:'ru', hi:'hi', he:'he', ja:'ja', ko:'ko', ar:'ar' };
    const hasThai = s => /[\u0E00-\u0E7F]/.test(s || '');
    const tr = async (text, to) => {
        if (!text || !hasThai(text)) return text;   // ไม่มีตัวอักษรไทย (เช่นชื่อภาษาอังกฤษ) ใช้ข้อความเดิม
        const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=th|' + to);
        const j = await r.json();
        if (!j || String(j.responseStatus) !== '200' || !j.responseData || !j.responseData.translatedText) throw new Error('แปลไม่สำเร็จ');
        return j.responseData.translatedText;
    };

    const btn = document.getElementById('autoTrBtn' + i);
    if (btn) btn.disabled = true;
    try {
        if (!p.name) p.name = {};
        if (!p.desc) p.desc = {};
        if (srcName) p.name.th = srcName;
        if (srcDesc) p.desc.th = srcDesc;
        for (const [lang, code] of Object.entries(targets)) {
            if (btn) btn.textContent = '⏳ กำลังแปล... ' + lang.toUpperCase();
            if (srcName) p.name[lang] = await tr(srcName, code);
            if (srcDesc) p.desc[lang] = await tr(srcDesc, code);
        }
        renderPricingPackages();
        renderPricingEditor();
        alert('แปลเสร็จแล้ว ลองสลับภาษาดูผล แล้วกดบันทึกไปยัง GitHub');
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
}

function togglePkgFixed(i, idx, checked) {
    const p = siteData.pricing.packages[i];
    p.fixed = p.fixed || [];
    if (checked && !p.fixed.includes(idx)) p.fixed.push(idx);
    if (!checked) p.fixed = p.fixed.filter(x => x !== idx);
    renderPricingPackages();
}

// เพิ่มแพ็กเกจใหม่ (ถามชื่อก่อน แล้วใส่ให้ครบทุกภาษา)
function addPackage() {
    const name = prompt('ชื่อแพ็กเกจ');
    if (!name) return;
    const nm = {}, ds = {};
    Object.keys(translations).forEach(l => { nm[l] = name; ds[l] = ''; });
    siteData.pricing.packages.push({
        badge: 'PACKAGE', color: '#3498db',
        name: nm, desc: ds,
        child: 0, adult: 0, fixed: []
    });
    renderPricingPackages();
    renderPricingEditor();
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
