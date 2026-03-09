// --- DOM Elements ---
const reportContentContainer = document.getElementById('reportContentContainer'); 
const noReportMessage = document.getElementById('noReportMessage'); 
const reportTitle = document.getElementById('reportTitle');
const reportRangeDate = document.getElementById('reportRangeDate'); 
const mainReportButtons = document.querySelectorAll('.group-section.button-report-list .btn-report-quick'); 

// Calendar elements (Đã gộp)
const dateRangeInput = document.getElementById('dateRange');
const calMerged = document.getElementById('calMerged');

// Toasts
const toastDateError = document.getElementById('toastDateError'); 
const toastError = document.getElementById('toastError'); 
const errorText = document.getElementById('errorText');
const toastExportSuccess = document.getElementById('toastExportSuccess'); 
const toastExportError = document.getElementById('toastExportError'); 

let currentDateMerged = new Date(); 
let currentReportSelection = 'banhang'; 

// Trạng thái cho Date Range Picker
let selectedDateStart = null;
let selectedDateEnd = null;
let isSelectingStart = true; // Bắt đầu bằng việc chọn ngày bắt đầu


// --- LOGIC MENU USER (Giữ nguyên) ---
function toggleUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('active');
}

// Hàm format ngày (dd/mm/yyyy)
function getFormattedDate(date) {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Hàm chuyển đổi chuỗi "dd/mm/yyyy" thành đối tượng Date
function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    // parts[2]: năm, parts[1]-1: tháng (0-11), parts[0]: ngày
    return new Date(parts[2], parts[1] - 1, parts[0]); 
}

// Hàm format tiền tệ (Ví dụ: 1000000 -> 1.000.000)
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// --- LOGIC CHỌN LOẠI BÁO CÁO ---
function selectReportType(reportType, buttonElement) {
    currentReportSelection = reportType;
    mainReportButtons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    
    const reportName = reportType === 'banhang' ? 'Bán Hàng' : 'Hàng Hóa';
    reportTitle.innerText = `BÁO CÁO ${reportName.toUpperCase()}`;
    
    // Reset khu vực hiển thị
    reportContentContainer.innerHTML = '';
    reportContentContainer.style.display = 'none';
    noReportMessage.style.display = 'flex';
    // noReportMessage.innerHTML = `Đã chọn loại báo cáo: **${reportName}**. <br> Vui lòng chọn ngày và nhấn **Tìm Kiếm**. `;

    // errorText.innerText = `Đã chọn Báo Cáo ${reportName}`;
    // showToast(toastError, 800);
}

