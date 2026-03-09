// --- DOM Elements ---
const formModal = document.getElementById('formModal');
const deleteModal = document.getElementById('deleteModal');
const cannotDeleteModal = document.getElementById('cannotDeleteModal');
const modalTitle = document.getElementById('modalTitle');
const btnSave = document.getElementById('btnSave');

// Inputs
const inpMaDM = document.getElementById('inpMaDM');
const inpTenDM = document.getElementById('inpTenDM');

// Toasts
const toastError = document.getElementById('toastError');
const errorText = document.getElementById('errorText');
const toastSuccess = document.getElementById('toastSuccess');
const successText = document.getElementById('successText');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');

let currentAction = '';
let deleteType = ''; // Lưu trạng thái: 'has_products' hoặc 'no_products'

// --- LOGIC MENU USER ---
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// --- CHỨC NĂNG TÌM KIẾM ---
function handleSearch() {
    toastSearchNotFound.style.display = 'flex';
    setTimeout(() => {
        toastSearchNotFound.style.display = 'none';
    }, 800);
}

// --- CHỨC NĂNG THÊM (Add) ---
function openAddModal() {
    currentAction = 'add';
    modalTitle.innerText = "Thêm danh mục:";
    btnSave.innerText = "Lưu";
    
    // Mã danh mục: cho nhập (màu trắng)
    inpMaDM.disabled = false;
    inpMaDM.value = "DM" + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    
    // Tên danh mục: cho nhập (màu trắng)
    inpTenDM.disabled = false;
    inpTenDM.value = "";
    inpTenDM.placeholder = "Nhập tên danh mục";
    
    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG SỬA (Edit) ---
function openEditModal(maDM, tenDM) {
    currentAction = 'edit';
    modalTitle.innerText = `Sửa danh mục: ${maDM}`;
    btnSave.innerText = "Lưu"; // Sửa dùng nút "Lưu" (giống ảnh 221208.png)
    
    // Mã danh mục: disable (màu xám)
    inpMaDM.disabled = true;
    inpMaDM.value = maDM;
    
    // Tên danh mục: cho nhập (màu trắng)
    inpTenDM.disabled = false;
    inpTenDM.value = tenDM;
    inpTenDM.placeholder = "Nhập tên danh mục";

    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG LƯU (Thêm/Sửa) ---
function handleSaveAction() {
    closeModal('formModal');
    
    // 1. Hiển thị popup lỗi 800ms
    errorText.innerText = "Có lỗi trong quá trình lưu danh mục. Vui lòng thử lại sau";
    showErrorToast(); // Giống ảnh 221148.png
    
    // 2. Sau 800ms, ẩn lỗi và hiển thị thành công (ảnh 221200.png hoặc 221311.png)
    setTimeout(() => {
        hideToast(toastError);
        showSuccessToast(currentAction);
    }, 800);
}

// --- CHỨC NĂNG XÓA (Mở Modal) ---
function openDeleteConfirm(type) {
    deleteType = type; // 'has_products' hoặc 'no_products'
    deleteModal.style.display = 'flex'; // Hiển thị modal xác nhận xóa (ảnh 221321.png)
}

// --- CHỨC NĂNG XÓA (Thực hiện) ---
function handleDeleteAction() {
    closeModal('deleteModal');
    
    // 1. Giả lập lỗi 800ms
    errorText.innerText = "Có lỗi trong quá trình xóa danh mục. Vui lòng thử lại sau";
    showErrorToast();
    
    // 2. Sau 800ms, xử lý kết quả xóa
    setTimeout(() => {
        hideToast(toastError);
        
        if (deleteType === 'has_products') {
            // Danh mục còn hàng hóa -> Hiện popup lỗi "Không thể xóa" (ảnh 221326.png)
            cannotDeleteModal.style.display = 'flex';
        } else {
            // Danh mục không còn hàng hóa -> Hiện popup thành công (ảnh 221615.png)
            showSuccessToast('delete');
        }
    }, 800);
}

// --- Helpers ---
function showErrorToast() {
    toastError.style.display = 'flex';
}

function showSuccessToast(action) {
    if (action === 'add') successText.innerText = "Thêm danh mục thành công !"; // Ảnh 221200.png
    else if (action === 'edit') successText.innerText = "Cập nhật danh mục thành công !"; // Ảnh 221311.png
    else if (action === 'delete') successText.innerText = "Xóa danh mục thành công !"; // Ảnh 221615.png
    
    toastSuccess.style.display = 'flex';
    setTimeout(() => { hideToast(toastSuccess); }, 2000);
}

function hideToast(el) { el.style.display = 'none'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// GLOBAL EVENT LISTENER
window.onclick = function(event) {
    // 1. Đóng User Dropdown
    if (!event.target.closest('.user-menu')) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && userMenu.classList.contains('active')) {
            userMenu.classList.remove('active');
        }
    }

    // 2. Đóng Modal Overlay (Nếu click ra ngoài modal content)
    if (event.target == formModal) closeModal('formModal');
    if (event.target == deleteModal) closeModal('deleteModal');
    if (event.target == cannotDeleteModal) closeModal('cannotDeleteModal');
}

