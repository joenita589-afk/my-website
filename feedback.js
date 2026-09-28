/* feedback.js — ระบบแสดงความคิดเห็นลูกค้า (ไฟล์เดียวจบ)
 * วางไฟล์นี้ข้าง index.html แล้วเพิ่มบรรทัดเดียวก่อน </body>:
 *   <script src="feedback.js"></script>     (ต่อจาก souvenir.js)
 * ไฟล์นี้จะสร้างปุ่มเมนู หน้ากรอก ป๊อปอัพ CSS และแท็บแอดมินให้เองทั้งหมด
 */
(function () {
    'use strict';

    // ---------- 1) คำแปล 9 ภาษา ----------
    const L = {
        th: { nav_feedback: "ความคิดเห็น", feedback_title: "แสดงความคิดเห็น", feedback_sub: "ความคิดเห็นของคุณมีค่าสำหรับเรา", feedback_topic: "หัวข้อ", feedback_topic_hint: "(เลือกได้มากกว่า 1 หัวข้อ)", topic_ride: "เครื่องเล่น", topic_staff: "พนักงาน", topic_clean: "ความสะอาด", topic_food: "อาหารและเครื่องดื่ม", topic_price: "ราคาและบัตรเข้าชม", topic_other: "อื่นๆ", feedback_email: "อีเมลของคุณ", feedback_message: "ความคิดเห็น", feedback_email_ph: "name@example.com", feedback_message_ph: "เล่าให้เราฟังได้เลย...", feedback_submit: "ส่งความคิดเห็น", feedback_sending: "กำลังส่ง...", feedback_thanks_title: "ขอขอบคุณ", feedback_thanks_msg: "ขอขอบคุณสำหรับการแสดงความคิดเห็น เราจะตอบกลับโดยเร็วที่สุด", feedback_close: "ปิด", feedback_err_topic: "กรุณาเลือกอย่างน้อย 1 หัวข้อ", feedback_err_invalid: "กรุณากรอกอีเมลที่ถูกต้องและความคิดเห็น", feedback_err_send: "ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
        en: { nav_feedback: "Feedback", feedback_title: "Share Your Feedback", feedback_sub: "Your opinion matters to us", feedback_topic: "Topic", feedback_topic_hint: "(select one or more)", topic_ride: "Attractions", topic_staff: "Staff", topic_clean: "Cleanliness", topic_food: "Food & beverages", topic_price: "Prices & tickets", topic_other: "Other", feedback_email: "Your email", feedback_message: "Your feedback", feedback_email_ph: "name@example.com", feedback_message_ph: "Tell us what you think...", feedback_submit: "Submit feedback", feedback_sending: "Sending...", feedback_thanks_title: "Thank you", feedback_thanks_msg: "Thank you for your feedback. We will get back to you soon.", feedback_close: "Close", feedback_err_topic: "Please select at least one topic", feedback_err_invalid: "Please enter a valid email and your feedback", feedback_err_send: "Could not send. Please try again." },
        zh: { nav_feedback: "意见反馈", feedback_title: "发表意见", feedback_sub: "您的意见对我们很重要", feedback_topic: "主题", feedback_topic_hint: "（可多选）", topic_ride: "游乐设施", topic_staff: "工作人员", topic_clean: "清洁卫生", topic_food: "餐饮", topic_price: "价格与门票", topic_other: "其他", feedback_email: "您的邮箱", feedback_message: "意见内容", feedback_email_ph: "name@example.com", feedback_message_ph: "请告诉我们您的想法...", feedback_submit: "提交意见", feedback_sending: "发送中...", feedback_thanks_title: "谢谢", feedback_thanks_msg: "感谢您的宝贵意见，我们会尽快回复您。", feedback_close: "关闭", feedback_err_topic: "请至少选择一个主题", feedback_err_invalid: "请填写有效的邮箱和意见内容", feedback_err_send: "发送失败，请重试" },
        ru: { nav_feedback: "Отзыв", feedback_title: "Оставьте отзыв", feedback_sub: "Ваше мнение важно для нас", feedback_topic: "Тема", feedback_topic_hint: "(можно выбрать несколько)", topic_ride: "Аттракционы", topic_staff: "Персонал", topic_clean: "Чистота", topic_food: "Еда и напитки", topic_price: "Цены и билеты", topic_other: "Другое", feedback_email: "Ваш email", feedback_message: "Ваш отзыв", feedback_email_ph: "name@example.com", feedback_message_ph: "Расскажите, что вы думаете...", feedback_submit: "Отправить", feedback_sending: "Отправка...", feedback_thanks_title: "Спасибо", feedback_thanks_msg: "Спасибо за ваш отзыв. Мы ответим вам в ближайшее время.", feedback_close: "Закрыть", feedback_err_topic: "Выберите хотя бы одну тему", feedback_err_invalid: "Введите корректный email и отзыв", feedback_err_send: "Не удалось отправить. Попробуйте ещё раз." },
        hi: { nav_feedback: "प्रतिक्रिया", feedback_title: "अपनी राय दें", feedback_sub: "आपकी राय हमारे लिए महत्वपूर्ण है", feedback_topic: "विषय", feedback_topic_hint: "(एक या अधिक चुनें)", topic_ride: "राइड्स", topic_staff: "कर्मचारी", topic_clean: "स्वच्छता", topic_food: "खान-पान", topic_price: "कीमत और टिकट", topic_other: "अन्य", feedback_email: "आपका ईमेल", feedback_message: "आपकी प्रतिक्रिया", feedback_email_ph: "name@example.com", feedback_message_ph: "हमें बताएं आप क्या सोचते हैं...", feedback_submit: "प्रतिक्रिया भेजें", feedback_sending: "भेजा जा रहा है...", feedback_thanks_title: "धन्यवाद", feedback_thanks_msg: "आपकी प्रतिक्रिया के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।", feedback_close: "बंद करें", feedback_err_topic: "कृपया कम से कम एक विषय चुनें", feedback_err_invalid: "कृपया सही ईमेल और प्रतिक्रिया दर्ज करें", feedback_err_send: "भेजा नहीं जा सका। कृपया पुनः प्रयास करें।" },
        he: { nav_feedback: "משוב", feedback_title: "שתפו אותנו במשוב", feedback_sub: "דעתכם חשובה לנו", feedback_topic: "נושא", feedback_topic_hint: "(ניתן לבחור כמה)", topic_ride: "מתקנים", topic_staff: "צוות", topic_clean: "ניקיון", topic_food: "אוכל ומשקאות", topic_price: "מחירים וכרטיסים", topic_other: "אחר", feedback_email: "האימייל שלך", feedback_message: "המשוב שלך", feedback_email_ph: "name@example.com", feedback_message_ph: "ספרו לנו מה דעתכם...", feedback_submit: "שליחת משוב", feedback_sending: "שולח...", feedback_thanks_title: "תודה", feedback_thanks_msg: "תודה על המשוב. נחזור אליכם בהקדם.", feedback_close: "סגירה", feedback_err_topic: "אנא בחרו לפחות נושא אחד", feedback_err_invalid: "אנא הזינו אימייל תקין ומשוב", feedback_err_send: "השליחה נכשלה. נסו שוב." },
        ja: { nav_feedback: "ご意見", feedback_title: "ご意見をお聞かせください", feedback_sub: "お客様の声が私たちの力になります", feedback_topic: "項目", feedback_topic_hint: "（複数選択可）", topic_ride: "アトラクション", topic_staff: "スタッフ", topic_clean: "清潔さ", topic_food: "飲食", topic_price: "料金・チケット", topic_other: "その他", feedback_email: "メールアドレス", feedback_message: "ご意見", feedback_email_ph: "name@example.com", feedback_message_ph: "ご意見をご記入ください...", feedback_submit: "送信する", feedback_sending: "送信中...", feedback_thanks_title: "ありがとうございます", feedback_thanks_msg: "ご意見ありがとうございます。追ってご連絡いたします。", feedback_close: "閉じる", feedback_err_topic: "項目を1つ以上選択してください", feedback_err_invalid: "正しいメールアドレスとご意見を入力してください", feedback_err_send: "送信に失敗しました。もう一度お試しください。" },
        ko: { nav_feedback: "의견", feedback_title: "의견 남기기", feedback_sub: "고객님의 의견은 소중합니다", feedback_topic: "주제", feedback_topic_hint: "(복수 선택 가능)", topic_ride: "어트랙션", topic_staff: "직원", topic_clean: "청결", topic_food: "음식 및 음료", topic_price: "가격 및 티켓", topic_other: "기타", feedback_email: "이메일", feedback_message: "의견", feedback_email_ph: "name@example.com", feedback_message_ph: "의견을 남겨주세요...", feedback_submit: "의견 보내기", feedback_sending: "전송 중...", feedback_thanks_title: "감사합니다", feedback_thanks_msg: "소중한 의견 감사합니다. 빠르게 답변드리겠습니다.", feedback_close: "닫기", feedback_err_topic: "주제를 하나 이상 선택해 주세요", feedback_err_invalid: "올바른 이메일과 의견을 입력해 주세요", feedback_err_send: "전송에 실패했습니다. 다시 시도해 주세요." },
        ar: { nav_feedback: "الملاحظات", feedback_title: "شاركنا رأيك", feedback_sub: "رأيك يهمنا", feedback_topic: "الموضوع", feedback_topic_hint: "(يمكن اختيار أكثر من موضوع)", topic_ride: "الألعاب", topic_staff: "الموظفون", topic_clean: "النظافة", topic_food: "الطعام والمشروبات", topic_price: "الأسعار والتذاكر", topic_other: "أخرى", feedback_email: "بريدك الإلكتروني", feedback_message: "ملاحظاتك", feedback_email_ph: "name@example.com", feedback_message_ph: "أخبرنا برأيك...", feedback_submit: "إرسال الملاحظات", feedback_sending: "جارٍ الإرسال...", feedback_thanks_title: "شكرًا لك", feedback_thanks_msg: "شكرًا لك على ملاحظاتك. سنرد عليك في أقرب وقت.", feedback_close: "إغلاق", feedback_err_topic: "يرجى اختيار موضوع واحد على الأقل", feedback_err_invalid: "يرجى إدخال بريد إلكتروني صحيح وملاحظاتك", feedback_err_send: "تعذر الإرسال. يرجى المحاولة مرة أخرى." }
    };
    Object.keys(L).forEach(l => { translations[l] = Object.assign(translations[l] || {}, L[l]); });
    const tr = k => ((translations[currentLang] || {})[k]) || translations.en[k] || '';
    const $ = id => document.getElementById(id);
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ---------- 2) CSS ----------
    const style = document.createElement('style');
    style.textContent = `
        .fb-topics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .fb-chip { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 2px solid #ddd; border-radius: 10px; background: #fff; color: var(--dark); font-size: 14px; cursor: pointer; text-align: start; transition: 0.2s; }
        .fb-chip > i:first-child { color: var(--primary); width: 20px; text-align: center; }
        .fb-chip:hover { border-color: var(--primary); }
        .fb-chip.on { background: var(--primary); border-color: var(--primary); color: #fff; }
        .fb-chip.on > i:first-child { color: #fff; }
        .fb-chip .fb-check { margin-inline-start: auto; display: none; }
        .fb-chip.on .fb-check { display: inline; }
        .fb-card { max-width: 640px; margin: 0 auto; }
        .fb-hint { font-weight: normal; color: #777; font-size: 0.85em; }
        .fb-email-row { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
        .fb-email-row .btn { margin: 0; }
        @media (max-width: 420px) { .fb-topics { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);

    // ---------- 3) ปุ่มเมนู ----------
    const TOPICS = [
        ['ride', 'fa-ticket-alt'], ['staff', 'fa-user-tie'], ['clean', 'fa-broom'],
        ['food', 'fa-utensils'], ['price', 'fa-tag'], ['other', 'fa-comment-dots']
    ];
    const navBox = $('navContainer');
    if (navBox) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.setAttribute('onclick', "showSection('feedback')");
        btn.innerHTML = '<i class="fas fa-comment-dots"></i> <span data-i18n="nav_feedback">ความคิดเห็น</span>';
        const contactBtn = navBox.querySelector('.nav-btn[onclick*="contact"]');
        if (contactBtn) contactBtn.after(btn); else navBox.appendChild(btn);
    }

    // ---------- 4) หน้ากรอกความคิดเห็น ----------
    const section = document.createElement('section');
    section.id = 'feedback';
    section.className = 'section';
    section.innerHTML = `
        <div class="hero">
            <h1 data-i18n="feedback_title">แสดงความคิดเห็น</h1>
            <p data-i18n="feedback_sub">ความคิดเห็นของคุณมีค่าสำหรับเรา</p>
        </div>
        <div class="info-box fb-card">
            <div class="form-group">
                <label><span data-i18n="feedback_topic">หัวข้อ</span> <span class="fb-hint" data-i18n="feedback_topic_hint">(เลือกได้มากกว่า 1 หัวข้อ)</span></label>
                <div class="fb-topics" id="fbTopics">
                    ${TOPICS.map(([k, ic]) => `<button type="button" class="fb-chip" data-topic="${k}"><i class="fas ${ic}"></i> <span data-i18n="topic_${k}"></span><i class="fas fa-check fb-check"></i></button>`).join('')}
                </div>
            </div>
            <div class="form-group">
                <label data-i18n="feedback_email">อีเมลของคุณ</label>
                <input type="email" id="fbEmail" autocomplete="email">
            </div>
            <div class="form-group">
                <label data-i18n="feedback_message">ความคิดเห็น</label>
                <textarea id="fbMessage" maxlength="3000" style="min-height:160px;"></textarea>
            </div>
            <input type="text" id="fbWebsite" tabindex="-1" autocomplete="off" style="position:absolute; left:-9999px;" aria-hidden="true">
            <p id="fbError" style="color:#e74c3c; display:none; margin-bottom:10px;"></p>
            <button class="btn btn-success" id="fbSubmit" style="width:100%;">
                <i class="fas fa-paper-plane"></i> <span id="fbSubmitLabel" data-i18n="feedback_submit">ส่งความคิดเห็น</span>
            </button>
        </div>`;
    const adminSection = $('admin');
    if (adminSection) adminSection.before(section); else document.body.appendChild(section);

    // ---------- 5) ป๊อปอัพขอบคุณ ----------
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'feedbackThanksModal';
    modal.innerHTML = `
        <div class="modal-box" style="max-width:420px; text-align:center;">
            <div class="card-icon" style="background:#27ae60; margin:0 auto 15px;"><i class="fas fa-check"></i></div>
            <h2 data-i18n="feedback_thanks_title">ขอขอบคุณ</h2>
            <p data-i18n="feedback_thanks_msg" style="margin:10px 0 20px;">ขอขอบคุณสำหรับการแสดงความคิดเห็น เราจะตอบกลับโดยเร็วที่สุด</p>
            <button class="btn btn-success" id="fbThanksClose" style="width:100%;" data-i18n="feedback_close">ปิด</button>
        </div>`;
    document.body.appendChild(modal);

    function closeThanks() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    $('fbThanksClose').addEventListener('click', closeThanks);
    modal.addEventListener('click', e => { if (e.target === modal) closeThanks(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeThanks(); });

    // ---------- 6) พฤติกรรมของฟอร์ม ----------
    const topicBox = $('fbTopics');
    const errEl = $('fbError');
    const selectedTopics = () => [...topicBox.querySelectorAll('.fb-chip.on')].map(c => c.dataset.topic);

    topicBox.addEventListener('click', e => {
        const chip = e.target.closest('.fb-chip');
        if (!chip) return;
        chip.classList.toggle('on');
        errEl.style.display = 'none';
    });
    ['fbEmail', 'fbMessage'].forEach(id => $(id).addEventListener('input', () => { errEl.style.display = 'none'; }));

    function showError(msg) { errEl.textContent = msg; errEl.style.display = 'block'; }

    $('fbSubmit').addEventListener('click', async () => {
        const topics = selectedTopics();
        const email = $('fbEmail').value.trim();
        const message = $('fbMessage').value.trim();
        const website = $('fbWebsite').value; // honeypot
        const btn = $('fbSubmit');
        const label = $('fbSubmitLabel');
        errEl.style.display = 'none';

        if (!topics.length) { showError(tr('feedback_err_topic')); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) { showError(tr('feedback_err_invalid')); return; }

        btn.disabled = true;
        label.textContent = tr('feedback_sending');
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topics, email, message, website, lang: currentLang })
            });
            if (!res.ok) throw new Error('send failed');
            $('fbEmail').value = '';
            $('fbMessage').value = '';
            topicBox.querySelectorAll('.fb-chip').forEach(c => c.classList.remove('on'));
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } catch (err) {
            showError(tr('feedback_err_send'));
        } finally {
            btn.disabled = false;
            label.textContent = tr('feedback_submit');
        }
    });

    // ---------- 7) placeholder ตามภาษา + ผูกกับ changeLang ----------
    function applyPlaceholders() {
        $('fbEmail').placeholder = tr('feedback_email_ph');
        $('fbMessage').placeholder = tr('feedback_message_ph');
    }
    const origChangeLang = changeLang;
    changeLang = function (lang) { origChangeLang(lang); applyPlaceholders(); };
    applyPlaceholders();

    // ---------- 8) แท็บแอดมิน: จัดการอีเมลผู้รับ ----------
    let adminEmails = [];
    const tabs = document.querySelector('#adminDashboard .tabs');
    const contentTab = $('adminTabContent');
    if (tabs && contentTab) {
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab';
        tabBtn.setAttribute('onclick', "showAdminTab('feedback')");
        tabBtn.textContent = '💬 ความคิดเห็น';
        tabs.appendChild(tabBtn);

        const tab = document.createElement('div');
        tab.id = 'adminTabFeedback';
        tab.className = 'admin-section';
        tab.style.display = 'none';
        tab.innerHTML = `
            <h3><i class="fas fa-envelope"></i> อีเมลแอดมินที่รับความคิดเห็น</h3>
            <p style="margin-bottom:15px;">ความคิดเห็นจากลูกค้าจะถูกส่งไปทุกอีเมลในรายการนี้ (ต้องตั้งค่า GitHub ในแท็บแรกก่อน)</p>
            <div id="feedbackEmailsEditor"></div>
            <button class="btn btn-success" id="fbAddEmail"><i class="fas fa-plus"></i> เพิ่มอีเมล</button>
            <button class="btn" id="fbSaveEmails"><i class="fas fa-save"></i> บันทึกอีเมลแอดมิน</button>
            <div id="feedbackAdminStatus" style="margin-top:15px;"></div>`;
        contentTab.after(tab);

        const editor = $('feedbackEmailsEditor');
        const statusEl = $('feedbackAdminStatus');

        function renderEmails() {
            editor.innerHTML = adminEmails.map((em, i) => `
                <div class="fb-email-row">
                    <input type="email" value="${esc(em)}" placeholder="admin@example.com" data-i="${i}">
                    <button class="btn btn-danger" data-del="${i}" aria-label="ลบ"><i class="fas fa-trash"></i></button>
                </div>`).join('') || '<p style="color:#999; margin-bottom:10px;">ยังไม่มีอีเมลแอดมิน กด "เพิ่มอีเมล"</p>';
        }
        editor.addEventListener('input', e => {
            if (e.target.dataset.i !== undefined) adminEmails[+e.target.dataset.i] = e.target.value.trim();
        });
        editor.addEventListener('click', e => {
            const del = e.target.closest('[data-del]');
            if (del) { adminEmails.splice(+del.dataset.del, 1); renderEmails(); }
        });
        $('fbAddEmail').addEventListener('click', () => { adminEmails.push(''); renderEmails(); });

        async function loadEmails() {
            try {
                const r = await fetch('/feedback-config.json?t=' + Date.now(), { cache: 'no-store' });
                const j = r.ok ? await r.json() : {};
                adminEmails = Array.isArray(j.adminEmails) ? j.adminEmails : [];
            } catch (e) { adminEmails = []; }
            renderEmails();
        }

        $('fbSaveEmails').addEventListener('click', async () => {
            const config = JSON.parse(localStorage.getItem('githubConfig') || 'null');
            if (!config || !config.token) { statusEl.innerHTML = '<div class="warning-box">กรุณาตั้งค่า GitHub Token ในแท็บแรกก่อน</div>'; return; }
            const list = [...new Set(adminEmails.map(e => e.trim()).filter(Boolean))];
            const bad = list.find(e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
            if (bad) { statusEl.innerHTML = `<div class="warning-box">อีเมลไม่ถูกต้อง: ${esc(bad)}</div>`; return; }
            if (!list.length) { statusEl.innerHTML = '<div class="warning-box">ต้องมีอย่างน้อย 1 อีเมล</div>'; return; }

            const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/feedback-config.json`;
            const headers = { 'Authorization': `token ${config.token}` };
            statusEl.innerHTML = '<p>กำลังบันทึก...</p>';
            try {
                let sha;
                const cur = await fetch(`${url}?ref=${config.branch}`, { headers });
                if (cur.ok) sha = (await cur.json()).sha;
                const content = btoa(unescape(encodeURIComponent(JSON.stringify({ adminEmails: list }, null, 2))));
                const put = await fetch(url, {
                    method: 'PUT',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Update feedback admin emails', content, sha, branch: config.branch })
                });
                statusEl.innerHTML = put.ok
                    ? '<div class="success-box"><i class="fas fa-check"></i> บันทึกสำเร็จ! มีผลหลัง Cloudflare Deploy ประมาณ 1-2 นาที</div>'
                    : '<div class="warning-box">บันทึกไม่สำเร็จ ตรวจสอบ Token และสิทธิ์ repo</div>';
                if (put.ok) { adminEmails = list; renderEmails(); }
            } catch (e) {
                statusEl.innerHTML = '<div class="warning-box">เกิดข้อผิดพลาด: ' + esc(e.message) + '</div>';
            }
        });

        const origShowAdminTab = showAdminTab;
        showAdminTab = function (name) {
            origShowAdminTab(name);
            if (name === 'feedback') loadEmails();
        };
    }
})();
