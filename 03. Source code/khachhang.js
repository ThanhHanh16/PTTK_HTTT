// --- DOM Elements ---
const formModal = document.getElementById('formModal');
const deleteModal = document.getElementById('deleteModal');
const cannotDeleteModal = document.getElementById('cannotDeleteModal');
const modalTitle = document.getElementById('modalTitle');
const btnSave = document.getElementById('btnSave');

// Inputs
const inpMaKH = document.getElementById('inpMaKH');
const inpTenKH = document.getElementById('inpTenKH');
const inpSDT = document.getElementById('inpSDT');
const inpDiaChi = document.getElementById('inpDiaChi');
const inpTrangThaiNo = document.getElementById('inpTrangThaiNo');

// Toasts
const toastError = document.getElementById('toastError');
const errorText = document.getElementById('errorText');
const toastSuccess = document.getElementById('toastSuccess');
const successText = document.getElementById('successText');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');

let currentAction = '';
let customerStatus = ''; // Lưu trạng thái nợ của khách hàng đang được chọn (để kiểm tra xóa)

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

// --- CHỨC NĂNG THÊM ---
function openAddModal() {
    currentAction = 'add';
    modalTitle.innerText = "Thêm khách hàng:";
    btnSave.innerText = "Lưu";
    
    // Cho phép nhập tất cả các trường
    inpMaKH.disabled = false;
    inpTenKH.disabled = false;
    inpSDT.disabled = false;
    inpDiaChi.disabled = false;
    inpTrangThaiNo.disabled = true; // Trạng thái nợ luôn disable
    
    // Xóa dữ liệu cũ
    inpMaKH.value = "KH" + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'); // Tạo mã ngẫu nhiên
    inpTenKH.value = "";
    inpSDT.value = "";
    inpDiaChi.value = "";
    inpTrangThaiNo.value = "Đã trả"; 
    
    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG SỬA ---
function openEditModal(maKH, tenKH, sdt, diaChi, trangThaiNo) {
    currentAction = 'edit';
    modalTitle.innerText = `Sửa khách hàng: ${maKH}`;
    btnSave.innerText = "Cập nhật";
    
    // Disable Mã KH và Trạng thái nợ
    inpMaKH.disabled = true;
    inpTrangThaiNo.disabled = true; 
    
    // Cho phép nhập Tên KH, SĐT, Địa chỉ
    inpTenKH.disabled = false;
    inpSDT.disabled = false;
    inpDiaChi.disabled = false;

    // Đổ dữ liệu vào form
    inpMaKH.value = maKH;
    inpTenKH.value = tenKH;
    inpSDT.value = sdt;
    inpDiaChi.value = diaChi;
    inpTrangThaiNo.value = trangThaiNo;

    formModal.style.display = 'flex';
}

// --- CHỨC NĂNG LƯU (Thêm/Sửa) ---
function handleSaveAction() {
    // 1. Giả lập cảnh báo/lỗi (cho cả Thêm và Sửa)
    errorText.innerText = "Có lỗi trong quá trình lưu khách hàng. Vui lòng thử lại sau";
    showErrorToast();
    closeModal('formModal');
    
    // 2. Sau 800ms, ẩn lỗi và hiển thị thành công
    setTimeout(() => {
        hideToast(toastError);
        showSuccessToast(currentAction);
    }, 800);
}

// --- CHỨC NĂNG XÓA (Mở Modal) ---
function openDeleteConfirm(status) {
    customerStatus = status; // Lưu trạng thái nợ
    if (customerStatus === 'Chưa trả') {
        // Khách hàng còn nợ -> mở modal lỗi không cho xóa (ảnh 214107)
        setTimeout(() => {
            errorText.innerText = "Khách hàng còn nợ không thể xóa";
            showErrorToast(); // Giả lập popup lỗi 800ms
            setTimeout(() => {
                hideToast(toastError);
                cannotDeleteModal.style.display = 'flex';
            }, 800);
        }, 50);
        
    } else {
        // Khách hàng đã trả nợ -> mở modal xác nhận xóa (ảnh 214057)
        deleteModal.style.display = 'flex';
    }
}

// --- CHỨC NĂNG XÓA (Thực hiện) ---
function handleDeleteAction() {
    closeModal('deleteModal');
    
    // 1. Giả lập lỗi (ảnh 213237)
    errorText.innerText = "Có lỗi trong quá trình xóa khách hàng. Vui lòng thử lại sau";
    showErrorToast();
    
    // 2. Sau 800ms, ẩn lỗi và hiển thị thành công (ảnh 213316)
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
    if (action === 'add') successText.innerText = "Thêm khách hàng thành công!";
    else if (action === 'edit') successText.innerText = "Cập nhật khách hàng thành công!";
    else if (action === 'delete') successText.innerText = "Xóa khách hàng thành công!";
    
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