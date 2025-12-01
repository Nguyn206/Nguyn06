<script>
    // 1. Khai báo biến cần thiết
    let cart = []; // Mảng lưu trữ các đối tượng món hàng: { name, price, quantity }
    const cartButton = document.getElementById('cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Hàm định dạng tiền tệ (thêm dấu phân cách)
    function formatPrice(price) {
        return price.toLocaleString('vi-VN') + ' VNĐ';
    }

    // 2. Hàm cập nhật giao diện Giỏ hàng (số lượng trên header và chi tiết trong modal)
    function updateCartUI() {
        // Tính tổng số lượng món hàng
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Giỏ Hàng (${totalItems})`;

        // Tính tổng tiền và hiển thị chi tiết giỏ hàng
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #777;">Giỏ hàng đang trống.</p>';
            cartTotalPrice.textContent = '0 VNĐ';
            checkoutBtn.disabled = true; // Vô hiệu hóa nút đặt món khi trống
            return;
        }

        checkoutBtn.disabled = false; // Kích hoạt nút đặt món khi có hàng

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>${formatPrice(itemTotal)} 
                    <button class="remove-item-btn" data-index="${index}">Xóa</button>
                </span>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        cartTotalPrice.textContent = formatPrice(total);
    }

    // 3. Xử lý sự kiện THÊM VÀO GIỎ
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Lấy thông tin món ăn từ thuộc tính data-*
            const itemName = e.target.getAttribute('data-name');
            // Chuyển giá tiền sang kiểu số nguyên
            const itemPrice = parseInt(e.target.getAttribute('data-price'));

            // Kiểm tra xem món đã có trong giỏ chưa
            const existingItem = cart.find(item => item.name === itemName);

            if (existingItem) {
                existingItem.quantity += 1; // Tăng số lượng
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 }); // Thêm mới
            }

            updateCartUI();
            showMessageBox(`Đã thêm ${itemName} vào giỏ!`, '#2ecc71');
        });
    });

    // 4. Xử lý sự kiện MỞ/ĐÓNG GIỎ HÀNG
    cartButton.addEventListener('click', (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
        cartModal.style.display = 'block';
    });

    // Đóng khi nhấn nút X
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Đóng khi click ra ngoài modal
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // 5. Xử lý sự kiện XÓA MÓN HÀNG
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const indexToRemove = parseInt(e.target.getAttribute('data-index'));
            
            // Xóa món khỏi mảng cart tại vị trí index
            cart.splice(indexToRemove, 1); 
            
            updateCartUI();
            showMessageBox('Đã xóa món khỏi giỏ hàng.', '#e74c3c'); 
        }
    });

    // 6. Xử lý sự kiện ĐẶT MÓN (CHECKOUT)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            // Hiển thị thông tin đặt món (có thể thay bằng chuyển hướng sang trang thanh toán)
            alert('🎉 TIẾN HÀNH ĐẶT MÓN! \n\nTổng cộng: ' + cartTotalPrice.textContent + '\n\nCác món đã đặt:\n' + 
                  cart.map(item => `- ${item.name} x ${item.quantity}`).join('\n') + 
                  '\n\nCảm ơn bạn đã ủng hộ Quán Nguyn! Vui lòng chờ cuộc gọi xác nhận.'
            );
            
            // Xóa giỏ hàng sau khi đặt món (giả định thành công)
            cart = [];
            updateCartUI();
            cartModal.style.display = 'none';

        } else {
            showMessageBox('Giỏ hàng của bạn đang trống!', '#f39c12');
        }
    });
    
    // 7. Hàm hiển thị thông báo (Toast/Message Box)
    function showMessageBox(message, bgColor) {
        let msgBox = document.createElement('div');
        msgBox.style.cssText = `
             position: fixed;
             top: 20px;
             right: 20px;
             background-color: ${bgColor}; 
             color: white;
             padding: 15px 25px;
             border-radius: 8px;
             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
             z-index: 1000;
             opacity: 0;
             transition: opacity 0.5s, transform 0.5s;
             transform: translateX(100%);
         `;
         msgBox.textContent = message;
         document.body.appendChild(msgBox);

         setTimeout(() => {
             msgBox.style.opacity = '1';
             msgBox.style.transform = 'translateX(0)';
         }, 10);

         setTimeout(() => {
             msgBox.style.opacity = '0';
             msgBox.style.transform = 'translateX(100%)';
             
             setTimeout(() => {
                 msgBox.remove();
             }, 500); 
         }, 3000);
     }

    // Khởi tạo giao diện khi tải trang
    updateCartUI();
</script>
