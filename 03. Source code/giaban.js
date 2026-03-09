// --- DOM Elements ---
const formModal = document.getElementById('formModal');
const deleteModal = document.getElementById('deleteModal');
const cannotDeleteModal = document.getElementById('cannotDeleteModal');
const modalTitle = document.getElementById('modalTitle');
const btnSave = document.getElementById('btnSave');

// Inputs
const inpMaMG = document.getElementById('inpMaMG');
const inpTenMG = document.getElementById('inpTenMG');

// Toasts
const toastError = document.getElementById('toastError');
const errorText = document.getElementById('errorText');
const toastSuccess = document.getElementById('toastSuccess');
const successText = document.getElementById('successText');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');

let currentAction = '';
let deleteType = ''; // Lưu trạng thái: 'has_products' (có sản phẩm) hoặc 'no_products' (không có sản phẩm)

// --- LOGIC MENU USER ---
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// --- CHỨC NĂNG TÌM KIẾM (Gọi khi nhấn Enter) ---
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    // Mô phỏng hiển thị popup "Không tìm thấy"
    if (searchTerm === 'không tìm thấy') { 
        toastSearchNotFound.style.display = 'flex';
        setTimeout(() => {
            toastSearchNotFound.style.display = 'none';
        }, 800);
    } else {
        console.log(`Đang tìm kiếm mức giá: ${searchTerm}`);
    }
}

// --- CHỨC NĂNG THÊM (Add) ---
function openAddModal() {
    currentAction = 'add';
    modalTitle.innerText = `Thêm mức giá: MG${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    btnSave.innerText = "Lưu";
    
    // Mã mức giá: cho nhập
    inpMaMG.disabled = false;
    inpMaMG.value = `MG${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`; 
    
    // Reset các trường khác
    inpTenMG.disabled = false; inpTenMG.value = "";

    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG LƯU (Chỉ còn Thêm) ---
function handleSaveAction() {
    closeModal('formModal');
    
    // 1. Hiển thị popup lỗi 800ms 
    errorText.innerText = "Có lỗi trong quá trình lưu mức giá. Vui lòng thử lại sau";
    showErrorToast();
    
    // 2. Sau 800ms, ẩn lỗi và hiển thị thành công (Luôn là 'add' vì không còn chức năng 'edit')
    setTimeout(() => {
        hideToast(toastError);
        showSuccessToast('add'); 
    }, 800);
}

// --- CHỨC NĂNG XÓA (Mở Modal) ---
function openDeleteConfirm(maMG, type) {
    currentAction = 'delete';
    deleteType = type; // Lưu trạng thái có sản phẩm hay không
    deleteModal.style.display = 'flex'; 
}

// --- CHỨC NĂNG XÓA (Thực hiện) ---
function handleDeleteAction() {
    closeModal('deleteModal');
    
    // 1. Giả lập lỗi 800ms
    errorText.innerText = "Có lỗi trong quá trình xóa mức giá. Vui lòng thử lại sau";
    showErrorToast();
    
    // 2. Sau 800ms, kiểm tra điều kiện xóa
    setTimeout(() => {
        hideToast(toastError);
        
        if (deleteType === 'has_products') {
            // Mức giá đang được sử dụng -> Hiện popup cảnh báo không thể xóa
            cannotDeleteModal.style.display = 'flex';
        } else {
            // Mức giá không còn được sử dụng -> Hiện popup xóa thành công
            showSuccessToast('delete');
        }
    }, 800);
}

// --- Helpers ---
function showErrorToast() {
    toastError.style.display = 'flex';
}

function showSuccessToast(action) {
    if (action === 'add') successText.innerText = "Thêm mức giá thành công !"; 
    else if (action === 'delete') successText.innerText = "Xóa mức giá thành công !"; 
    
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