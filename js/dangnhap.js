document.addEventListener("DOMContentLoaded", function () {
  if (isLoggedIn()) {
    window.location.href = document.referrer;
  }
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  tabButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const tabToShow = this.getAttribute("data-tab");
      if (tabToShow == "register") {
        document
          .getElementById("login-form")
          .removeEventListener("submit", handleLogin);
        document
          .getElementById("register-form")
          .addEventListener("submit", handleRegister);
        await getProvinces();
      } else {
        document
          .getElementById("login-form")
          .addEventListener("submit", handleLogin);
      }
      // Ẩn tất cả các tab content
      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      // Hiển thị tab content được chọn
      document.getElementById(tabToShow).classList.add("active");

      // Cập nhật trạng thái
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
});
async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  if (form.registerPassword.value != form.registerConfirmPassword.value) {
    alert("Mật khẩu xác nhận không trùng với mật khẩu.");
    return;
  }
  const selectProvince = document.getElementById("province-filter");
  const selectedTextProvince =
    selectProvince.options[selectProvince.selectedIndex].text;
  const selectDistrict = document.getElementById("district-filter");
  const selectedTextDistrict =
    selectDistrict.options[selectDistrict.selectedIndex].text;
  const selectWard = document.getElementById("ward-filter");
  const selectedTextWard = selectWard.options[selectWard.selectedIndex].text;
  const registerInfor = {
    fullName: form.registerFullname.value,
    address:
      selectedTextProvince +
      " " +
      selectedTextDistrict +
      " " +
      selectedTextWard +
      " " +
      document.getElementById("street").value,
    dob: form.dob.value,
    email: form.registeEmail.value,
    username: form.username.value,
    phoneNumber: form.registerPhone.value,
    password: form.registerPassword.value,
  };
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerInfor),
  })
    .then((response) => {
      if (!response.ok && response.status == 401) {
        throw new Error("không có quyền");
      }
      return response.json();
    })
    .then(async (data) => {
      if (data.resultCode == 1) {
        alert(data.message);
        return;
      }
      alert(data.message);
      window.location.href = "dangnhap.html";
    });
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const registerInfor = {
    email: form.loginUsername.value,
    password: form.loginPassword.value,
  };
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerInfor),
  });
  if (!response.ok && response.status == 401) {
    alert(
      "Tài khoản mật khẩu không chính xác, hoặc tài khoản đã bị khóa. Vui lòng liên hệ với admin!"
    );
    return;
  }
  const data = await response.json();
  localStorage.setItem("token", data.token);
  const userId = await getUserId();
  localStorage.setItem("userId", userId);
  if (isAdmin()) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "sanpham.html";
  }
}
async function getProvinces() {
  const provinceSelect = document.getElementById("province-filter");
  let provinces;
  await fetch(`https://esgoo.net/api-tinhthanh/1/0.htm`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi mạng: " + response.status);
      }
      return response.json();
    })
    .then((response) => {
      provinces = response.data.map((province) => ({
        id: province.id,
        name: province.full_name,
      }));
    });
  provinces.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand.id;
    option.textContent = brand.name;
    provinceSelect.appendChild(option);
  });
  const districtSelect = document.getElementById("district-filter");
  provinceSelect.addEventListener("change", async function () {
    districtSelect.innerHTML = '<option value="">Chọn quận huyện</option>';
    const provinceId = this.value;
    if (provinceId) {
      let districts;
      await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi mạng: " + response.status);
          }
          return response.json();
        })
        .then((response) => {
          districts = response.data.map((district) => ({
            id: district.id,
            name: district.full_name,
          }));
        });
      districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.id;
        option.textContent = district.name;
        districtSelect.appendChild(option);
      });
    }
  });
  const wardSelect = document.getElementById("ward-filter");
  districtSelect.addEventListener("change", async function () {
    wardSelect.innerHTML = '<option value="">Chọn phường xã</option>';
    const districtId = districtSelect.value;
    if (districtId) {
      let wards;
      await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi mạng: " + response.status);
          }
          return response.json();
        })
        .then((response) => {
          wards = response.data.map((ward) => ({
            id: ward.id,
            name: ward.full_name,
          }));
        });
      wards.forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.id;
        option.textContent = ward.name;
        wardSelect.appendChild(option);
      });
    }
  });
}
