// Dữ liệu giả lập
const availableItems = [
    { id: 'HH000001', name: 'Sữa TH True Milk vị vani ít đường', price: 35000 },
    { id: 'HH000002', name: 'Sữa Milo năng lượng ít đường', price: 35000 },
    { id: 'HH000003', name: 'Bột giặt Omo', price: 35000 }, // Sản phẩm THỰC TẾ
    { id: 'HH000004', name: 'Nước rửa chén Sunlight', price: 40000 },
    { id: 'HH000005', name: 'Bột giặt Ariel', price: 100000 } // Sản phẩm KHÔNG TỒN TẠI (gây lỗi)
];

// Dữ liệu khách hàng giả lập
const availableCustomers = [
    { name: 'Khách lẻ', icon: 'fas fa-user', phone: '', address: '' },
    { name: 'Sùng Văn A', phone: '0987654321', address: 'Số 1, Hàng Bạc', icon: 'fas fa-user-circle' },
    { name: 'Nguyễn Văn B', phone: '0900112233', address: 'Số 5, Hàng Gai', icon: 'fas fa-user-circle' },
    { name: 'Trần Thị C', phone: '0911223344', address: 'Số 10, Trần Phú', icon: 'fas fa-user-circle' }
];

let invoiceData = {
    1: [
        { id: 'HH000001', name: 'Sữa TH True Milk vị vani ít đường', price: 35000, qty: 1, total: 35000 },
        { id: 'HH000002', name: 'Sữa Milo năng lượng ít đường', price: 35000, qty: 1, total: 35000 },
        { id: 'HH000003', name: 'Bột giặt Omo', price: 35000, qty: 1, total: 35000 } // Thêm Omo vào dữ liệu mẫu
    ]
};
let nextInvoiceId = 2;
let activeInvoiceId = 1;

// --- Hàm chung ---

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// --- Logic Hóa đơn và Tab ---

function getInvoiceTotal(invoiceId) {
    if (!invoiceData[invoiceId]) return 0;
    return invoiceData[invoiceId].reduce((sum, item) => sum + item.total, 0);
}

function formatCurrency(amount) {
    if (isNaN(amount) || amount === null) return '0';
    return amount.toLocaleString('vi-VN');
}

function updateInvoiceSummary(invoiceId) {
    const total = getInvoiceTotal(invoiceId);
    
    // Cập nhật Tổng tiền hàng
    const totalElement = document.getElementById(`total-amount-${invoiceId}`);
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
    
    // CẬP NHẬT TIỀN THỪA
    const paidInput = document.getElementById(`paid-amount-input-${invoiceId}`);
    const changeElement = document.getElementById(`change-amount-${invoiceId}`);
    
    if (paidInput && changeElement) {
        // Lấy giá trị nhập từ input Khách trả (loại bỏ định dạng nếu có)
        const paidAmount = parseFloat(paidInput.value.replace(/,/g, '')) || 0;
        const changeAmount = paidAmount - total;
        
        // Hiển thị Tiền thừa
        changeElement.textContent = formatCurrency(changeAmount > 0 ? changeAmount : 0);
    }
}


function renderInvoiceItems(invoiceId) {
    const list = document.getElementById(`invoice-items-list-${invoiceId}`);
    if (!list) return;

    list.innerHTML = '';
    
    if (!invoiceData[invoiceId] || invoiceData[invoiceId].length === 0) {
        updateInvoiceSummary(invoiceId);
        return;
    }

    invoiceData[invoiceId].forEach((item, index) => {
        const itemElement = document.createElement('li');
        itemElement.classList.add('invoice-item');
        itemElement.dataset.itemId = item.id;
        
        // Cập nhật cấu trúc HTML cho hàng hóa để khớp với style mới
        itemElement.innerHTML = `
            <span class="item-index">${index + 1}</span>
            <span class="item-code">${item.id}</span>
            <span class="item-name">${item.name}</span>
            <div class="item-quantity">
                <button class="quantity-btn decrease-btn" data-id="${item.id}" data-invoice-id="${invoiceId}">-</button>
                <span class="item-qty-display" data-id="${item.id}" data-invoice-id="${invoiceId}">${item.qty}</span>
                <button class="quantity-btn increase-btn" data-id="${item.id}" data-invoice-id="${invoiceId}">+</button>
            </div>
            <span class="item-price-display" data-id="${item.id}" data-invoice-id="${invoiceId}">${formatCurrency(item.price)}</span>
            <span class="item-total" data-id="${item.id}" data-invoice-id="${invoiceId}">${formatCurrency(item.total)}</span>
            <i class="fas fa-trash-alt item-delete" data-id="${item.id}" data-invoice-id="${invoiceId}"></i>
        `;
        list.appendChild(itemElement);
    });

    updateInvoiceSummary(invoiceId);
}

