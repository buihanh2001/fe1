window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }

  await fetch(`${API_BASE_URL}/orders/detail?orderId=${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
      return response.json();
    })
    .then(async (data) => await renderOrderDetail(data))
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
    });
};

function renderOrderDetail(data) {
  const container = document.querySelector(".order-detail-container");
  const itemHTML = data.orderItemDetails
    .map(
      (item) => `<li>
            <span class="product-name">${item.name}</span>
            <span class="product-quantity">Số lượng: ${item.quantity}</span>
          </li>`
    )
    .join("");
  container.innerHTML = `<h1>Chi Tiết Đơn Hàng</h1>
      <div class="customer-info">
        <h2>Thông Tin Khách Hàng</h2>
        <p><strong>Tên: </strong>${data.customerName}</p>
        <p><strong>Số Điện Thoại: </strong>${data.phoneNumber}</p>
        <p><strong>Email: </strong>${data.email}</p>
      </div>

      <div class="order-info">
        <h2>Thông Tin Đơn Hàng</h2>
        <p><strong>Ngày đặt hàng: </strong>${formatDate(data.orderDate)}</p>
        <p><strong>Ngày hẹn xem xe: </strong>${formatDate(data.schedule)}</p>
        <h3>Sản Phẩm</h3>
        <ul class="product-list">
          ${itemHTML}
        </ul>
        <p>
          <strong>Ghi Chú:</strong>
          <span id="order-note">${data.remarks}</span>
        </p>
      </div>`;
}
