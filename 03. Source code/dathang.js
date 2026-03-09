// --- CHỨC NĂNG CHUNG ---
function toggleDropdown() {
    const drop = document.querySelector('.client-dropdown');
    // Đóng user menu nếu đang mở
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.classList.remove('active');
    
    // Toggle client menu
    if(drop) drop.style.display = (drop.style.display === 'flex') ? 'none' : 'flex';
}

function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    // Đóng client menu nếu đang mở
    const clientMenu = document.querySelector('.client-dropdown');
    if (clientMenu) clientMenu.style.display = 'none';

    if(userMenu) userMenu.classList.toggle('active');
}

function toggleCalendar(id) {
    const event = window.event;
    if(event) event.stopPropagation();
    const cal = document.getElementById(id);
    const allCals = document.getElementsByClassName('custom-calendar');
    for(let i=0; i<allCals.length; i++) {
        if(allCals[i].id !== id) allCals[i].style.display = 'none';
    }
    cal.style.display = (cal.style.display === 'block') ? 'none' : 'block';
}

// --- LOGIC TRANG DANH SÁCH (XÓA) ---
function openDetailModal() { document.getElementById('detailModal').style.display = 'flex'; }
function openDeleteConfirm() { document.getElementById('deleteConfirmModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function handleDelete() {
    closeModal('deleteConfirmModal');
    const errorToast = document.getElementById('errorToast');
    const successToast = document.getElementById('successToast');

    if(errorToast) {
        errorToast.style.display = 'flex';
        setTimeout(() => {
            errorToast.style.display = 'none';
            if(successToast) {
                successToast.style.display = 'flex';
                setTimeout(() => {
                    successToast.style.display = 'none';
                    closeModal('detailModal');
                }, 1500);
            }
        }, 800);
    }
}

// --- LOGIC TRANG NHẬP HÀNG (LƯU & VALIDATE) ---
function showSearchSuggestions() {
    const val = document.getElementById('searchInput').value;
    const drop = document.getElementById('searchResult');
    if (drop) drop.style.display = (val.length > 0) ? 'block' : 'none';
}
function hideSearchSuggestions() {
    setTimeout(() => { document.getElementById('searchResult').style.display = 'none'; }, 200);
}

function validateQuantity(input) {
    const val = parseInt(input.value);
    if (isNaN(val) || val <= 0) {
        showValidateError("Số lượng không hợp lệ");
        input.value = ""; input.focus();
    }
}
function validatePrice(input) {
    const rawVal = input.value.replace(/\./g, ""); 
    const val = parseInt(rawVal);
    if (isNaN(val) || val <= 0) {
        showValidateError("Đơn giá không hợp lệ");
        input.value = ""; input.focus();
    }
}

function showValidateError(msg) {
    const toast = document.getElementById('validateToast');
    const text = document.getElementById('validateText');
    if(toast && text) {
        text.innerText = msg;
        toast.style.display = 'flex';
        setTimeout(() => { toast.style.display = 'none'; }, 2000);
    }
}

function handleSave() {
    const errorToast = document.getElementById('errorToast');
    const successToast = document.getElementById('successToast');

    if(errorToast) {
        errorToast.style.display = 'flex';
        setTimeout(() => {
            errorToast.style.display = 'none';
            if(successToast) {
                successToast.style.display = 'flex';
                setTimeout(() => {
                    window.location.href = 'dathang.html';
                }, 1500);
            }
        }, 800);
    }
}

// --- GLOBAL EVENT CLICK ---
window.onclick = function(event) {
    // Đóng lịch
    if (!event.target.closest('.date-box') && !event.target.closest('.date-display')) { 
        const cals = document.getElementsByClassName('custom-calendar');
        for (let i = 0; i < cals.length; i++) cals[i].style.display = 'none';
    }
    // Đóng các Modal
    const detailModal = document.getElementById('detailModal');
    if (event.target == detailModal) detailModal.style.display = "none";
    const confirmModal = document.getElementById('deleteConfirmModal');
    if (event.target == confirmModal) confirmModal.style.display = "none";
    
    // Đóng Dropdown Menu (User & Client)
    if (!event.target.closest('.user-menu')) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.classList.remove('active');
    }
    if (!event.target.closest('.nav-item-dropdown')) {
        const clientDropdown = document.querySelector('.client-dropdown');
        if(clientDropdown) clientDropdown.style.display = 'none';
    }
}