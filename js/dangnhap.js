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

            // Cập nhật trạng thái 
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});