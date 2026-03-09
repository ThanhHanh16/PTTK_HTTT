// Dữ liệu mẫu (Giữ nguyên)
let bills = [
    { id: 'HD0000001', name: 'Sùng Văn A', date: '20/10/2025 10:04', total: '360,000đ', method: 'Tiền mặt', items: [{code:'HH001', name:'Bột giặt Omo', qty:2, price:'100.000', total:'200.000'}, {code:'HH002', name:'Bánh mì', qty:10, price:'5.000', total:'50.000'}, {code:'HH003', name:'Sữa tươi', qty:1, price:'110.000', total:'110.000'}] },
    { id: 'HD0000002', name: 'Khách lẻ', date: '20/10/2025 10:20', total: '340,000đ', method: 'Chuyển khoản', items: [] },
    { id: 'HD0000003', name: 'Nguyễn Văn B', date: '20/10/2025 10:20', total: '35,000đ', method: 'Chuyển khoản', items: [] },
    { id: 'HD0000004', name: 'Khách lẻ', date: '20/10/2025 10:20', total: '35,000đ', method: 'Tiền mặt', items: [] },
    { id: 'HD0000005', name: 'Khách lẻ', date: '20/10/2025 10:30', total: '35,000đ', method: 'Tiền mặt', items: [] },
    { id: 'HD0000006', name: 'Khách lẻ', date: '20/10/2025 10:40', total: '35,000đ', method: 'Tiền mặt', items: [] }
];
let deleteId = null;

// Hàm mới: Bật tắt Dropdown của User Menu (Giữ nguyên)
function toggleUserDropdown(element) {
    element.classList.toggle('active');
    document.getElementById('userDropdown').classList.toggle('show');
}

// Init (Giữ nguyên)
document.addEventListener('DOMContentLoaded', () => {
    renderTable(bills);
    
    // Click outside handler (đóng dropdown và modal khi click ra ngoài)
    window.onclick = (e) => {
        const userMenu = document.querySelector('.user-menu');
        // Đóng User Dropdown
        if (!e.target.closest('.user-menu')) {
            if (userMenu) userMenu.classList.remove('active');
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) dropdown.classList.remove('show');
        }
        // Đóng Modal khi click ra ngoài vùng modal-content
        if (e.target.classList.contains('modal')) e.target.classList.remove('show');
    };
});

// Các hàm Render và Modal cơ bản (Giữ nguyên)
function renderTable(data) {
    const tbody = document.getElementById('billTableBody');
    tbody.innerHTML = '';
    data.forEach(b => {
        tbody.innerHTML += `
            <tr onclick="showDetail('${b.id}')">
                <td>${b.id}</td>
                <td>${b.name}</td>
                <td>${b.date}</td>
                <td>${b.total}</td>
                <td>${b.method}</td>
            </tr>
        `;
    });
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

function showDetail(id) {
    const bill = bills.find(b => b.id === id);
    if(!bill) return;
    deleteId = id;

    document.getElementById('dtId').textContent = bill.id;
    document.getElementById('dtName').textContent = bill.name;
    document.getElementById('dtTime').textContent = bill.date;
    document.getElementById('dtMethod').textContent = bill.method;

    const tbody = document.getElementById('dtItems');
    tbody.innerHTML = '';
    
    const items = bill.items.length ? bill.items : Array(3).fill({code:'HHxxxx', name:'Sản phẩm mẫu', qty:1, price:'10.000', total:'10.000'});
    let totalQty = 0;
    
    items.forEach(i => {
        totalQty += i.qty;
        tbody.innerHTML += `
            <tr>
                <td>${i.code}</td>
                <td>${i.name}</td>
                <td style="text-align: right;">${i.qty}</td>
                <td style="text-align: right;">${i.price}</td>
                <td style="text-align: right;">${i.total}</td>
            </tr>
        `;
    });

    document.getElementById('dtTotal').textContent = bill.total;

    document.getElementById('modalDetail').classList.add('show');
}

// 2. Flow Xóa
function confirmDelete() {
    // Mở Modal Xác nhận
    document.getElementById('modalConfirm').classList.add('show');
}

function executeDelete() {
    closeModal('modalConfirm');
    closeModal('modalDetail');
    
    // Xóa dữ liệu giả lập
    bills = bills.filter(b => b.id !== deleteId);
    renderTable(bills);

    // Hiện Popup thành công (Sử dụng thời gian dài hơn: 1500ms)
    const successModal = document.getElementById('modalSuccess');
    successModal.classList.add('show');
    setTimeout(() => successModal.classList.remove('show'), 1500); // Tăng thời gian hiển thị
}

// 3. Tìm kiếm & Lỗi
function handleSearch() {
    const term = document.getElementById('searchId').value.trim().toLowerCase();
    const nameTerm = document.getElementById('searchName').value.trim().toLowerCase();
    
    // Giả lập lỗi mạng hoặc không tìm thấy
    if (term === 'error' || nameTerm === 'error') {
        showAlert('Không thể truy vấn dữ liệu - vui lòng kiểm tra kết nối Internet và thử lại');
        return;
    }

    const res = bills.filter(b => 
        b.id.toLowerCase().includes(term) && 
        b.name.toLowerCase().includes(nameTerm)
    );
    
    if (res.length === 0) {
        // Không tìm thấy 
        showAlert('Không có hóa đơn nào phù hợp với điều kiện');
        renderTable([]);
    } else {
        renderTable(res);
    }
}

// 4. Hệ thống thông báo Lỗi (Alert)
function showAlert(msg) {
    document.getElementById('alertMsg').textContent = msg;
    const modal = document.getElementById('modalAlert');
    modal.classList.add('show');
    setTimeout(() => modal.classList.remove('show'), 1500); // Tăng thời gian hiển thị
}