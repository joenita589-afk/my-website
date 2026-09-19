/* ==========================================================================
   souvenir.js — หน้า "ของที่ระลึก" + ระบบแอดมินเพิ่ม/แก้ไขสินค้า

   วิธีใช้: วางไฟล์นี้ไว้โฟลเดอร์เดียวกับ index.html แล้วเพิ่มบรรทัดนี้
   ต่อจากสคริปต์หลัก (หลัง </script> ตัวสุดท้าย และก่อน </body>):

       <script src="souvenir.js"></script>

   ไฟล์นี้จะสร้างเมนู "ของที่ระลึก", หน้าสินค้า และแท็บแอดมินให้เอง
   ข้อมูลสินค้าเก็บใน siteData.souvenirs จึงถูกบันทึกไปกับปุ่ม "บันทึกไปยัง GitHub" เดิม
   ========================================================================== */
(function () {
    'use strict';

    if (window.__souvenirLoaded) return;
    if (typeof siteData === 'undefined' || typeof translations === 'undefined') {
        console.error('souvenir.js: ต้องวาง <script src="souvenir.js"></script> ต่อจากสคริปต์หลักของ index.html');
        return;
    }
    window.__souvenirLoaded = true;

    const MAX_IMAGES = 8;      // จำนวนรูปสูงสุดต่อสินค้า
    const MAX_SIDE = 900;      // ย่อรูปที่อัปโหลดให้ด้านยาวไม่เกิน (px)
    const JPEG_QUALITY = 0.82;

    if (!Array.isArray(siteData.souvenirs)) siteData.souvenirs = [];

    /* ---------------------------------------------------------------- ข้อความหลายภาษา */
    const TEXT = {
        th: { nav_souvenir: 'ของที่ระลึก', souvenir_title: 'ของที่ระลึก', souvenir_sub: "สินค้าที่ระลึกจาก Ripley's Believe It or Not! Pattaya", souvenir_empty: 'สินค้ากำลังจะมาเร็วๆ นี้', souvenir_soldout: 'สินค้าหมด' },
        en: { nav_souvenir: 'Souvenirs', souvenir_title: 'Souvenir Shop', souvenir_sub: "Souvenirs from Ripley's Believe It or Not! Pattaya", souvenir_empty: 'Coming soon', souvenir_soldout: 'Sold out' },
        zh: { nav_souvenir: '纪念品', souvenir_title: '纪念品商店', souvenir_sub: "Ripley's Believe It or Not! 芭堤雅纪念品", souvenir_empty: '敬请期待', souvenir_soldout: '已售罄' },
        ru: { nav_souvenir: 'Сувениры', souvenir_title: 'Магазин сувениров', souvenir_sub: "Сувениры из Ripley's Believe It or Not! Pattaya", souvenir_empty: 'Скоро в продаже', souvenir_soldout: 'Нет в наличии' },
        hi: { nav_souvenir: 'यादगार वस्तुएँ', souvenir_title: 'स्मृति चिन्ह की दुकान', souvenir_sub: "Ripley's Believe It or Not! Pattaya के स्मृति चिन्ह", souvenir_empty: 'जल्द आ रहा है', souvenir_soldout: 'स्टॉक में नहीं' },
        he: { nav_souvenir: 'מזכרות', souvenir_title: 'חנות מזכרות', souvenir_sub: "מזכרות מ-Ripley's Believe It or Not! Pattaya", souvenir_empty: 'בקרוב', souvenir_soldout: 'אזל מהמלאי' },
        ja: { nav_souvenir: 'お土産', souvenir_title: 'お土産ショップ', souvenir_sub: "Ripley's Believe It or Not! パタヤのお土産", souvenir_empty: '近日登場', souvenir_soldout: '売り切れ' },
        ko: { nav_souvenir: '기념품', souvenir_title: '기념품 숍', souvenir_sub: "Ripley's Believe It or Not! 파타야 기념품", souvenir_empty: '곧 만나보실 수 있습니다', souvenir_soldout: '품절' },
        ar: { nav_souvenir: 'الهدايا التذكارية', souvenir_title: 'متجر الهدايا التذكارية', souvenir_sub: "هدايا تذكارية من Ripley's Believe It or Not! Pattaya", souvenir_empty: 'قريبًا', souvenir_soldout: 'نفدت الكمية' }
    };
    Object.keys(TEXT).forEach(l => {
        translations[l] = translations[l] || {};
        Object.assign(translations[l], TEXT[l]);
    });

    /* ---------------------------------------------------------------- ตัวช่วย */
    const T = () => translations[currentLang] || translations.en || {};
    const esc = s => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    // ชื่อ/รายละเอียดเก็บแยกตามภาษา: p.name = { th, en, ... } ถ้าภาษานั้นว่างให้ใช้อังกฤษ แล้วไทย
    const text = (p, field, lang) => {
        const o = p[field] || {};
        const l = lang || currentLang;
        return o[l] || o.en || o.th || '';
    };
    const priceText = p => {
        const n = Number(p.price);
        return n > 0 ? n.toLocaleString() : '';
    };
    const editorVisible = () => {
        const el = document.getElementById('adminTabSouvenir');
        return !!el && el.style.display !== 'none';
    };

    /* ---------------------------------------------------------------- CSS */
    const css = `
        .sv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; margin-top: 30px; }
        .sv-card { position: relative; background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-top: 5px solid var(--primary); cursor: pointer; transition: 0.3s; }
        .sv-card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(0,0,0,0.5); }
        .sv-img { position: relative; aspect-ratio: 1 / 1; background: #f0f0f0; }
        .sv-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .sv-noimg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 3em; }
        .sv-price { position: absolute; bottom: 0; right: 12px; transform: translateY(50%); background: var(--primary); color: #fff; padding: 6px 16px; border-radius: 22px; font-size: 1.1em; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 2px solid #fff; z-index: 2; white-space: nowrap; }
        .sv-soldout { position: absolute; inset: 0; background: rgba(0,0,0,0.55); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3em; font-weight: bold; text-align: center; padding: 10px; }
        .sv-info { padding: 28px 16px 18px; }
        .sv-info h4 { font-size: 1.1em; color: var(--dark); line-height: 1.4; }
        [dir="rtl"] .sv-price { right: auto; left: 12px; }
        .sv-main { width: 100%; max-height: 420px; object-fit: contain; background: #f8f9fa; border-radius: 10px; margin-bottom: 10px; display: block; }
        .sv-thumbs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; }
        .sv-thumbs img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 2px solid #eee; cursor: pointer; }
        .sv-thumbs img.active { border-color: var(--primary); }
        .sv-edit-item { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 15px; margin-bottom: 15px; }
        .sv-edit-item h4 { margin-bottom: 12px; color: var(--dark); }
        .sv-check { display: inline-flex; align-items: center; gap: 8px; margin: 5px 0 10px; font-weight: bold; color: var(--dark); cursor: pointer; }
        .sv-check input { width: 18px; height: 18px; accent-color: var(--primary); }
        .sv-edit-imgs { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0; }
        .sv-edit-img { position: relative; }
        .sv-edit-img img { width: 90px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block; }
        .sv-edit-img button { position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; border-radius: 50%; border: none; background: #e74c3c; color: #fff; cursor: pointer; line-height: 1; }
        .sv-edit-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; }
        .sv-edit-row .sv-url { flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .sv-edit-actions { margin-top: 10px; border-top: 1px dashed #ddd; padding-top: 10px; }
        @media (max-width: 768px) {
            .sv-grid { grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; }
            .sv-info { padding: 24px 10px 12px; }
            .sv-info h4 { font-size: 0.95em; }
            .sv-price { font-size: 0.95em; padding: 4px 12px; }
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* ---------------------------------------------------------------- สร้างเมนู / หน้า / แท็บแอดมิน */
    function inject(anchor, position, html, label) {
        if (!anchor) { console.warn('souvenir.js: ไม่พบตำแหน่งสำหรับ ' + label); return; }
        anchor.insertAdjacentHTML(position, html);
    }

    inject(
        document.querySelector('#navContainer button[onclick*="showSection(\'contact\')"]'),
        'beforebegin',
        `<button class="nav-btn" onclick="showSection('souvenir')">
            <i class="fas fa-bag-shopping"></i> <span data-i18n="nav_souvenir">ของที่ระลึก</span>
        </button>`,
        'ปุ่มเมนู'
    );

    inject(
        document.getElementById('contact'),
        'beforebegin',
        `<section id="souvenir" class="section">
            <div class="hero">
                <h1 data-i18n="souvenir_title">ของที่ระลึก</h1>
                <p data-i18n="souvenir_sub">สินค้าที่ระลึกจาก Ripley's Believe It or Not! Pattaya</p>
            </div>
            <div class="sv-grid" id="souvenirGrid"></div>
        </section>`,
        'หน้าของที่ระลึก'
    );

    inject(
        document.querySelector('#adminDashboard .tabs'),
        'beforeend',
        `<button class="tab" onclick="showAdminTab('souvenir')">🛍️ ของที่ระลึก</button>`,
        'แท็บแอดมิน'
    );

    inject(
        document.getElementById('adminTabContent'),
        'beforebegin',
        `<div id="adminTabSouvenir" class="admin-section" style="display:none;">
            <h3><i class="fas fa-bag-shopping"></i> จัดการของที่ระลึก</h3>
            <div id="souvenirLangNote" class="lang-editing-note"></div>
            <div id="souvenirEditor"></div>
            <button class="btn btn-success" onclick="addSouvenir()"><i class="fas fa-plus"></i> เพิ่มสินค้าใหม่</button>
            <button class="btn" onclick="saveAllChanges()" style="margin-top: 20px;">
                <i class="fas fa-save"></i> บันทึกการเปลี่ยนแปลงทั้งหมดไปยัง GitHub
            </button>
        </div>`,
        'ส่วนจัดการสินค้าในแอดมิน'
    );

    /* ---------------------------------------------------------------- หน้าลูกค้า */
    function renderSouvenirs() {
        const grid = document.getElementById('souvenirGrid');
        if (!grid) return;
        const t = T();
        const list = siteData.souvenirs || [];
        if (!list.length) {
            grid.innerHTML = `<div class="info-box" style="grid-column: 1 / -1; text-align: center; margin-bottom: 0;">${t.souvenir_empty || ''}</div>`;
            return;
        }
        grid.innerHTML = list.map((p, i) => {
            const img = (p.images || [])[0];
            const name = esc(text(p, 'name'));
            const price = priceText(p);
            return `
                <div class="sv-card" onclick="openSouvenir(${i})" role="button">
                    <div class="sv-img">
                        ${img ? `<img src="${esc(img)}" alt="${name}" loading="lazy">` : `<div class="sv-noimg"><i class="fas fa-gift"></i></div>`}
                        ${p.soldOut ? `<div class="sv-soldout">${t.souvenir_soldout || ''}</div>` : ''}
                        ${price ? `<div class="sv-price">${price} ${t.baht || 'Baht'}</div>` : ''}
                    </div>
                    <div class="sv-info"><h4>${name}</h4></div>
                </div>`;
        }).join('');
    }

    function openSouvenir(i) {
        const p = (siteData.souvenirs || [])[i];
        if (!p) return;
        const t = T();
        const imgs = p.images || [];
        const name = esc(text(p, 'name'));
        const desc = esc(text(p, 'desc')).replace(/\n/g, '<br>');
        const price = priceText(p);
        document.getElementById('modalContent').innerHTML = `
            ${imgs.length ? `<img id="svMainImg" class="sv-main" src="${esc(imgs[0])}" alt="${name}">` : ''}
            ${imgs.length > 1 ? `<div class="sv-thumbs">${imgs.map((src, k) => `<img src="${esc(src)}" class="${k === 0 ? 'active' : ''}" onclick="svShowImg(${i}, ${k})" alt="">`).join('')}</div>` : ''}
            <h2>${name}</h2>
            ${price ? `<div class="modal-price">${price} ${t.baht || 'Baht'}</div>` : ''}
            ${p.soldOut ? `<div class="modal-price" style="background:#777;">${t.souvenir_soldout || ''}</div>` : ''}
            ${desc ? `<p>${desc}</p>` : ''}`;
        document.getElementById('attractionModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function svShowImg(i, k) {
        const p = (siteData.souvenirs || [])[i];
        const main = document.getElementById('svMainImg');
        if (!p || !main || !p.images || !p.images[k]) return;
        main.src = p.images[k];
        document.querySelectorAll('.sv-thumbs img').forEach((el, idx) => el.classList.toggle('active', idx === k));
    }

    /* ---------------------------------------------------------------- แอดมิน: ตัวแก้ไขสินค้า */
    const LANG_NAMES = { th: 'ไทย', en: 'English', zh: '中文', ru: 'Русский', hi: 'हिन्दी', he: 'עברית', ja: '日本語', ko: '한국어', ar: 'العربية' };

    function refresh(editorToo) {
        renderSouvenirs();
        if (editorToo) renderSouvenirEditor();
    }

    // หมายเหตุ: ช่องในตัวแก้ไขไม่ใช้ class "admin-section" เพราะฟังก์ชัน showAdminTab เดิมจะซ่อนทุกอันที่ใช้ class นี้
    function renderSouvenirEditor() {
        const box = document.getElementById('souvenirEditor');
        if (!box) return;
        const list = siteData.souvenirs;
        const note = document.getElementById('souvenirLangNote');
        if (note) {
            note.innerHTML = `<i class="fas fa-language"></i> กำลังแก้ไขชื่อ/รายละเอียดของภาษา: <strong>${LANG_NAMES[currentLang] || currentLang}</strong>` +
                `<br>ช่องที่เว้นว่างไว้ ระบบจะแสดงข้อความภาษาอังกฤษ (ถ้าไม่มีใช้ภาษาไทย) แทน — สลับภาษาที่มุมขวาบนเพื่อแก้ไขภาษาอื่น` +
                `<br><i class="fas fa-photo-video"></i> ราคา / รูปภาพ / สถานะสินค้าหมด ใช้ร่วมกันทุกภาษา`;
        }
        if (!list.length) {
            box.innerHTML = '<p style="margin-bottom:15px;color:#666;">ยังไม่มีสินค้า กดปุ่ม "เพิ่มสินค้าใหม่" เพื่อเริ่มต้น</p>';
            return;
        }
        box.innerHTML = list.map((p, i) => `
            <div class="sv-edit-item">
                <h4>${i + 1}. ${esc(text(p, 'name')) || '(ยังไม่มีชื่อ)'}</h4>
                <div class="form-group">
                    <label>ชื่อสินค้า (${LANG_NAMES[currentLang] || currentLang})</label>
                    <input type="text" value="${esc((p.name || {})[currentLang] || '')}" placeholder="${esc(text(p, 'name'))}" onchange="svUpdateText(${i}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>รายละเอียด (${LANG_NAMES[currentLang] || currentLang})</label>
                    <textarea placeholder="${esc(text(p, 'desc'))}" onchange="svUpdateText(${i}, 'desc', this.value)">${esc((p.desc || {})[currentLang] || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>ราคา (บาท)</label>
                    <input type="number" min="0" step="1" value="${p.price == null ? '' : esc(p.price)}" onchange="svUpdatePrice(${i}, this.value)">
                </div>
                <label class="sv-check"><input type="checkbox" ${p.soldOut ? 'checked' : ''} onchange="svToggleSold(${i}, this.checked)"> สินค้าหมด (แสดงป้าย "สินค้าหมด" บนการ์ด)</label>
                <div>
                    <strong>รูปภาพ (${(p.images || []).length}/${MAX_IMAGES}) — รูปแรกคือรูปหน้าปก</strong>
                    <div class="sv-edit-imgs">
                        ${(p.images || []).map((src, k) => `
                            <div class="sv-edit-img">
                                <img src="${esc(src)}" alt="">
                                <button type="button" title="ลบรูปนี้" onclick="svRemoveImage(${i}, ${k})">✕</button>
                            </div>`).join('')}
                    </div>
                    <div class="sv-edit-row">
                        <label class="btn btn-secondary" style="display:inline-block;cursor:pointer;margin:0;">
                            <i class="fas fa-upload"></i> อัปโหลดรูป
                            <input type="file" accept="image/*" multiple hidden onchange="svUploadImages(${i}, this)">
                        </label>
                        <input type="text" class="sv-url" id="svUrl${i}" placeholder="หรือวางลิงก์รูป https://...">
                        <button type="button" class="btn" style="margin:0;" onclick="svAddImageUrl(${i})">เพิ่มจากลิงก์</button>
                    </div>
                </div>
                <div class="sv-edit-actions">
                    <button type="button" class="btn" onclick="svMove(${i}, -1)" ${i === 0 ? 'disabled' : ''}>↑ เลื่อนขึ้น</button>
                    <button type="button" class="btn" onclick="svMove(${i}, 1)" ${i === list.length - 1 ? 'disabled' : ''}>↓ เลื่อนลง</button>
                    <button type="button" class="btn btn-danger" onclick="deleteSouvenir(${i})"><i class="fas fa-trash"></i> ลบสินค้า</button>
                </div>
            </div>`).join('');
    }

    function addSouvenir() {
        siteData.souvenirs.push({ name: { th: 'สินค้าใหม่' }, desc: {}, price: 0, soldOut: false, images: [] });
        refresh(true);
    }

    function deleteSouvenir(i) {
        if (!confirm('ต้องการลบสินค้านี้?')) return;
        siteData.souvenirs.splice(i, 1);
        refresh(true);
    }

    function svMove(i, dir) {
        const list = siteData.souvenirs;
        const j = i + dir;
        if (j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        refresh(true);
    }

    function svUpdateText(i, field, value) {
        const p = siteData.souvenirs[i];
        if (!p[field] || typeof p[field] !== 'object') p[field] = {};
        if (value.trim() === '') delete p[field][currentLang];
        else p[field][currentLang] = value;
        refresh(false);
    }

    function svUpdatePrice(i, value) {
        const n = parseFloat(value);
        siteData.souvenirs[i].price = isNaN(n) || n < 0 ? 0 : n;
        refresh(false);
    }

    function svToggleSold(i, checked) {
        siteData.souvenirs[i].soldOut = !!checked;
        refresh(false);
    }

    function svRemoveImage(i, k) {
        siteData.souvenirs[i].images.splice(k, 1);
        refresh(true);
    }

    function svAddImageUrl(i) {
        const input = document.getElementById('svUrl' + i);
        const url = input ? input.value.trim() : '';
        if (!url) return;
        const p = siteData.souvenirs[i];
        if (!p.images) p.images = [];
        if (p.images.length >= MAX_IMAGES) { alert('เพิ่มรูปได้สูงสุด ' + MAX_IMAGES + ' รูปต่อสินค้า'); return; }
        p.images.push(url);
        refresh(true);
    }

    // ย่อรูป + แปลงเป็น JPEG ก่อนเก็บ เพื่อให้ไฟล์เล็ก (ประมาณ 50–150 KB ต่อรูป)
    function compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error || new Error('อ่านไฟล์ไม่ได้'));
            reader.onload = () => {
                const img = new Image();
                img.onerror = () => reject(new Error('ไฟล์รูปไม่ถูกต้อง'));
                img.onload = () => {
                    let w = img.naturalWidth, h = img.naturalHeight;
                    if (!w || !h) { reject(new Error('อ่านขนาดรูปไม่ได้')); return; }
                    const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
                    w = Math.round(w * scale);
                    h = Math.round(h * scale);
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#fff';          // พื้นหลังขาวสำหรับรูป PNG โปร่งใส
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async function svUploadImages(i, input) {
        const files = Array.from(input.files || []);
        if (!files.length) return;
        const p = siteData.souvenirs[i];
        if (!p.images) p.images = [];
        for (const f of files) {
            if (p.images.length >= MAX_IMAGES) { alert('เพิ่มรูปได้สูงสุด ' + MAX_IMAGES + ' รูปต่อสินค้า'); break; }
            if (!f.type.startsWith('image/')) continue;
            try {
                p.images.push(await compressImage(f));
            } catch (e) {
                alert('เพิ่มรูป "' + f.name + '" ไม่สำเร็จ: ' + e.message);
            }
        }
        input.value = '';
        refresh(true);
    }

    /* ---------------------------------------------------------------- บันทึก: อัปโหลดรูปใหม่ขึ้น GitHub เป็นไฟล์ก่อน
       รูปที่อัปโหลดจะถูกเก็บเป็นไฟล์ในโฟลเดอร์ souvenirs/ ของ repo (ไม่ฝังลง index.html)
       เพื่อไม่ให้ index.html ใหญ่จนเกิน 1 MB ซึ่ง GitHub API จะไม่ส่งเนื้อหาไฟล์กลับมา */
    function collectPending() {
        const out = [];
        (siteData.souvenirs || []).forEach(p => (p.images || []).forEach((src, k) => {
            if (/^data:image\//i.test(src)) out.push({ p, k });
        }));
        return out;
    }

    async function uploadPending(config, pending) {
        try {
            for (const { p, k } of pending) {
                const src = p.images[k];
                const path = 'souvenirs/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
                const res = await fetch(`https://api.github.com/repos/${config.username}/${config.repo}/contents/${path}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `token ${config.token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Add souvenir image via Admin Panel',
                        content: src.split(',')[1],
                        branch: config.branch
                    })
                });
                if (!res.ok) {
                    let detail = '';
                    try { detail = (await res.json()).message || ''; } catch (e) { /* ignore */ }
                    throw new Error('HTTP ' + res.status + (detail ? ' — ' + detail : ''));
                }
                p.images[k] = path;   // เปลี่ยนจากข้อมูลรูปชั่วคราว เป็นพาธไฟล์ใน repo
            }
            return true;
        } catch (e) {
            alert('❌ อัปโหลดรูปสินค้าไม่สำเร็จ: ' + e.message + '\n(รูปที่อัปโหลดสำเร็จแล้วจะไม่ถูกอัปโหลดซ้ำ)');
            return false;
        } finally {
            refresh(editorVisible());
        }
    }

    /* ---------------------------------------------------------------- ต่อเข้ากับฟังก์ชันเดิมของ index.html */
    const origChangeLang = window.changeLang;
    if (typeof origChangeLang === 'function') {
        window.changeLang = function () {
            const r = origChangeLang.apply(this, arguments);
            refresh(editorVisible());
            return r;
        };
    }

    const origShowAdminTab = window.showAdminTab;
    if (typeof origShowAdminTab === 'function') {
        window.showAdminTab = function (tab) {
            const r = origShowAdminTab.apply(this, arguments);
            if (tab === 'souvenir') renderSouvenirEditor();
            // แก้บั๊กเดิม: showAdminTab ซ่อนทุกช่อง .admin-section รวมรายการเมนูที่ซ้อนอยู่ข้างใน จึงต้องวาดแท็บเมนูใหม่
            if (tab === 'menu' && typeof window.renderMenuEditor === 'function') window.renderMenuEditor();
            return r;
        };
    }

    const origSave = window.saveAllChanges;
    if (typeof origSave === 'function') {
        window.saveAllChanges = async function () {
            const pending = collectPending();
            if (pending.length) {
                const config = JSON.parse(localStorage.getItem('githubConfig') || 'null');
                // ถ้ายังไม่ตั้งค่า Token ให้ฟังก์ชันเดิมแจ้งเตือนตามปกติ
                if (config && config.token) {
                    if (!confirm('มีรูปสินค้าใหม่ ' + pending.length + ' รูปที่ยังไม่ได้อัปโหลด\nระบบจะอัปโหลดรูปไปที่ GitHub ก่อน แล้วจึงบันทึกข้อมูลส่วนอื่นต่อ\n\nดำเนินการต่อ?')) return;
                    if (!(await uploadPending(config, pending))) return;
                }
            }
            return origSave.apply(this, arguments);
        };
    }

    /* ---------------------------------------------------------------- เปิดให้ onclick ใน HTML เรียกใช้ */
    Object.assign(window, {
        renderSouvenirs, openSouvenir, svShowImg, renderSouvenirEditor,
        addSouvenir, deleteSouvenir, svMove, svUpdateText, svUpdatePrice,
        svToggleSold, svRemoveImage, svAddImageUrl, svUploadImages
    });

    // วาดครั้งแรก (กรณีสคริปต์ถูกโหลดหลัง window.onload ไปแล้ว)
    document.querySelectorAll('[data-i18n="nav_souvenir"], #souvenir [data-i18n]').forEach(el => {
        const v = T()[el.getAttribute('data-i18n')];
        if (v) el.innerHTML = v;
    });
    renderSouvenirs();
})();
