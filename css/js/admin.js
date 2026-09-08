// เพิ่มฟังก์ชันเหล่านี้ต่อจากไฟล์ admin.js เดิม

let currentMenuImage = null;
let currentCouponData = { activities: [] };
let currentMenuData = [];

// ตรวจสอบ Login
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
    loadAttractionEditors();
    loadCouponData();
    loadMenuData();
});

function showTab(tabName) {
    // ซ่อนทุก section
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // แสดง tab ที่เลือก
    if (tabName === 'attractions') {
        document.querySelector('.attraction-editor').style.display = 'block';
    } else if (tabName === 'coupons') {
        document.getElementById('couponTab').style.display = 'block';
    } else if (tabName === 'menu') {
        document.getElementById('menuTab').style.display = 'block';
    }
}

function logout() {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('loginTime');
        window.location.href = 'login.html';
    }
}

// ฟังก์ชันจัดการคูปอง
function addCouponActivity() {
    const name = document.getElementById('couponActivityName').value;
    const discount = document.getElementById('couponDiscount').value;
    const icon = document.getElementById('couponIcon').value;
    
    if (!name || !discount) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    currentCouponData.activities.push({
        name,
        discount: discount + '%',
        icon
    });
    
    localStorage.setItem('couponData', JSON.stringify(currentCouponData));
    loadCouponData();
    
    // ล้างฟอร์ม
    document.getElementById('couponActivityName').value = '';
    document.getElementById('couponDiscount').value = '';
}

function loadCouponData() {
    const saved = localStorage.getItem('couponData');
    if (saved) {
        currentCouponData = JSON.parse(saved);
    }
    
    const container = document.getElementById('couponList');
    if (!container) return;
    
    container.innerHTML = '<h3>กิจกรรมที่มีคูปอง</h3>' + 
        currentCouponData.activities.map((act, index) => `
        <div class="attraction-editor">
            <h4>${act.name} - ลด ${act.discount}</h4>
            <button class="btn btn-danger" onclick="deleteCouponActivity(${index})">
                <i class="fas fa-trash"></i> ลบ
            </button>
        </div>
    `).join('');
}

function deleteCouponActivity(index) {
    if (confirm('ต้องการลบกิจกรรมนี้?')) {
        currentCouponData.activities.splice(index, 1);
        localStorage.setItem('couponData', JSON.stringify(currentCouponData));
        loadCouponData();
    }
}

// ฟังก์ชันจัดการเมนู
function previewMenuImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentMenuImage = e.target.result;
            document.getElementById('menuImagePreview').innerHTML = 
                `<img src="${e.target.result}" style="max-width: 200px; margin: 10px 0; border-radius: 5px;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addMenuItem() {
    const name = document.getElementById('menuItemName').value;
    const price = document.getElementById('menuPrice').value;
    const location = document.getElementById('menuLocation').value;
    const description = document.getElementById('menuDescription').value;
    
    if (!name || !price) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    const locationNames = {
        scream: 'Scream',
        haunted: 'บ้านผีสิง',
        hospital: 'โรงพยาบาล',
        pyramid: 'พีระมิด'
    };
    
    currentMenuData.push({
        name,
        price: parseInt(price),
        location,
        locationName: locationNames[location],
        description,
        image: currentMenuImage || null
    });
    
    localStorage.setItem('menuData', JSON.stringify(currentMenuData));
    loadMenuData();
    
    // ล้างฟอร์ม
    document.getElementById('menuItemName').value = '';
    document.getElementById('menuPrice').value = '';
    document.getElementById('menuDescription').value = '';
    document.getElementById('menuImage').value = '';
    document.getElementById('menuImagePreview').innerHTML = '';
    currentMenuImage = null;
}

function loadMenuData() {
    const saved = localStorage.getItem('menuData');
    if (saved) {
        currentMenuData = JSON.parse(saved);
    }
    
    const container = document.getElementById('menuList');
    if (!container) return;
    
    container.innerHTML = '<h3>เมนูทั้งหมด</h3>' + 
        currentMenuData.map((item, index) => `
        <div class="attraction-editor">
            <h4>${item.name} - ${item.price} บาท</h4>
            <p>สถานที่: ${item.locationName}</p>
            ${item.image ? `<img src="${item.image}" style="max-width: 150px; margin: 10px 0;">` : ''}
            <button class="btn btn-danger" onclick="deleteMenuItem(${index})">
                <i class="fas fa-trash"></i> ลบ
            </button>
        </div>
    `).join('');
}

function deleteMenuItem(index) {
    if (confirm('ต้องการลบเมนูนี้?')) {
        currentMenuData.splice(index, 1);
        localStorage.setItem('menuData', JSON.stringify(currentMenuData));
        loadMenuData();
    }
}

function saveAllChanges() {
    localStorage.setItem('ripleys_data', JSON.stringify(currentData));
    localStorage.setItem('couponData', JSON.stringify(currentCouponData));
    localStorage.setItem('menuData', JSON.stringify(currentMenuData));
    
    alert('บันทึกการเปลี่ยนแปลงสำเร็จ!');
}
