let myEditor;
document.addEventListener("DOMContentLoaded", function () {
  ClassicEditor.create(document.querySelector("#description")).then(
    (editor) => {
      myEditor = editor;
    }
  );
});
window.onload = async function () {
  //   document.getElementById("imgFile").addEventListener("click", function () {
  //     document.getElementById("imageInput").click();
  //   });
  const brandSelect = document.getElementById("carType");

  let brands;
  await fetch(`${API_BASE_URL}/carType`)
    .then((response) => {
      console.log("fetch response:", response); // Log toàn bộ response
      if (!response.ok) {
        throw new Error("Lỗi mạng: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log("fetch data:", data); // Log dữ liệu thô từ API
      brands = data.map((carType) => ({
        ...carType,
        id: carType.id,
        name: carType.name,
      }));
      console.log("mapped brands:", brands);
    })
    .catch((error) => {
      console.error("Lỗi fetch:", error);
      document.querySelector(".product-container").innerHTML =
        "<p>Không thể tải dữ liệu sản phẩm.</p>";
    });
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand.id;
    option.textContent = brand.name;
    brandSelect.appendChild(option);
  });
  document.getElementById("price").addEventListener("input", function (e) {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    if (rawValue) {
      e.target.value = Number(rawValue).toLocaleString("vi-VN");
    } else {
      e.target.value = "";
    }
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
        const res = await fetch(`${API_BASE_URL}/cars`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          console.log("fetch api not ok");
          return;
        }
        alert("Thêm sản phẩm thành công");
        window.location.href = "admin.html";
      } catch (err) {
        console.log(err);
      }
    });
};
