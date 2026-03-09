// --- DOM Elements ---
const editModal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const inpNgaySanXuat = document.getElementById('inpNgaySanXuat');
const inpHanSuDung = document.getElementById('inpHanSuDung');
const searchInput = document.querySelector('.filter-bar input[type="text"]');

// Toasts
const toastSearchError = document.getElementById('toastSearchError');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');
const toastSaveError = document.getElementById('toastSaveError');
const toastSuccess = document.getElementById('toastSuccess');

// Validation Toasts
// const toastNSXError = document.getElementById('toastNSXError');
// const toastHSDError = document.getElementById('toastHSDError');

// --- LOGIC MENU USER (COMMON) ---
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// --- CHỨC NĂNG TÌM KIẾM (Theo yêu cầu) ---
let searchTimeout;
function handleSearchInput() {
    clearTimeout(searchTimeout);
    
    // Nếu có nhập liệu, bắt đầu quy trình lỗi/không tìm thấy
    if (searchInput.value.length > 0) {
        // 1. Hiện lỗi tìm kiếm (Có lỗi trong quá trình tìm kiếm!)
        searchTimeout = setTimeout(() => {
            showToast(toastSearchError);
            hideToast(toastSearchError, 1500);

            // 2. Sau khi lỗi 1 ẩn, hiện thông báo không tìm thấy
            setTimeout(() => {
                showToast(toastSearchNotFound);
                hideToast(toastSearchNotFound, 1500);
            }, 1800); // Đợi 1.5s (lỗi 1 ẩn) + 0.3s (khoảng cách)
        }, 800);
    }
}

// --- CHỨC NĂNG SỬA ---
function openEditModal(maLoHang) {
    modalTitle.innerText = 'Sửa lô hàng: ${maLoHang}';
    // Khôi phục giá trị (giả lập)
    document.getElementById('inpTenHang').value = "Sữa tươi Vinamilk";
    inpNgaySanXuat.value = ""; 
    inpHanSuDung.value = "";
    document.getElementById('inpNguongHSD').value = 10;
    document.getElementById('inpNguongTon').value = 20;

    editModal.style.display = 'flex';
}

// --- LOGIC LƯU (Theo yêu cầu) ---
function handleSaveAction() {
    closeModal('editModal'); // Đóng Modal trước khi hiện Toast
    
    // Giả lập quy trình lưu: Lỗi -> Thành công
    setTimeout(() => {
        // 1. Hiện lỗi lưu (Có lỗi trong quá trình lưu lô hàng.)
        showToast(toastSaveError);
        hideToast(toastSaveError, 1500);

        // 2. Sau khi lỗi 1 ẩn, hiện thông báo thành công
        setTimeout(() => {
            showToast(toastSuccess);
            hideToast(toastSuccess, 2000);
        }, 1800); 
    }, 500);
}

// --- LOGIC VALIDATION NGÀY (Theo yêu cầu) ---
// function handleDateFocus(type) {
//     // Giả lập logic khi focus vào input type="date"
//     const toastToShow = (type === 'nsx') ? toastNSXError : toastHSDError;
    
//     // Hiện toast lỗi 
//     setTimeout(() => {
//         showToast(toastToShow);
//         hideToast(toastToShow, 1500);
//     }, 100); 
// }


// --- Helpers ---
function showToast(el) { el.style.display = 'flex'; }
function hideToast(el, duration = 2000) { 
    setTimeout(() => { el.style.display = 'none'; }, duration);
}
function closeModal(id) { 
    document.getElementById(id).style.display = 'none'; 
}

// GLOBAL EVENT LISTENER (Đóng Modal khi click ra ngoài & Đóng User Dropdown)
window.onclick = function(event) {
    // 1. Đóng Modal Sửa
    if (event.target == editModal) closeModal('editModal');
    
    // 2. Đóng User Dropdown
    if (!event.target.closest('.user-menu')) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && userMenu.classList.contains('active')) {
            userMenu.classList.remove('active');
        }
    }
}