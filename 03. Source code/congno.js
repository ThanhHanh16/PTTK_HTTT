// --- DOM Elements ---
const formModal = document.getElementById('formModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const btnSave = document.getElementById('btnSave');

// Inputs
const inpMaHD = document.getElementById('inpMaHD');
const inpMaKH = document.getElementById('inpMaKH');
const inpTenKH = document.getElementById('inpTenKH');
const inpNgayMua = document.getElementById('inpNgayMua');
const inpHanTra = document.getElementById('inpHanTra');

// Toasts
const toastError = document.getElementById('toastError');
const toastSuccess = document.getElementById('toastSuccess');
const successText = document.getElementById('successText');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');

let currentAction = '';

// --- LOGIC MENU DROPDOWN ---

// 1. Menu User (Đăng xuất)
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    // Đóng client menu nếu đang mở
    const clientMenu = document.querySelector('.nav-item-dropdown');
    if(clientMenu) clientMenu.classList.remove('active');
    
    userMenu.classList.toggle('active');
}

// 2. Menu Khách hàng (QL khách hàng / Công nợ)
function toggleClientMenu(event) {
    // Ngăn chặn hành vi thẻ a (không load lại trang)
    event.preventDefault();
    event.stopPropagation(); // Ngăn sự kiện nổi bọt lên window
    
    // Đóng user menu nếu đang mở
    const userMenu = document.querySelector('.user-menu');
    if(userMenu) userMenu.classList.remove('active');

    const dropdown = document.querySelector('.nav-item-dropdown');
    dropdown.classList.toggle('active');
}

// --- CHỨC NĂNG TÌM KIẾM ---
function handleSearch() {
    toastSearchNotFound.style.display = 'flex';
    setTimeout(() => {
        toastSearchNotFound.style.display = 'none';
    }, 800);
}

// --- CHỨC NĂNG SỬA ---
function openEditModal() {
    currentAction = 'edit';
    modalTitle.innerText = "Sửa công nợ:";
    btnSave.innerText = "Cập nhật";
    btnSave.className = "btn-confirm";
    
    inpMaHD.disabled = true;
    inpMaKH.disabled = true;
    inpTenKH.disabled = true;
    if(inpHanTra) inpHanTra.disabled = true;

    // Fake Data
    inpMaHD.value = "HD0000007";
    inpMaKH.value = "KH0000007";
    inpTenKH.value = "Nguyễn Mai";
    if(inpHanTra) inpHanTra.value = "15/11/2025";

    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG THÊM ---
function openAddModal() {
    currentAction = 'add';
    modalTitle.innerText = "Thêm công nợ:";
    btnSave.innerText = "Lưu";
    
    inpMaHD.disabled = false;
    inpMaKH.disabled = false;
    inpTenKH.disabled = false;
    if(inpHanTra) inpHanTra.disabled = false;
    
    inpMaHD.value = "";
    inpMaKH.value = "";
    inpTenKH.value = "";
    inpNgayMua.value = ""; 
    if(inpHanTra) inpHanTra.value = "";
    
    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG XÓA ---
function openDeleteConfirm() {
    currentAction = 'delete';
    deleteModal.style.display = 'flex';
}

// --- LOGIC LƯU ---
function handleSaveAction() {
    setTimeout(() => {
        showErrorToast();
        setTimeout(() => {
            hideToast(toastError);
            showSuccessToast(currentAction);
            closeModal('formModal');
        }, 2000);
    }, 800);
}

// --- LOGIC XÓA ---
function handleDeleteAction() {
    closeModal('deleteModal');
    setTimeout(() => {
        showErrorToast(); 
        setTimeout(() => {
            hideToast(toastError);
            showSuccessToast('delete');
        }, 2000);
    }, 800);
}

// --- Helpers ---
function showErrorToast(msg) { toastError.style.display = 'flex'; }
function showSuccessToast(action) {
    if (action === 'add') successText.innerText = "Thêm công nợ thành công";
    else if (action === 'edit') successText.innerText = "Cập nhật công nợ thành công";
    else if (action === 'delete') successText.innerText = "Xóa công nợ thành công";
    toastSuccess.style.display = 'flex';
    setTimeout(() => { hideToast(toastSuccess); }, 2000);
}
function hideToast(el) { el.style.display = 'none'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleCalendar(id) {
    const event = window.event;
    if(event) event.stopPropagation();
    const cal = document.getElementById(id);
    cal.style.display = (cal.style.display === 'block') ? 'none' : 'block';
}

// GLOBAL EVENT LISTENER
window.onclick = function(event) {
    // 1. Đóng lịch
    if (!event.target.closest('.input-with-icon') && !event.target.closest('.date-box')) {
        const cals = document.getElementsByClassName('custom-calendar');
        for (let i = 0; i < cals.length; i++) cals[i].style.display = 'none';
    }
    
    // 2. Đóng User Menu
    if (!event.target.closest('.user-menu')) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && userMenu.classList.contains('active')) userMenu.classList.remove('active');
    }

    // 3. Đóng Client Dropdown (Menu Khách hàng)
    // Nếu click ra ngoài .nav-item-dropdown thì đóng
    if (!event.target.closest('.nav-item-dropdown')) {
        const clientDropdown = document.querySelector('.nav-item-dropdown');
        if(clientDropdown && clientDropdown.classList.contains('active')) {
            clientDropdown.classList.remove('active');
        }
    }

    // 4. Đóng Modal
    if (event.target == formModal) closeModal('formModal');
    if (event.target == deleteModal) closeModal('deleteModal');
}