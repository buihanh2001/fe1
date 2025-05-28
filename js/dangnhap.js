document.addEventListener("DOMContentLoaded", function () {
  if (isLoggedIn()) {
    window.location.href = document.referrer;
  }
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabToShow = this.getAttribute("data-tab");
      if (tabToShow == "register") {
        document
          .getElementById("login-form")
          .removeEventListener("submit", handleLogin);
        document
          .getElementById("register-form")
          .addEventListener("submit", handleRegister);
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
  const registerInfor = {
    fullName: form.registerFullname.value,
    address: form.address.value,
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
      console.log("fetch response:", response); // Log toàn bộ response
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
  console.log("fetch response:", response); // Log toàn bộ response
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