// --- HÀM TẠO BẢNG BÁO CÁO GIẢ LẬP (Giữ nguyên) ---
function renderReportTable(reportType, startDate, endDate) {
    let html = '';
    let totalQuantity = 0;
    let totalAmount = 0;
    const currency = 'đ';

    if (reportType === 'banhang') {
        const data = [
            { ma: 'HD0000001', ten: 'Khách lẻ', time: '10:30', payment: 'Tiền mặt', qty: 10, amount: 600000, revenue: 600000 },
            { ma: 'HD0000002', ten: 'Khách lẻ', time: '18:35', payment: 'Tiền mặt', qty: 10, amount: 600000, revenue: 600000 },
            { ma: 'HD0000003', ten: 'Khách lẻ', time: '18:45', payment: 'Tiền mặt', qty: 10, amount: 600000, revenue: 600000 },
            { ma: 'HD0000004', ten: 'Khách lẻ', time: '19:30', payment: 'Tiền mặt', qty: 10, amount: 600000, revenue: 600000 },
        ];
        
        // Giả lập dữ liệu cho ngày hôm nay: thay đổi ngày trong time
        const currentData = data.map(item => ({
            ...item,
            time: (startDate.toDateString() === selectedDateEnd.toDateString()) 
                ? `${item.time}` // Nếu là 1 ngày, chỉ hiện giờ
                : `${getFormattedDate(startDate)} ${item.time}` // Nếu là range, hiện cả ngày giờ
        }));

        // Tính tổng
        currentData.forEach(item => {
            totalQuantity += item.qty;
            totalAmount += item.amount;
        });

        // Bắt đầu bảng
        html += '<table class="report-table"><thead><tr>';
        html += '<th>Mã hóa đơn</th><th>Tên khách hàng</th><th>Thời gian</th><th>Thanh toán</th><th>Số lượng</th><th>Tổng tiền hàng</th><th>Doanh thu</th>';
        html += '</tr></thead><tbody>';

        // Dòng tổng
        html += `<tr><td>Hóa đơn: ${currentData.length}</td><td></td><td></td><td></td><td>${totalQuantity}</td><td>${formatCurrency(totalAmount)}${currency}</td><td>${formatCurrency(totalAmount)}${currency}</td></tr>`;

        // Dữ liệu chi tiết
        currentData.forEach(item => {
            html += `<tr><td>${item.ma}</td><td>${item.ten}</td><td>${item.time}</td><td>${item.payment}</td><td>${item.qty}</td><td>${formatCurrency(item.amount)}${currency}</td><td>${formatCurrency(item.revenue)}${currency}</td></tr>`;
        });
        
        html += '</tbody></table>';

    } else if (reportType === 'hanghoa') {
        const data = [
            { ma: 'HH0000001', ten: 'Bột giặt Omo', qty: 9, price: 60000, totalValue: 540000, revenue: 540000 },
            { ma: 'HH0000002', ten: 'Bánh cam', qty: 2, price: 60000, totalValue: 120000, revenue: 120000 },
            { ma: 'HH0000003', ten: 'Sữa tiệt trùng Vinamilk', qty: 7, price: 60000, totalValue: 420000, revenue: 420000 },
            { ma: 'HH0000004', ten: 'Sữa tiệt trùng TH TrueMilk', qty: 11, price: 60000, totalValue: 660000, revenue: 660000 },
            { ma: 'HH0000005', ten: 'Bột giặt Ariel', qty: 11, price: 60000, totalValue: 660000, revenue: 660000 },
        ];
        
        // Tính tổng
        data.forEach(item => {
            totalQuantity += item.qty;
            totalAmount += item.totalValue;
        });
        
        // Bắt đầu bảng
        html += '<table class="report-table"><thead><tr>';
        html += '<th>Mã hàng hóa</th><th>Tên hàng</th><th>Số lượng bán</th><th>Giá trị</th><th>Doanh thu</th>';
        html += '</tr></thead><tbody>';

        // Dòng tổng
        html += `<tr><td>SL mặt hàng: ${data.length}</td><td></td><td>${totalQuantity}</td><td>${formatCurrency(totalAmount)}${currency}</td><td>${formatCurrency(totalAmount)}${currency}</td></tr>`;

        // Dữ liệu chi tiết
        data.forEach(item => {
            html += `<tr><td>${item.ma}</td><td>${item.ten}</td><td>${item.qty}</td><td>${formatCurrency(item.totalValue)}${currency}</td><td>${formatCurrency(item.revenue)}${currency}</td></tr>`;
        });
        
        html += '</tbody></table>';
    }

    return html;
}

/**
 * Hàm tải báo cáo Tùy Chỉnh khi nhấn nút "Tìm Kiếm" hoặc khi load trang
 */
