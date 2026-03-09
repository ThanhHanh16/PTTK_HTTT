// --- DOM Elements ---
const formModal = document.getElementById('formModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const btnSave = document.getElementById('btnSave');

// Inputs
const inpMaNCC = document.getElementById('inpMaNCC');
const inpTenNCC = document.getElementById('inpTenNCC');
const inpSDT = document.getElementById('inpSDT');
const inpDiaChi = document.getElementById('inpDiaChi');
const inpSTK = document.getElementById('inpSTK');

// Toasts
const toastError = document.getElementById('toastError');
const errorText = document.getElementById('errorText');
const toastSuccess = document.getElementById('toastSuccess');
const successText = document.getElementById('successText');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');

let currentAction = '';

// --- LOGIC MENU USER ---
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// --- CHỨC NĂNG TÌM KIẾM (Được gọi khi nhấn Enter trong ô input) ---
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    // Logic tìm kiếm thực tế sẽ diễn ra ở đây.
    // Dưới đây là mô phỏng hiển thị popup "Không tìm thấy"
    if (searchTerm === 'không tìm thấy') { 
        toastSearchNotFound.style.display = 'flex';
        setTimeout(() => {
            toastSearchNotFound.style.display = 'none';
        }, 800);
    } else {
        // Mô phỏng tìm thấy (chỉ cần không làm gì hoặc load lại bảng)
        console.log(`Đang tìm kiếm nhà cung cấp: ${searchTerm}`);
    }
}

// --- CHỨC NĂNG THÊM (Add) ---
function openAddModal() {
    currentAction = 'add';
    modalTitle.innerText = `Thêm nhà cung cấp: NCC${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
    btnSave.innerText = "Lưu";
    
    // Mã NCC: cho nhập (màu trắng)
    inpMaNCC.disabled = false;
    inpMaNCC.value = `NCC${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`; // Default value
    
    // Reset các trường khác
    inpTenNCC.disabled = false; inpTenNCC.value = "";
    inpSDT.disabled = false; inpSDT.value = "";
    inpDiaChi.disabled = false; inpDiaChi.value = "";
    inpSTK.disabled = false; inpSTK.value = "";

    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG SỬA (Edit) ---
function openEditModal(maNCC, tenNCC, sdt, diaChi, stk) {
    currentAction = 'edit';
    modalTitle.innerText = `Sửa nhà cung cấp: ${maNCC}`;
    btnSave.innerText = "Lưu";
    
    // Mã NCC: disable (màu xám)
    inpMaNCC.disabled = true;
    inpMaNCC.value = maNCC;
    
    // Các trường khác: cho nhập (màu trắng)
    inpTenNCC.disabled = false; inpTenNCC.value = tenNCC;
    inpSDT.disabled = false; inpSDT.value = sdt;
    inpDiaChi.disabled = false; inpDiaChi.value = diaChi;
    inpSTK.disabled = false; inpSTK.value = stk;

    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG LƯU (Thêm/Sửa) ---
function handleSaveAction() {
    closeModal('formModal');
    
    // 1. Hiển thị popup lỗi 800ms 
    errorText.innerText = "Có lỗi trong quá trình lưu nhà cung cấp. Vui lòng thử lại sau";
    showErrorToast();
    
    // 2. Sau 800ms, ẩn lỗi và hiển thị thành công
    setTimeout(() => {
        hideToast(toastError);
        showSuccessToast(currentAction);
    }, 800);
}

// --- CHỨC NĂNG XÓA (Mở Modal) ---
function openDeleteConfirm() {
    currentAction = 'delete';
    deleteModal.style.display = 'flex'; 
}

// --- CHỨC NĂNG XÓA (Thực hiện) ---
function handleDeleteAction() {
    closeModal('deleteModal');
    
    // 1. Giả lập lỗi 800ms
    errorText.innerText = "Có lỗi trong quá trình xóa nhà cung cấp. Vui lòng thử lại sau";
    showErrorToast();
    
    // 2. Sau 800ms, hiện popup thành công
    setTimeout(() => {
        hideToast(toastError);
        showSuccessToast('delete');
    }, 800);
}

// --- Helpers ---
function showErrorToast() {
    toastError.style.display = 'flex';
}

function showSuccessToast(action) {
    if (action === 'add') successText.innerText = "Thêm nhà cung cấp thành công";
    else if (action === 'edit') successText.innerText = "Cập nhật nhà cung cấp thành công";
    else if (action === 'delete') successText.innerText = "Xóa nhà cung cấp thành công !";
    
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
}