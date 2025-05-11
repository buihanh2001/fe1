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
      await fetch(`${API_BASE_URL}/orders`)
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
            `${API_BASE_URL}/cars/search?keyword=${keyword}`
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
      await fetch(`${API_BASE_URL}/account`)
        .then((response) => {
          if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
          return response.json();
        })
        .then(async (data) => await renderAccount(data))
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

function renderOrder(listOrder) {
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
              <td>${order.orderStatus}</td>
              <td>
                <button class="add-button">✓</button>
                <button class="delete-button">✖</button>
              </td>
    `;
    tbody.appendChild(row);
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
                <button class="update-button">🔧</button>
                <button class="delete-button">✖</button>
              </td>
    `;
    tbody.appendChild(row);
  });
}

const item = document.querySelector(".add-button");
item.addEventListener("click", () => {
  window.location.href = `themsanpham.html`;
});