function loadCustomReport() {
    // 1. Kiểm tra ngày
    if (!selectedDateStart || !selectedDateEnd) {
        errorText.innerText = "Không có giao dịch nào";
        showToast(toastError, 1500);
        return;
    }

    const startValue = getFormattedDate(selectedDateStart);
    const endValue = getFormattedDate(selectedDateEnd);
    
    // Đảm bảo Ngày bắt đầu không lớn hơn Ngày kết thúc
    if (selectedDateStart > selectedDateEnd) {
        showToast(toastDateError, 2000); 
        reportContentContainer.style.display = 'none';
        noReportMessage.style.display = 'flex';
        return;
    }

    // 2. Xác định loại báo cáo và nội dung bảng
    const reportName = currentReportSelection === 'banhang' ? 'Bán Hàng' : 'Hàng Hóa';
    const reportTableHTML = renderReportTable(currentReportSelection, selectedDateStart, selectedDateEnd);

    // 3. Cập nhật Tiêu đề báo cáo và khoảng ngày
    reportTitle.innerText = `BÁO CÁO ${reportName.toUpperCase()}`;
    
    // Tùy chỉnh hiển thị khoảng ngày (Single Day vs Range)
    if (selectedDateStart.toDateString() === selectedDateEnd.toDateString()) {
        reportRangeDate.innerText = `Ngày ${startValue}`;
        dateRangeInput.value = startValue; 
    } else {
        reportRangeDate.innerText = `Từ ngày ${startValue} đến ngày ${endValue}`;
        dateRangeInput.value = `${startValue} - ${endValue}`;
    }
    
    // 4. Hiển thị bảng
    reportContentContainer.innerHTML = reportTableHTML;
    reportContentContainer.style.display = 'block';
    noReportMessage.style.display = 'none';
    
    // 5. Thông báo cho người dùng
    // errorText.innerText = `Đã tải Báo Cáo ${reportName}`;
    // showToast(toastError, 800);
}


// --- LOGIC LỊCH CHỌN NGÀY GỘP ---

// Hàm chung để render lịch gộp (Giữ nguyên)
function renderCalendarMerged(date) {
    const daysElement = calMerged.querySelector('.cal-days');
    const monthYearElement = document.getElementById('monthYearMerged');

    daysElement.innerHTML = ''; 
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay(); 
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        daysElement.innerHTML += '<div></div>';
    }

    for (let day = 1; day <= lastDate; day++) {
        const fullDateObj = new Date(year, month, day);
        let classes = 'day';

        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            classes += ' today';
        }
        
        let isStart = selectedDateStart && fullDateObj.toDateString() === selectedDateStart.toDateString();
        let isEnd = selectedDateEnd && fullDateObj.toDateString() === selectedDateEnd.toDateString();
        
        if (isStart || isEnd) {
            classes += ' selected';
        } else if (selectedDateStart && selectedDateEnd && fullDateObj > selectedDateStart && fullDateObj < selectedDateEnd) {
            // Ngày nằm giữa khoảng
            classes += ' range-selected';
        }
        
        daysElement.innerHTML += `<div class="${classes}" data-day="${day}">${day}</div>`;
    }
    
    // Gắn sự kiện click
    calMerged.querySelectorAll('.day').forEach(dayEl => {
        dayEl.addEventListener('click', (e) => selectDateRange(e.target, year, month));
    });
}

function selectDateRange(dayEl, year, month) {
    const day = parseInt(dayEl.getAttribute('data-day'));
    const clickedDate = new Date(year, month, day);

    // Bỏ hết class selected/range-selected cũ
    calMerged.querySelectorAll('.day').forEach(d => d.classList.remove('selected', 'range-selected'));

    if (isSelectingStart) {
        selectedDateStart = clickedDate;
        selectedDateEnd = null; 
        isSelectingStart = false; 
    } else {
        // Đã chọn ngày bắt đầu, giờ chọn ngày kết thúc
        if (clickedDate < selectedDateStart) {
            // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, reset và chọn lại ngày bắt đầu mới
            selectedDateStart = clickedDate;
            selectedDateEnd = null;
            // Vẫn giữ isSelectingStart = false để chọn ngày kết thúc tiếp theo
        } else {
            selectedDateEnd = clickedDate;
            isSelectingStart = true; // Chuẩn bị cho lần chọn tiếp theo
        }
    }
    
    // Nếu cả hai ngày đã chọn, đảm bảo ngày bắt đầu < ngày kết thúc
    if (selectedDateStart && selectedDateEnd && selectedDateStart > selectedDateEnd) {
        [selectedDateStart, selectedDateEnd] = [selectedDateEnd, selectedDateStart];
    }
    
    // Hiển thị ngày đã chọn (tạm thời) lên input
    if (selectedDateStart && !selectedDateEnd) {
        dateRangeInput.value = getFormattedDate(selectedDateStart);
    } else if (selectedDateStart && selectedDateEnd) {
        dateRangeInput.value = `${getFormattedDate(selectedDateStart)} - ${getFormattedDate(selectedDateEnd)}`;
    } else {
        dateRangeInput.value = 'Ngày bắt đầu - Ngày kết thúc'; // Placeholder
    }


    // Render lại lịch để thấy vùng chọn
    renderCalendarMerged(currentDateMerged); 
}

