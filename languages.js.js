const translations = {
    th: {
        tagline: "ความมหัศจรรย์ที่คุณต้องเชื่อ!",
        attractions: [
            { id: 1, title: "พิพิธภัณฑ์ เชื่อหรือไม่!", subtitle: "ความจริงที่ต้องพิสูจน์ด้วยตาคุณเอง", description: "พิพิธภัณฑ์ ริบลีส์ เชื่อหรือไม่! หนึ่งในพิพิธภัณฑ์ที่มีชื่อเสียงของโลกต้นกำเนิดจากประเทศสหรัฐอเมริกา รวบรวมความมหัศจรรย์จากทั่วทุกมุมโลก ทั้งความลี้ลับพิสดารและความงดงาม พบของจริงกว่า 350 ประเภท เช่น หน้ากากหนังมนุษย์ หัวคนย่อส่วน เรือจำลองไททานิคจากไม้ขีดไฟกว่า 1,000,000 ก้าน และอื่นๆ อีกมากมาย", icon: "fa-museum", color: "#8B4513" },
            { id: 2, title: "สวนสนุกสุดสยอง", subtitle: "Scream in the Dark", description: "เครื่องเล่นใหม่ล่าสุดของ Ripley World Pattaya เครื่องเล่นสุดมันส์อันดับ 6 สำหรับคนรักความท้าทายแบบสยองขวัญ สวนสนุกที่ปิดตัวลงอย่างลึกลับ มีตำนานวิญญาณตัวตลกและเสียงกรีดร้องในความมืด ทางเดียวที่จะรอดพ้นออกมาได้คือความแม่นยำในการยิงปืนของคุณ", icon: "fa-ghost", color: "#4B0082" },
            { id: 3, title: "โกดังผีสิง", subtitle: "เมื่อฝันร้ายมาเยือน", description: "โกดังเก็บโลงศพที่ใหญ่ที่สุดในจำนวน 5 แห่งในโลก ที่มีตำนานอันน่ากลัวมากว่า 80 ปี พบกับภูตผีปีศาจและแขกไม่ได้รับเชิญจากอีกภพ พร้อมเอฟเฟกต์พิเศษและเทคนิคอันทันสมัยจากอเมริกา ในแต่ละห้องกว่า 20 ห้องที่แฝงไว้ด้วยความสยอง คำเตือน: ไม่เหมาะสำหรับคนขวัญอ่อน", icon: "fa-warehouse", color: "#2F4F4F" },
            { id: 4, title: "พิพิธภัณฑ์หุ่นขี้ผึ้ง หลุยส์ ทุสโซด์ส", subtitle: "ความอัศจรรย์ที่คุณต้องตะลึง", description: "สาขาที่ 5 ของโลกและครั้งแรกในประเทศไทย จัดแสดงหุ่นขี้ผึ้งเสมือนจริงของบุคคลสำคัญและคนดังระดับโลกทั้งไทยและเทศมากกว่า 84 ตัว แบ่งเป็น 9 โซน เช่น SPORT, POP STAR, BRITISH ROYALTY, HORROR DEN, BATMAN AND FRIENDS ฯลฯ พร้อมลูกเล่นเรื่องกลิ่น แสง และเสียงที่สมจริง", icon: "fa-user", color: "#DAA520" },
            { id: 5, title: "มหัศจรรย์เขาวงกต", subtitle: "เปิดโลกแห่งจินตนาการ", description: "ที่สุดของความบันเทิงที่ต้องพิสูจน์ด้วยสายตา ตลอด 20 นาทีของการเดินทางใน 'อินฟินนิตี้' (Infinity) เพลิดเพลินกับแว่นสุดพิเศษที่จะพาคุณไปพบกับความอัศจรรย์ของแสง-สี-เสียง และเอฟเฟกต์พิเศษถึง 16 ห้อง ในมิติพิศวงที่ไม่มีจุดเริ่มต้นและสิ้นสุด", icon: "fa-project-diagram", color: "#FF6347" },
            { id: 6, title: "เกมส์ตะลุยเลเซอร์", subtitle: "Mission Impossible", description: "เกมส์ที่ทำให้คุณต้องสวมวิญญาณนักจารกรรมเหมือนในภาพยนตร์ เข้าสู่ห้องปฏิบัติภารกิจลึกลับ ด่านเขาวงกตลำแสงเลเซอร์สีเขียว คุณต้องผ่านไปได้ไวที่สุดโดยไม่แตะต้องลำแสง หากสัมผัส เวลาจะเพิ่มขึ้นและภารกิจอาจไม่สำเร็จ!", icon: "fa-bullseye", color: "#00CED1" },
            { id: 7, title: "โรงพยาบาลหลอน", subtitle: "The Horror Hospital", description: "ณ เมืองห่างไกลทางตอนใต้ของอังกฤษ โรงพยาบาลที่ผู้ป่วยเข้าไปแล้วไม่มีวี่แววจะได้กลับออกมา รอคอยผู้กล้ามาท้าทายความลี้ลับสยดสยอง พร้อมปลุกเหล่าวิญญาณและภูติผีให้ตื่นขึ้น ขอเตือนก่อนว่าที่นี่ไม่เหมาะกับคนขวัญอ่อน", icon: "fa-hospital", color: "#8B0000" },
            { id: 8, title: "พีระมิดที่สาบสูญ", subtitle: "Lost Pyramid", description: "Attraction ใหม่ในรูปแบบ Edutainment ยกความลึกลับมาจากอียิปต์เมื่อกว่า 4,700 ปีที่แล้ว ดินแดนของกษัตริย์ฟาโรห์ที่กล่าวขานถึงความลึกลับ สวยงาม และยิ่งใหญ่ พร้อมให้เหล่านักผจญภัยเข้าไปร่วมค้นหาสมบัติและพีระมิดสีดำที่สาบสูญ", icon: "fa-monument", color: "#D2691E" },
            { id: 9, title: "เกมอินเตอร์แอคทีฟสุดล้ำ", subtitle: "Interactive Gaming", description: "เกมที่จะทำให้คุณต้องขยับ สนุก และตื่นเต้นทุกวินาที รวมการเคลื่อนไหวเข้ากับภาพกราฟิกสุดมันส์ เล่นได้ทั้งเดี่ยวและเป็นทีม ประสบการณ์ใหม่ที่ผสมเกม การออกกำลังกาย และความคิดสร้างสรรค์ไว้ในที่เดียว", icon: "fa-gamepad", color: "#9370DB" },
            { id: 10, title: "หนีตายสวนสยอง", subtitle: "Escape the Haunted Garden", description: "ปี ค.ศ. 1945 ท่ามกลางสงครามโลกครั้งที่สอง โรงพยาบาลและสวนสาธารณะที่เต็มไปด้วยความสุขพังทลายลงจากเสียงระเบิด ผู้คนสูญหาย เหลือเพียงเสียงร้องขอความช่วยเหลือที่เลือนหายไปในความมืด ว่ากันว่าพวกเขายังคงวนเวียนรอคอยอยู่ที่นี่...", icon: "fa-skull", color: "#556B2F" }
        ]
    },
    en: {
        tagline: "Believe It or Not!",
        attractions: [
            { id: 1, title: "Believe It or Not! Museum", subtitle: "Truth you must see with your own eyes", description: "Ripley's Believe It or Not! One of the world's most famous museums originating from the USA. Discover over 350 types of bizarre and amazing artifacts, including a human skin mask, a shrunken head, and a Titanic model made of over 1,000,000 matchsticks.", icon: "fa-museum", color: "#8B4513" },
            { id: 2, title: "Scream in the Dark", subtitle: "The Ultimate Thrill Ride", description: "The newest and 6th extreme ride at Ripley World Pattaya. A legendary abandoned amusement park haunted by clown spirits and midnight screams. Your only way out is your sharpshooting skills.", icon: "fa-ghost", color: "#4B0082" },
            { id: 3, title: "Haunted Warehouse", subtitle: "When Nightmares Come True", description: "One of the 5 largest coffin warehouses in the world with an 80-year-old terrifying legend. Face ghosts and supernatural effects across 20+ rooms. Warning: Not for the faint of heart.", icon: "fa-warehouse", color: "#2F4F4F" },
            { id: 4, title: "Louis Tussaud's Waxworks", subtitle: "Astonishingly Real", description: "The 5th branch in the world and first in Thailand. Features over 84 lifelike wax figures of global and Thai celebrities across 9 zones, complete with realistic scents, lighting, and sound effects.", icon: "fa-user", color: "#DAA520" },
            { id: 5, title: "Infinity Maze", subtitle: "Open Your Imagination", description: "20 minutes of pure entertainment in the 'Infinity' maze. Use special glasses to experience light, sound, and special effects across 16 rooms in a mind-bending universe with no beginning or end.", icon: "fa-project-diagram", color: "#FF6347" },
            { id: 6, title: "Laser Mission", subtitle: "Be a Secret Agent", description: "Step into a secret agent's shoes. Navigate a labyrinth of green laser beams as fast as possible without touching them. Breaking a beam adds time to your mission!", icon: "fa-bullseye", color: "#00CED1" },
            { id: 7, title: "The Horror Hospital", subtitle: "Face Your Fears", description: "A remote hospital in southern England where patients mysteriously disappeared. Face the chilling spirits and ghosts that still linger. Warning: Not for the faint of heart.", icon: "fa-hospital", color: "#8B0000" },
            { id: 8, title: "Lost Pyramid", subtitle: "Ancient Mysteries", description: "A new Edutainment attraction bringing the mysteries of 4,700-year-old Egypt to life. Join the adventure to find hidden treasures and the legendary lost Black Pyramid.", icon: "fa-monument", color: "#D2691E" },
            { id: 9, title: "Interactive Games", subtitle: "Move and Play", description: "Cutting-edge interactive games that keep you moving and excited every second. Combines motion, graphics, exercise, and creativity for solo or team play.", icon: "fa-gamepad", color: "#9370DB" },
            { id: 10, title: "Escape the Haunted Garden", subtitle: "WWII Nightmare", description: "In 1945, a peaceful hospital and garden were destroyed by bombs. The voices of the lost still echo in the darkness. Legend says they are still waiting here...", icon: "fa-skull", color: "#556B2F" }
        ]
    },
    zh: { tagline: "信不信由你！", attractions: [] }, // (ย่อเพื่อประหยัดพื้นที่ คุณสามารถเติมภาษาอื่นตามรูปแบบเดียวกันได้)
    ru: { tagline: "Хотите — верьте, хотите — нет!", attractions: [] },
    hi: { tagline: "विश्वास करो या नहीं!", attractions: [] },
    he: { tagline: "תאמינו או לא!", attractions: [] },
    ja: { tagline: "信じられない!", attractions: [] },
    ko: { tagline: "믿거나 말거나!", attractions: [] },
    ar: { tagline: "صدق أو لا تصدق!", attractions: [] }
};

