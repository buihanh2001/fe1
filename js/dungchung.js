// Thêm topnav vào trang
function addHeader() {
  const header = document.createElement("div");
  header.className = "header";
  header.innerHTML = `
      <div class="header-item">
        <a href="index.html">
          <img src="img/logo.png" width="250" height="100" alt="logo">
        </a>
        <a href="index.html">Gia Lâm Auto Mall</a>
      </div>
      <div class="header-buttons">
        <a href="dangnhap.html" class="header-button">Tài khoản</a>
        <a href="giohang.html" class="header-button">Giỏ hàng</a>
      </div>
    `;
  document.body.prepend(header);
}

// Thêm header
function addTopNav() {
  const nav = document.createElement("div");
  nav.className = "nav";
  nav.innerHTML = `
      <ul>
        <li><a href="index.html" class="nav-li-a">TRANG CHỦ</a></li>
        <li><a href="sanpham.html" class="nav-li-a">SẢN PHẨM</a></li>
        <li><a href="dichvu.html" class="nav-li-a">DỊCH VỤ</a></li>
        <li><a href="gioithieu.html" class="nav-li-a">GIỚI THIỆU</a></li>
        <li><a href="chamsoc.html" class="nav-li-a">CHĂM SÓC KHÁCH HÀNG</a></li>
        <li><a href="lienhe.html" class="nav-li-a">LIÊN HỆ</a></li>
      </ul>
    `;

  const productDetail = document.querySelector(".product-detail");
  document.body.insertBefore(nav, productDetail);
}

//thêm footer
function addFooterAndBottom() {
  const footer = document.createElement("div");
  footer.className = "footer";
  footer.innerHTML = `<div class="footer">
            <div class="footer-item">
                <p>DỊCH VỤ</p><br>
                <ul>
                    <li><a href="dichvu.html#content1">Dịch vụ bảo hành</a></li>
                    <li><a href="dichvu.html#content2">Dịch vụ bảo dưỡng</a></li>
                    <li><a href="dichvu.html#content3">Dịch vụ sửa chữa</a></li>
                    <li><a href="dichvu.html#content4">Kiểm tra triệu hồi</a></li>
                </ul>
            </div>
            <div class="footer-item">
                <p>DỊCH VỤ GIA TĂNG</p><br>
                <ul>
                    <li>Dịch vụ tài chính và vay ngân hàng</li>
                    <li>Bảo hiểm</li>
                    <li>Hỗ trợ khẩn cấp 24/7</li>
                    <li>Chương trình chăm sóc khách hàng</li>
                    <li>Dịch vụ thay thế phụ tùng</li>
                    <li>Dịch vụ đào tạo lái xe</li>
                </ul>
            </div>
            <div class="footer-item">
                <p>LỜI KHUYÊN CHUYÊN GIA</p><br>
                <ul>
                    <li>Hướng dẫn sử dụng xe</li>
                    <li>Những chú ý tăng tuổi thọ lốp</li>
                    <li>Những chú ý tăng tuổi thọ acquy</li>
                    <li>Hướng dẫn sử dụng xe an toàn</li>
                </ul>
            </div>
            <div class="footer-item">
                <p>HOẠT ĐỘNG ĐẠI LÝ</p><br>
                <ul>
                    <li>Khuyến mãi</li>
                    <li>Sự kiện</li>
                    <li>Tin tức</li>
                </ul>
            </div>
        </div>`; // your footer HTML here

  const bottom = document.createElement("div");
  bottom.className = "bottom";
  bottom.innerHTML = `<div class="bottom">
            <div class="bottom-item">
                <h3>SHOWROOM GIA LÂM AUTO MALL</h3><br>
                <p>Địa chỉ: 144, Gia Lâm, Trâu Quỳ, Hà Nội</p><br>
                <p>Telephone: 012 3456 7899</p><br>
            </div>

            <div class="bottom-item">
                <h3>ĐƯỜNG DÂY NÓNG</h3><br>
                <p>Hotline: 097777777 - CSKH: 028 9996 777</p><br>
                <p>E-mail: GiaLamAutoMall@gmail.com</p>
            </div>
        </div>`; // your bottom HTML here
  document.body.appendChild(footer);
  document.body.appendChild(bottom);
}