/**
 * Cập nhật hàm này để cho phép chọn 1 ngày (Start = End)
 */
function confirmDateRange() {
    if (selectedDateStart) {
        // Nếu chỉ có ngày bắt đầu được chọn, coi nó là ngày kết thúc
        if (!selectedDateEnd) {
            selectedDateEnd = selectedDateStart;
        }
        // Đã chọn đủ (1 ngày hoặc 2 ngày), đóng lịch
        toggleCalendar('calMerged');
    } else {
        errorText.innerText = "Vui lòng chọn Ngày bắt đầu.";
        showToast(toastError, 1500);
    }
}

// Các hàm chuyển tháng và mở/đóng lịch (Giữ nguyên)
function changeMonthMerged(offset) {
    currentDateMerged.setMonth(currentDateMerged.getMonth() + offset);
    renderCalendarMerged(currentDateMerged);
}
function prevMonth(id) { 
    if(id === 'calMerged') changeMonthMerged(-1); 
}
function nextMonth(id) { 
    if(id === 'calMerged') changeMonthMerged(1); 
}

function toggleCalendar(id) {
    const event = window.event;
    if(event) event.stopPropagation();
    
    const cal = document.getElementById(id);
    
    if (cal.style.display !== 'block') {
        renderCalendarMerged(currentDateMerged); // Render lại khi mở
        cal.style.display = 'block';
    } else {
        cal.style.display = 'none';
    }
}


// --- CHỨC NĂNG XUẤT BÁO CÁO (Giữ nguyên) ---
function handleExportReport() {
    if (reportContentContainer.style.display !== 'block') {
         errorText.innerText = "Vui lòng Tìm Kiếm báo cáo\n trước khi xuất file";
         showToast(toastError, 1500);
         return;
    }
    
    errorText.innerText = "Có lỗi xảy ra - vui lòng kiểm tra kết nối Internet và thử lại";
    showToast(toastError, 800);
    
    // Giả lập thời gian xuất file
    setTimeout(() => {
        hideToast(toastError);
        showToast(toastExportSuccess, 2000);
    }, 800);
}


// --- Helpers Toast (Giữ nguyên) ---
function showToast(el, duration) {
    el.style.display = 'flex';
    if (duration > 0) {
        setTimeout(() => {
            hideToast(el);
        }, duration);
    }
}

function hideToast(el) { el.style.display = 'none'; }

// --- GLOBAL EVENT LISTENER (Giữ nguyên) ---
window.onclick = function(event) {
    // 1. Đóng User Dropdown
    if (!event.target.closest('.user-menu')) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && userMenu.classList.contains('active')) {
            userMenu.classList.remove('active');
        }
    }

    // 2. Đóng Lịch (trừ khi click vào input hoặc lịch)
    if (!event.target.closest('.date-box') && !event.target.closest('.custom-calendar')) {
        calMerged.style.display = 'none';
    }
}

// KHỞI TẠO - Thiết lập ngày mặc định và tự động tải báo cáo
window.onload = function() {
    const today = new Date();
    currentDateMerged = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // 1. Đặt mặc định ngày bắt đầu và kết thúc là hôm nay
    selectedDateStart = new Date(currentDateMerged);
    selectedDateEnd = new Date(currentDateMerged);
    
    // Cập nhật input với ngày hôm nay
    dateRangeInput.value = getFormattedDate(selectedDateStart); 
    
    // 2. Mặc định chọn Bán Hàng và thực hiện Tìm Kiếm ngay
    const defaultButton = document.querySelector('[data-report-type="banhang"]');
    if (defaultButton) {
         // Đặt trạng thái active cho nút Bán Hàng (không gọi selectReportType để tránh hiện toast và reset quá sớm)
         currentReportSelection = 'banhang';
         defaultButton.classList.add('active');
         
         // Tự động tải báo cáo cho ngày hôm nay
         loadCustomReport();
    }
};