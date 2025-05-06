document.querySelectorAll('.sidebar li').forEach(item => {
  item.addEventListener('click', () => {
    const selectedId = item.getAttribute('data-id');

    // Ẩn tất cả phần nội dung
    document.querySelectorAll('.main-content').forEach(post => {
      post.style.display = 'none';
    });

    // Hiện phần nội dung được chọn
    document.getElementById(selectedId).style.display = 'block';

    // Cập nhật class active
    document.querySelectorAll('.sidebar li').forEach(li => {
      li.classList.remove('active');
    });
    item.classList.add('active');
  });
});