function createNewInvoiceTab() {
    const newId = nextInvoiceId++;

    // 1. Thêm dữ liệu hóa đơn mới
    invoiceData[newId] = [];

    // 2. Thêm tab mới
    const tabsContainer = document.getElementById('invoice-tabs');
    const newTab = document.createElement('div');
    newTab.classList.add('tab');
    newTab.dataset.id = newId;
    newTab.innerHTML = `Hóa đơn ${newId} <span class="tab-close" data-id="${newId}">x</span>`;
    tabsContainer.appendChild(newTab);

    // 3. Tạo nội dung hóa đơn mới (wrapper)
    const mainContent = document.getElementById('main-content-area');

    const wrapperElement = document.createElement('div');
    wrapperElement.classList.add('invoice-content-wrapper');
    wrapperElement.dataset.id = newId;
    wrapperElement.style.display = 'none'; // Bắt đầu ẩn

    wrapperElement.innerHTML = `
        <div class="invoice-body">
            <div class="invoice-details" id="invoice-details-${newId}">
                <div style="text-align: right; margin-bottom: 10px; font-size: 0.9em; color: #555;">${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                <ul class="invoice-items" id="invoice-items-list-${newId}"></ul>
            </div>

            <div class="payment-info" id="payment-info-${newId}">
                <div class="customer-fields">
                    <div class="customer-input-group">
                        <div class="customer-input-wrapper">
                            <i class="fas fa-user-circle input-icon"></i>
                            <input type="text" class="customer-input" id="customer-name-${newId}" placeholder="Nhập tên khách hàng">
                            <i class="fas fa-chevron-down dropdown-arrow-customer"></i>
                        </div>
                        <div class="customer-dropdown" id="customer-name-dropdown-${newId}"></div>
                    </div>
                    <div class="customer-input-group">
                        <div class="customer-input-wrapper">
                            <i class="fas fa-phone input-icon"></i>
                            <input type="text" class="customer-input" id="customer-phone-${newId}" placeholder="Nhập sđt">
                            <i class="fas fa-chevron-down dropdown-arrow-customer"></i>
                        </div>
                    </div>
                    <div class="customer-input-group">
                        <div class="customer-input-wrapper">
                            <i class="fas fa-map-marker-alt input-icon"></i>
                            <input type="text" class="customer-input" id="customer-address-${newId}" placeholder="Nhập địa chỉ">
                            <i class="fas fa-chevron-down dropdown-arrow-customer"></i>
                        </div>
                    </div>
                </div>
                <div class="payment-summary">
                    <div class="summary-row"><span>Tổng tiền hàng</span> <strong id="total-amount-${newId}">0</strong></div>
                    <div class="summary-row"><span>Khách trả</span> <input type="text" id="paid-amount-input-${newId}" value="0" class="paid-amount-input-display"></div>
                    <div class="summary-row"><span>Tiền thừa</span> <strong id="change-amount-${newId}">0</strong></div>
                </div>
                <div class="payment-method">
                    <div class="radio-group">
                        <label><input type="radio" name="payment-method-${newId}" value="cash"> Tiền mặt</label>
                        <label><input type="radio" name="payment-method-${newId}" value="transfer" checked> Chuyển khoản</label>
                    </div>
                </div>
                <div class="debt-option">
                    <div class="radio-group">
                        <label><input type="radio" name="debt-option-${newId}" value="no-debt" checked> Không thêm công nợ</label>
                        <label><input type="radio" name="debt-option-${newId}" value="add-debt"> Thêm công nợ</label>
                    </div>
                </div>
                <button class="print-button" id="print-invoice-btn-${newId}">In hóa đơn</button>
            </div>
        </div>
    `;
    mainContent.appendChild(wrapperElement);

    // 4. Kích hoạt tab mới
    switchInvoiceTab(newId);
}

