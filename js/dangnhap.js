document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabToShow = this.getAttribute('data-tab');

            // Ẩn tất cả các tab content
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Hiển thị tab content được chọn
            document.getElementById(tabToShow).classList.add('active');

            // Cập nhật trạng thái active của nút tab
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    //thêm logic xử lý form đăng nhập và đăng ký
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn submit mặc định
        // Xử lý dữ liệu đăng nhập
        console.log('Đăng nhập:', {
            username: document.getElementById('login-username').value,
            password: document.getElementById('login-password').value
        });
        alert('Đăng nhập thành công !');
        window.location.href = 'index.html'; // Thêm dòng này để chuyển hướng
    });

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn submit mặc định
        // Xử lý dữ liệu đăng ký
        console.log('Đăng ký:', {
            fullname: document.getElementById('register-fullname').value,
            email: document.getElementById('register-email').value,
            phone: document.getElementById('register-phone').value,
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm-password').value
        });

        // Kiểm tra mật khẩu trùng khớp (
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        if (password !== confirmPassword) {
            alert('Mật khẩu không trùng khớp!');
            return;
        }

        alert('Đăng ký thành công!');
    });
});