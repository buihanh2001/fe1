window.onload = async function () {
  if (!isAdmin()) {
    window.location.href = "sanpham.html";
  }
};

document.querySelectorAll(".sidebar li").forEach((item) => {
  item.addEventListener("click", async () => {
    const selectedId = item.getAttribute("data-id");

    // Ẩn tất cả phần nội dung
    document.querySelectorAll(".main-content").forEach((post) => {
      post.style.display = "none";
    });

    // Hiện phần nội dung được chọn
    document.getElementById(selectedId).style.display = "block";
    if (selectedId == "donhang") {
      await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
          return response.json();
        })
        .then(async (data) => await renderOrder(data))
        .catch((error) => {
          console.error(error);
          document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
        });
    } else if (selectedId == "sanpham") {
      await fetch(`${API_BASE_URL}/cars`)
        .then((response) => {
          if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
          return response.json();
        })
        .then(async (data) => await renderCar(data))
        .catch((error) => {
          console.error(error);
          document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
        });
      document
        .querySelector(".search-car")
        .addEventListener("click", async function () {
          const keyword = document.getElementById("search-car").value;
          const res = await fetch(
            `${API_BASE_URL}/cars/search?keyword=${keyword}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          )
            .then((response) => {
              if (!response.ok)
                throw new Error("Lỗi khi lấy chi tiết sản phẩm");
              return response.json();
            })
            .then(async (data) => await renderCar(data))
            .catch((error) => {
              console.error(error);
              document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
            });
        });
    } else if (selectedId == "khachhang") {
      await fetch(`${API_BASE_URL}/account`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
          return response.json();
        })
        .then(async (data) => await renderAccount(data))
        .catch((error) => {
          console.error(error);
          document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
        });
    } else if (selectedId == "lichhen") {
      await fetch(`${API_BASE_URL}/orders/schedule`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Lỗi khi lấy danh sách lịch hẹn");
          return response.json();
        })
        .then(async (data) => await renderSchedule(data))
        .catch((error) => {
          console.error(error);
          document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
        });
    }

    // Cập nhật class active
    document.querySelectorAll(".sidebar li").forEach((li) => {
      li.classList.remove("active");
    });
    item.classList.add("active");
  });
});

async function renderOrder(listOrder) {
  const tbody = document.querySelector(".detail-table-order");
  tbody.innerHTML = "";
  listOrder.forEach((order) => {
    console.log("Rendering order:", order);
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${order.id}</td>
              <td>${order.customerName}</td>
              <td>${order.createdDateTime}</td>
              <td>${order.totalPrice.toLocaleString("vi-VN")}</td>
              <td class="orderStatus">${order.orderStatus}</td>
              <td>
                <button class="approve-button" data-id=${order.uuid}>✓</button>
                <button class="cancel-button" data-id=${order.uuid}>✖</button>
              </td>
    `;
    tbody.appendChild(row);
  });
  document.querySelectorAll(".approve-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const resp = await fetch(
        `${API_BASE_URL}/orders/changeStatus?orderUUId=${id}&isIncrease=true`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Lỗi khi xóa cart item");
      } else {
        const row = button.closest("tr");
        row.querySelector(".orderStatus").innerText =
          row.querySelector(".orderStatus").innerText == "APPROVED"
            ? "COMPLETED"
            : "APPROVED";
      }
    });
  });
  document.querySelectorAll(".cancel-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const resp = await fetch(
        `${API_BASE_URL}/orders/changeStatus?orderUUId=${id}&isIncrease=false`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Lỗi khi xóa cart item");
      } else {
        const row = button.closest("tr");
        row.querySelector(".orderStatus").innerText = "CANCELLED";
      }
    });
  });
}

function renderCar(listCar) {
  const tbody = document.querySelector(".detail-table-car");
  tbody.innerHTML = "";
  listCar.forEach((car) => {
    console.log("Rendering car:", car);
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${car.id}</td>
              <td>${car.name}</td>
              <td>${car.carTypeName}</td>
              <td>${car.price.toLocaleString("vi-VN")}</td>
              <td style="word-break: break-word">
                ${car.description}
              </td>
              <td>${car.viewCount}</td>
              <td>${car.stock}</td>
              <td>
                <a type="button" href="suasanpham.html?id=${
                  car.id
                }" class="update-button">🔧</a>
                <button class="delete-button" data-id="${car.id}">✖</button>
              </td>
    `;
    tbody.appendChild(row);
  });
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmed = confirm("Bạn có chắc là xóa luôn không?");
      if (!confirmed) return;
      const id = button.dataset.id;
      const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) {
        alert("Xóa thất bại");
      } else {
        alert("Xóa thành công");
        await fetch(`${API_BASE_URL}/cars`)
          .then((response) => {
            if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
            return response.json();
          })
          .then(async (data) => await renderCar(data))
          .catch((error) => {
            console.error(error);
            document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
          });
      }
    });
  });
}
function renderAccount(listAccount) {
  const tbody = document.querySelector(".detail-table-account");
  tbody.innerHTML = "";
  listAccount.forEach((account) => {
    console.log("Rendering account:", account);
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${account.id}</td>
              <td>${account.username}</td>
              <td>${account.email}</td>
              <td>
                ${account.phoneNumber}
              </td>
              <td>${account.active ? "đang hoạt động" : "hết hoạt động"}</td>
              <td>${account.createdDateTime}</td>
              <td>
                <button class="delete-button">✖</button>
              </td>
    `;
    tbody.appendChild(row);
  });
}

function renderCarTypes(listCarTypes) {
  const tbody = document.querySelector(".detail-table-carType");
  tbody.innerHTML = ""; // Xóa nội dung cũ của bảng

  listCarTypes.forEach((carType) => {
    console.log("Rendering car type:", carType);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${carType.id}</td>
      <td>${carType.name}</td>
      <td>
        <button class="delete-button">✖</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
function renderSchedule(listCarTypes) {
  const tbody = document.querySelector(".schedule-table");
  tbody.innerHTML = ""; // Xóa nội dung cũ của bảng
  let count = 1;

  listCarTypes.forEach((carType) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${count}</td>
      <td>${carType.customerName}</td>
      <td>${carType.schedule}</td>
      <td><a href="chitietdonhang.html?id=${carType.uuid}">Xem chi tiết đơn hàng</a></td>
      <td>
        <button class="delete-button">✖</button>
      </td>
    `;
    tbody.appendChild(row);
    count++;
  });
}

const item = document.querySelector(".add-button");
item.addEventListener("click", () => {
  window.location.href = `themsanpham.html`;
});
