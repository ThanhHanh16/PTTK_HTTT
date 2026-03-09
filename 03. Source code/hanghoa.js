// --- DOM Elements ---
const productModal = document.getElementById('productModal');
const categoryModal = document.getElementById('categoryModal');
const deleteModal = document.getElementById('deleteModal');

const searchInput = document.querySelector('.filter-bar input[type="text"]');
const productModalTitle = document.getElementById('productModalTitle');
const productSuccessText = document.getElementById('productSuccessText');

// Category Inputs
const inpTenDM = document.getElementById('inpTenDM');

// Toasts
const toastSearchError = document.getElementById('toastSearchError');
const toastSearchNotFound = document.getElementById('toastSearchNotFound');
const toastDuplicateCategory = document.getElementById('toastDuplicateCategory');
const toastSaveCategoryError = document.getElementById('toastSaveCategoryError');
const toastAddCategorySuccess = document.getElementById('toastAddCategorySuccess');
const toastSaveProductError = document.getElementById('toastSaveProductError');
const toastProductSuccess = document.getElementById('toastProductSuccess');
const toastDeleteError = document.getElementById('toastDeleteError');
const toastDeleteSuccess = document.getElementById('toastDeleteSuccess');

let currentAction = ''; // 'add' hoặc 'edit'
let deleteTargetId = ''; // Mã hàng hóa cần xóa

// --- LOGIC MENU USER (COMMON) ---
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// --- LOGIC TÌM KIẾM ---
let searchTimeout;
function handleSearchInput() {
    clearTimeout(searchTimeout);
    
    if (searchInput.value.length > 0) {
        searchTimeout = setTimeout(() => {
            // 1. Hiện lỗi tìm kiếm
            showToast(toastSearchError);
            hideToast(toastSearchError, 1500);

            // 2. Sau khi lỗi 1 ẩn, hiện thông báo không tìm thấy
            setTimeout(() => {
                showToast(toastSearchNotFound);
                hideToast(toastSearchNotFound, 1500);
            }, 1800); 
        }, 800);
    }
}

// --- LOGIC MODAL HÀNG HÓA ---

function openAddModal() {
    currentAction = 'add';
    productModalTitle.innerText = "Thêm hàng hóa: HH0000001"; // Mã giả lập
    document.getElementById('inpMaHH').value = "HH0000001"; 
    document.getElementById('inpTenHH').value = ""; 
    document.getElementById('inpDonVi').value = "";
    document.getElementById('selDanhMuc').value = "";
    
    // Reset image section to 'Thêm ảnh'
    const imageBox = document.getElementById('imageBox');
    imageBox.classList.remove('has-image');
    document.getElementById('imagePlaceholder').style.display = 'block';
    document.getElementById('productImage').style.display = 'none';

    productModal.style.display = 'flex';
}

function openEditModal(maHH) {
    currentAction = 'edit';
    productModalTitle.innerText = 'Sửa hàng hóa: ${maHH}';
    
    // Load Data (Giả lập)
    document.getElementById('inpMaHH').value = maHH;
    document.getElementById('inpTenHH').value = "Nước trái cây Jarritos";
    document.getElementById('inpDonVi').value = "Chai";
    document.getElementById('selDanhMuc').value = "Bánh kẹo"; // Giả sử chọn Bánh kẹo

    // Load Image (Giả lập)
    const imageBox = document.getElementById('imageBox');
    imageBox.classList.add('has-image');
    document.getElementById('imagePlaceholder').style.display = 'none';
    const productImage = document.getElementById('productImage');
    productImage.src = "https://via.placeholder.com/150x150?text=Product+Image";
    productImage.style.display = 'block';
    
    productModal.style.display = 'flex';
}

function handleSaveProductAction() {
    closeModal('productModal'); 
    
    // Giả lập lưu: Lỗi -> Thành công
    setTimeout(() => {
        // 1. Hiện lỗi lưu hàng hóa
        showToast(toastSaveProductError);
        hideToast(toastSaveProductError, 1500);

        // 2. Hiện thông báo thành công
        setTimeout(() => {
            productSuccessText.innerText = (currentAction === 'add') 
                ? "Thêm hàng hóa thành công!" 
                : "Cập nhật hàng hóa thành công!";
            showToast(toastProductSuccess);
            hideToast(toastProductSuccess, 2000);
        }, 1800); 
    }, 500);
}