function removeInvoiceTab(invoiceId) {
    if (Object.keys(invoiceData).length === 1) {
        alert('Không thể xóa tab hóa đơn cuối cùng.');
        return;
    }

    const tabToRemove = document.querySelector(`.tab[data-id="${invoiceId}"]`);
    const contentToRemove = document.querySelector(`.invoice-content-wrapper[data-id="${invoiceId}"]`);

    if (tabToRemove) tabToRemove.remove();
    if (contentToRemove) contentToRemove.remove();

    delete invoiceData[invoiceId];

    // Chuyển sang tab còn lại đầu tiên
    const remainingIds = Object.keys(invoiceData).map(Number).sort((a, b) => a - b);
    if (remainingIds.length > 0) {
        switchInvoiceTab(remainingIds[0]);
    }
}

function switchInvoiceTab(newId) {
    // Ẩn tab cũ và nội dung
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.invoice-content-wrapper').forEach(content => content.style.display = 'none');

    // Hiện tab mới và nội dung
    const newTab = document.querySelector(`.tab[data-id="${newId}"]`);
    const newContent = document.querySelector(`.invoice-content-wrapper[data-id="${newId}"]`);

    if (newTab && newContent) {
        newTab.classList.add('active');
        newContent.style.display = 'flex'; 
        activeInvoiceId = newId;
        renderInvoiceItems(newId); 
    }
}

// --- Logic Sản phẩm ---

function addItemToInvoice(invoiceId, itemId) {
    const itemInfo = availableItems.find(item => item.id === itemId);

    if (!itemInfo) return;

    // Logic: Bột giặt Ariel -> Sản phẩm không tồn tại (hiển thị popup 800ms)
    if (itemInfo.name.includes('Bột giặt Ariel')) {
        showModal('item-not-found-modal');
        setTimeout(() => {
            closeModal('item-not-found-modal');
        }, 800); // 800ms
        return;
    }

    // Logic: Bột giặt Omo hoặc sản phẩm khác -> Thêm vào hóa đơn
    const existingItem = invoiceData[invoiceId].find(item => item.id === itemId);
    const baseName = itemInfo.name;

    if (existingItem) {
        existingItem.qty++;
        existingItem.total = existingItem.qty * existingItem.price;
    } else {
        invoiceData[invoiceId].push({
            id: itemInfo.id,
            name: baseName, 
            price: itemInfo.price,
            qty: 1,
            total: itemInfo.price
        });
    }

    renderInvoiceItems(invoiceId);
}

function updateItemQuantity(invoiceId, itemId, change) {
    const item = invoiceData[invoiceId].find(i => i.id === itemId);
    if (item) {
        let newQty = item.qty + change;
        
        // Logic: Nếu kết quả bé hơn 1, hiển thị popup và KHÔNG CẬP NHẬT
        if (newQty < 1) {
            showModal('invalid-quantity-modal');
            
            // THÊM: Tự động tắt popup sau 800ms
            setTimeout(() => {
                closeModal('invalid-quantity-modal');
            }, 800);
            
            return; 
        }

        item.qty = newQty;
        item.total = item.qty * item.price;
        renderInvoiceItems(invoiceId);
    }
}

function deleteItemFromInvoice(invoiceId, itemId) {
    invoiceData[invoiceId] = invoiceData[invoiceId].filter(item => item.id !== itemId);
    renderInvoiceItems(invoiceId);
}

