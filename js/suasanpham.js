let myEditor;
document.addEventListener("DOMContentLoaded", function () {
  ClassicEditor.create(document.querySelector("#description")).then(
    (editor) => {
      myEditor = editor;
    }
  );
});

window.onload = async function () {
  const brandSelect = document.getElementById("carType");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let brands;
  await fetch(`${API_BASE_URL}/carType`)
    .then((response) => {
      console.log("fetch response:", response); // Log toàn bộ response
      if (!response.ok) {
        throw new Error("Lỗi mạng: " + response.status);
      }
      return response.json();
    })
    .then(async (data) => {
      console.log("fetch data:", data); // Log dữ liệu thô từ API
      brands = data.map((carType) => ({
        ...carType,
        id: carType.id,
        name: carType.name,
      }));
      console.log("mapped brands:", brands);
      brands.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.textContent = brand.name;
        brandSelect.appendChild(option);
      });
      await loadCar(id);
    })
    .catch((error) => {
      console.error("Lỗi fetch:", error);
      document.querySelector(".product-container").innerHTML =
        "<p>Không thể tải dữ liệu sản phẩm.</p>";
    });
  document.getElementById("price").addEventListener("input", function (e) {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    if (rawValue) {
      e.target.value = Number(rawValue).toLocaleString("vi-VN");
    } else {
      e.target.value = "";
    }
  });
  document.getElementById("imageInput").addEventListener("input", function (e) {
    document.querySelector(".imageCar").style.display = "none";
  });
  document
    .getElementById("carForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData();
      const car = {
        name: form.name.value,
        description: myEditor.getData(),
        price: form.price.value.replace(/[^\d]/g, ""),
        stock: form.stock.value,
        carTypeId: form.carType.value,
      };
      formData.append("car", JSON.stringify(car));

      const files = form.imageInput.files;
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      try {
        const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
          method: "PUT",
          body: formData,
        });
        if (!res.ok) {
          console.log("fetch api not ok");
          return;
        }
        alert("Sửa thành công");
        window.location.href = "admin.html";
      } catch (err) {
        console.log(err);
      }
    });
};

async function loadCar(id) {
  if (!id) {
    alert("Không tìm thấy sản phẩm");
    return;
  }
  await fetch(`${API_BASE_URL}/cars/${id}`)
    .then(async (response) => {
      if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
      const car = await response.json();
      document.getElementById("name").value = car.name || "";
      myEditor.setData(car.description || "");
      document.getElementById("price").value =
        car.price.toLocaleString("vi-VN") || "";
      document.getElementById("stock").value = car.stock || "";
      document.getElementById("carType").value = car.carTypeId || "";
      const container = document.querySelector(".imageCar");
      const imageHTML = car.carImagesUrl
        .map(
          (url) => `<img src="${url}" alt="${car.name}" class="product-image">`
        )
        .join("");
      container.innerHTML = `
        <div class="product-images-container">
        ${imageHTML}
      </div>`;
    })
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
    });
}