// Giả lập chức năng remove image
function removeImage() {
    const imageBox = document.getElementById('imageBox');
    imageBox.classList.remove('has-image');
    document.getElementById('imagePlaceholder').style.display = 'block';
    document.getElementById('productImage').style.display = 'none';
}

// --- LOGIC MODAL DANH MỤC ---

function openAddCategoryModal() {
    // Đóng Modal Hàng Hóa và mở Modal Danh Mục
    productModal.style.display = 'none'; 
    
    document.getElementById('inpTenDM').value = "";
    document.getElementById('categoryModalTitle').innerText = (currentAction === 'add') 
        ? "Thêm danh mục: DM0000002" 
        : "Sửa danh mục: DM000000X"; // Giả lập

    categoryModal.style.display = 'flex';
}

function handleCategoryNameInput(value) {
    // Giả lập check trùng tên: Nếu nhập 'Bánh kẹo' (có sẵn) thì hiện lỗi
    if (value.toLowerCase().trim() === 'bánh kẹo') {
        clearTimeout(window.categoryNameTimeout);
        window.categoryNameTimeout = setTimeout(() => {
            showToast(toastDuplicateCategory);
            hideToast(toastDuplicateCategory, 1500);
        }, 500);
    }
}

function handleSaveCategoryAction() {
    closeModal('categoryModal'); 
    
    // Giả lập lưu: Lỗi -> Thành công
    setTimeout(() => {
        // 1. Hiện lỗi lưu danh mục
        showToast(toastSaveCategoryError);
        hideToast(toastSaveCategoryError, 1500);

        // 2. Hiện thông báo thành công
        setTimeout(() => {
            showToast(toastAddCategorySuccess);
            hideToast(toastAddCategorySuccess, 2000);
        }, 1800); 
        
        // 3. Sau khi Toast thành công ẩn, quay lại Modal Hàng Hóa
        setTimeout(() => {
            productModal.style.display = 'flex';
        }, 4000); // 2000ms (lỗi) + 2000ms (thành công)
        
    }, 500);
}


// --- LOGIC XÓA ---

function openDeleteConfirm(maHH) {
    deleteTargetId = maHH;
    deleteModal.style.display = 'flex';
}

function handleDeleteAction() {
    closeModal('deleteModal');
    
    // Giả lập xóa: Lỗi -> Thành công
    setTimeout(() => {
        // 1. Hiện lỗi xóa
        showToast(toastDeleteError);
        hideToast(toastDeleteError, 1500); 
        
        // 2. Hiện thông báo thành công
        setTimeout(() => {
            showToast(toastDeleteSuccess);
            hideToast(toastDeleteSuccess, 2000);
        }, 1800); 
    }, 500);
}

// --- Helpers ---
function showToast(el) { el.style.display = 'flex'; }
function hideToast(el, duration = 2000) { 
    setTimeout(() => { el.style.display = 'none'; }, duration);
}

function closeModal(id) { 
    document.getElementById(id).style.display = 'none'; 
    // Nếu đóng modal danh mục, quay lại modal hàng hóa
    if (id === 'categoryModal' && productModal.style.display !== 'flex') {
         // Nếu đang từ luồng Thêm/Sửa hàng hóa mà đóng Hủy Danh mục
         if (productModal.style.display === 'none') {
             productModal.style.display = 'flex';
         }
    }
}

// --- GLOBAL EVENT LISTENER (Đóng Modal khi click ra ngoài & Đóng User Dropdown) ---
window.onclick = function(event) {
    // 1. Đóng Modal Hàng Hóa
    if (event.target == productModal) closeModal('productModal');
    // 2. Đóng Modal Danh Mục
    if (event.target == categoryModal) closeModal('categoryModal');
    // 3. Đóng Modal Xóa
    if (event.target == deleteModal) closeModal('deleteModal');
    
    // 4. Đóng User Dropdown
    if (!event.target.closest('.user-menu')) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && userMenu.classList.contains('active')) {
            userMenu.classList.remove('active');
        }
    }
}

// Logic giả lập cho Dropdown (không cần thư viện JS ngoài)
function toggleDropdown(isFocus) {
    // Không cần thêm logic mở/đóng phức tạp vì đã dùng thẻ <select> native
    // Logic này chỉ để xử lý nếu dùng thẻ div/input giả lập dropdown.
    // Nếu dùng <select>, nó đã tự xử lý.
}