let currentLang = 'th';

function changeLanguage(lang) {
    currentLang = lang;
    const data = translations[lang];
    
    // อัปเดต Tagline
    const taglineEl = document.querySelector('.tagline');
    if (taglineEl) taglineEl.textContent = data.tagline;
    
    // อัปเดต Attractions
    if (data.attractions && data.attractions.length > 0) {
        renderAttractions(data.attractions);
    } else {
        // Fallback ถ้ายังไม่มีข้อมูลภาษานั้น ให้ใช้ภาษาอังกฤษแทน
        renderAttractions(translations.en.attractions);
    }
    
    // บันทึกการตั้งค่าภาษา
    localStorage.setItem('preferredLanguage', lang);
    
    // อัปเดตค่าใน Dropdown
    const select = document.getElementById('languageSelect');
    if (select) select.value = lang;

    // จัดการทิศทางข้อความ (RTL) สำหรับภาษาอาหรับและฮีบรู
    if (lang === 'ar' || lang === 'he') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

function renderAttractions(attractions) {
    const container = document.getElementById('attractions');
    if (!container) return;
    
    container.innerHTML = attractions.map(attr => `
        <div class="attraction-card" style="border-top-color: ${attr.color}">
            <div class="attraction-icon" style="background: ${attr.color}">
                <i class="fas ${attr.icon}"></i>
            </div>
            <h2>${attr.title}</h2>
            ${attr.subtitle ? `<h3>${attr.subtitle}</h3>` : ''}
            <p>${attr.description}</p>
        </div>
    `).join('');
}

// เริ่มต้นทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'th';
    changeLanguage(savedLang);
});