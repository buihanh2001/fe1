window.onload = async function () {
  await renderUserInfo();
  await renderUserOrders();
};

async function renderUserInfo() {
  const infoDiv = document.querySelector(".info > div");
  if (!infoDiv) {
    console.error("Không tìm thấy div thông tin người dùng.");
    return;
  }

  const payload = getPayload();
  if (!payload) {
    console.error("Không tìm thấy payload người dùng.");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("Không tìm thấy userId trong localStorage.");
    infoDiv.innerHTML = "<p>Không tìm thấy ID người dùng để tải thông tin.</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/account/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Lỗi khi lấy thông tin tài khoản.");
    }

    const userData = await response.json();

    infoDiv.innerHTML = `
      <p><strong>Tên đăng nhập:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Số điện thoại:</strong> ${userData.phoneNumber}</p>
      <p><strong>Địa chỉ:</strong> ${userData.address}</p>
      <p><strong>Ngày tạo:</strong> ${formatDate(userData.createdDateTime)}</p>
    `;
  } catch (error) {
    console.error("Lỗi khi tải thông tin người dùng:", error);
    infoDiv.innerHTML = "<p>Không thể tải thông tin người dùng.</p>";
  }
}

async function renderUserOrders() {
  const tbody = document.querySelector(".order-table tbody");
  if (!tbody) {
    console.error("Không tìm thấy bảng đơn hàng.");
    return;
  }
  tbody.innerHTML = ""; // Xóa dữ liệu mẫu

  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("Không tìm thấy userId trong localStorage để tải đơn hàng.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/orders/account/getAll?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách đơn hàng.");
    }

    const ordersData = await response.json();

    if (ordersData && ordersData.length > 0) {
      let count = 1;
      ordersData.forEach((order) => {
        const row = document.createElement("tr");
        const productNames = order.orderItemDetails
          .map((item) => item.name)
          .join(", ");
        row.innerHTML = `
          <td>${count}</td>
          <td>${productNames}</td>
          <td>${
            order.orderStatus == "SCHEDULED" ? "Đã hẹn lịch" : order.orderStatus
          }</td>
          <td>${order.totalAmount.toLocaleString("vi-VN")} đ</td>
          <td>${formatDate(order.orderDate)}</td>
          <td>
            <button ${
              order.orderStatus != "SCHEDULED" ? "disabled" : ""
            } class="changeSchedule" data-id="${
          order.uuid
        }">Thay đổi lịch hẹn</button>
          </td>
        `;
        tbody.appendChild(row);
        count++;
      });
      document.querySelectorAll(".changeSchedule").forEach((button) => {
        button.addEventListener("click", async () => {
          const orderId = button.dataset.id;
          window.open(`dangkixemxe.html?orderId=${orderId}`, "_blank");
        });
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="5">Không có đơn hàng nào.</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng của người dùng:", error);
    tbody.innerHTML =
      '<tr><td colspan="5">Lỗi khi tải dữ liệu đơn hàng.</td></tr>';
  }
}
