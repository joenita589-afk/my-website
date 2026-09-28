// Cloudflare Pages Function: POST /api/feedback
// ตัวแปรที่ต้องตั้งใน Cloudflare Pages → Settings → Variables and Secrets
//   RESEND_API_KEY  (จำเป็น)  คีย์จาก resend.com
//   FROM_EMAIL      (ไม่บังคับ) เช่น "Ripley's <feedback@โดเมนของคุณ>"
//   ADMIN_EMAILS    (ไม่บังคับ) สำรอง คั่นด้วยจุลภาค ใช้เมื่อ feedback-config.json ว่าง

const TOPICS = {
    ride: 'เครื่องเล่น',
    staff: 'พนักงาน',
    clean: 'ความสะอาด',
    food: 'อาหารและเครื่องดื่ม',
    price: 'ราคาและบัตรเข้าชม',
    other: 'อื่นๆ'
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
    let body;
    try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

    // honeypot: บอทมักกรอกช่องนี้ ตอบ ok หลอกไว้ แต่ไม่ส่งเมล
    if (body.website) return json({ ok: true });

    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();
    if (!EMAIL_RE.test(email) || email.length > 200 || !message || message.length > 3000) {
        return json({ ok: false, error: 'invalid' }, 400);
    }

    const topics = (Array.isArray(body.topics) ? body.topics : [])
        .filter((k, i, a) => TOPICS[k] && a.indexOf(k) === i);
    if (!topics.length) return json({ ok: false, error: 'invalid_topic' }, 400);
    const topicLabel = topics.map(k => TOPICS[k]).join(', ');

    if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not_configured' }, 500);

    // อ่านรายชื่ออีเมลแอดมินจากไฟล์ที่แก้ผ่านหน้า Admin
    let admins = [];
    try {
        const r = await fetch(new URL('/feedback-config.json', request.url), { cf: { cacheTtl: 0 } });
        if (r.ok) admins = ((await r.json()).adminEmails || []).filter(e => EMAIL_RE.test(e));
    } catch {}
    if (!admins.length && env.ADMIN_EMAILS) {
        admins = env.ADMIN_EMAILS.split(',').map(s => s.trim()).filter(e => EMAIL_RE.test(e));
    }
    if (!admins.length) return json({ ok: false, error: 'no_admin' }, 500);

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: env.FROM_EMAIL || "Ripley's Feedback <onboarding@resend.dev>",
            to: admins,
            reply_to: email,
            subject: `[${topicLabel}] ความคิดเห็นใหม่จากลูกค้า: ${email}`,
            html: `<h3>ความคิดเห็นใหม่จากเว็บไซต์</h3>
                   <p><b>หัวข้อ:</b> ${esc(topicLabel)}</p>
                   <p><b>อีเมลลูกค้า:</b> ${esc(email)}</p>
                   <p><b>ภาษา:</b> ${esc(body.lang || '-')}</p>
                   <p style="white-space:pre-wrap">${esc(message)}</p>
                   <hr><small>กด Reply เพื่อตอบกลับลูกค้าได้ทันที</small>`
        })
    });
    return res.ok ? json({ ok: true }) : json({ ok: false, error: 'send_failed' }, 502);
}