function filterItems(searchTerm) {
    const dropdown = document.getElementById('global-search-dropdown');
    const searchInput = document.getElementById('global-item-search');

    if (!dropdown || !searchInput) return;

    dropdown.innerHTML = '';
    
    // Đặt vị trí dropdown ngay dưới input trong header
    const rect = searchInput.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.top = `${rect.bottom}px`;
    dropdown.style.width = `${rect.width}px`;

    if (searchTerm.length < 1) {
        dropdown.style.display = 'none';
        return;
    }

    const filtered = availableItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length > 0) {
        filtered.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('search-dropdown-item');
            
            let displayName = item.name;
            
            // Sử dụng div mô phỏng icon ảnh sản phẩm như trong CSS
            itemElement.innerHTML = `<div class="item-image-icon" data-item-name="${displayName}"></div> ${displayName}`;
            
            itemElement.dataset.itemId = item.id;
            dropdown.appendChild(itemElement);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// --- Logic Khách hàng ---

function renderCustomerDropdown(invoiceId) {
    const dropdown = document.getElementById(`customer-name-dropdown-${invoiceId}`);
    const input = document.getElementById(`customer-name-${invoiceId}`);
    const searchTerm = input.value.toLowerCase();
    
    if (!dropdown) return;
    dropdown.innerHTML = '';

    const filteredCustomers = availableCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm)
    );

    if (filteredCustomers.length > 0) {
        filteredCustomers.forEach(customer => {
            const customerElement = document.createElement('div');
            customerElement.classList.add('customer-dropdown-item');
            
            // Khách lẻ phải có icon chính xác
            let customerIcon = customer.name === 'Khách lẻ' ? 'fas fa-user' : customer.icon;

            customerElement.innerHTML = `<i class="${customerIcon}"></i> ${customer.name}`;
            customerElement.dataset.customerName = customer.name;
            customerElement.dataset.customerPhone = customer.phone || '';
            customerElement.dataset.customerAddress = customer.address || '';
            dropdown.appendChild(customerElement);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function selectCustomer(invoiceId, customerName, customerPhone, customerAddress) {
    document.getElementById(`customer-name-${invoiceId}`).value = customerName;
    document.getElementById(`customer-phone-${invoiceId}`).value = customerPhone;
    document.getElementById(`customer-address-${invoiceId}`).value = customerAddress;
    document.getElementById(`customer-name-dropdown-${invoiceId}`).style.display = 'none';
}


// --- Logic Thanh toán ---

function handlePaidAmountInput(invoiceId) {
    updateInvoiceSummary(invoiceId);
}

function handlePrintInvoice(invoiceId) {
    const paymentMethodEl = document.querySelector(`input[name="payment-method-${invoiceId}"]:checked`);
    if (!paymentMethodEl) return;
    const paymentMethod = paymentMethodEl.value;
    
    if (paymentMethod === 'transfer') {
        showModal('no-connection-modal');
        
        setTimeout(() => {
            closeModal('no-connection-modal');
            showModal('payment-status-modal');
        }, 1500); 
        
        document.getElementById('payment-status-no').onclick = () => {
            closeModal('payment-status-modal');
            // alert('Chưa thanh toán. Quay về màn hình chính...'); 
            Object.keys(invoiceData).filter(id => id != 1).forEach(id => removeInvoiceTab(Number(id)));
            invoiceData[1] = [
                 { id: 'HH000001', name: 'Sữa TH True Milk vị vani ít đường', price: 35000, qty: 1, total: 35000 },
                 { id: 'HH000002', name: 'Sữa Milo năng lượng ít đường', price: 35000, qty: 1, total: 35000 },
                 { id: 'HH000003', name: 'Bột giặt Omo', price: 35000, qty: 1, total: 35000 }
            ]; // Reset data mẫu
            switchInvoiceTab(1);
        };
        
        document.getElementById('payment-status-yes').onclick = () => {
            closeModal('payment-status-modal');
            // alert(`Đã xác nhận thanh toán cho Hóa đơn ${invoiceId}. Tiếp tục làm việc.`);
        };
        
    } else {
        alert(`Đã lưu hóa đơn ${invoiceId} với phương thức Tiền mặt. Tổng: ${getInvoiceTotal(invoiceId).toLocaleString('vi-VN')} VND`);
    }
}


// --- Thêm Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Cần gọi render lại để tổng tiền hàng được cập nhật chính xác
    renderInvoiceItems(activeInvoiceId);

    // Listener cho nút Thêm tab mới (+)
    document.getElementById('add-invoice-tab').addEventListener('click', createNewInvoiceTab);

    // Listener chung cho Tab (chuyển đổi và xóa)
    document.getElementById('invoice-tabs').addEventListener('click', (e) => {
        const tabElement = e.target.closest('.tab');
        const closeBtn = e.target.closest('.tab-close');
        const tabId = tabElement ? parseInt(tabElement.dataset.id) : null;

        if (closeBtn) {
            e.stopPropagation(); 
            removeInvoiceTab(parseInt(closeBtn.dataset.id));
        } else if (tabElement) {
            switchInvoiceTab(tabId);
        }
    });

    // Listener cho ô tìm kiếm Header
    document.getElementById('global-item-search').addEventListener('input', (e) => {
        filterItems(e.target.value);
    });

    document.getElementById('global-item-search').addEventListener('focus', (e) => {
        filterItems(e.target.value);
    });
    
    // Listener cho dropdown tìm kiếm (Để thêm sản phẩm)
    document.getElementById('global-search-dropdown').addEventListener('click', (e) => {
        const itemElement = e.target.closest('.search-dropdown-item');
        if (itemElement) {
            const itemId = itemElement.dataset.itemId;
            addItemToInvoice(activeInvoiceId, itemId);
            document.getElementById('global-search-dropdown').style.display = 'none';
            document.getElementById('global-item-search').value = '';
        }
    });
    
    // --- Paid Amount Input Listener ---
    document.querySelector('.main-content').addEventListener('input', (e) => {
        if (e.target.id.startsWith('paid-amount-input-')) {
            const invoiceId = activeInvoiceId; 
            handlePaidAmountInput(invoiceId);
        }
    });
    

    // --- Customer Dropdown Listeners ---
    document.querySelector('.main-content').addEventListener('focusin', (e) => {
        if (e.target.id.startsWith('customer-name-')) {
            const invoiceId = activeInvoiceId;
            renderCustomerDropdown(invoiceId);
        }
    });

    document.querySelector('.main-content').addEventListener('input', (e) => {
        if (e.target.id.startsWith('customer-name-')) {
            const invoiceId = activeInvoiceId;
            renderCustomerDropdown(invoiceId);
        }
    });

    document.querySelector('.main-content').addEventListener('click', (e) => {
        const currentInvoiceId = activeInvoiceId;
        
        // Chọn khách hàng từ dropdown
        const customerItem = e.target.closest('.customer-dropdown-item');
        if (customerItem) {
            selectCustomer(
                currentInvoiceId,
                customerItem.dataset.customerName,
                customerItem.dataset.customerPhone,
                customerItem.dataset.customerAddress
            );
        }
        
        // 1. Tăng/Giảm số lượng
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = e.target.dataset.id;
            const itemInvoiceId = parseInt(e.target.dataset.invoiceId);
            if (itemInvoiceId === currentInvoiceId) {
                const change = e.target.classList.contains('increase-btn') ? 1 : -1;
                updateItemQuantity(currentInvoiceId, itemId, change);
            }
        }

        // 2. Xóa item (ấn icon thùng rác)
        if (e.target.classList.contains('item-delete')) {
            const itemId = e.target.dataset.id;
             const itemInvoiceId = parseInt(e.target.dataset.invoiceId);
            if (itemInvoiceId === currentInvoiceId) {
                deleteItemFromInvoice(currentInvoiceId, itemId);
            }
        }
        
        // 3. Nút In hóa đơn
        if (e.target.classList.contains('print-button') && parseInt(e.target.id.replace('print-invoice-btn-', '')) === currentInvoiceId) {
            handlePrintInvoice(currentInvoiceId);
        }
    });

    // Ẩn dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        const globalSearchDropdown = document.getElementById('global-search-dropdown');
        const customerDropdown = document.getElementById(`customer-name-dropdown-${activeInvoiceId}`);
        
        // Ẩn Global Search Dropdown
        if (!e.target.closest('.search-input-wrapper') && !e.target.closest('#global-search-dropdown')) {
            if(globalSearchDropdown) globalSearchDropdown.style.display = 'none';
        }
        
        // Ẩn Customer Dropdown
        if (customerDropdown && !e.target.closest('.customer-input-group') && !e.target.closest('.customer-dropdown')) {
            customerDropdown.style.display = 'none';
        }
    });
    
    // Đảm bảo updateSummary được gọi khi khởi tạo
    updateInvoiceSummary(activeInvoiceId);
});

window.closeModal = closeModal;