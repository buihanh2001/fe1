document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    alert("Liên kết không hợp lệ hoặc thiếu token!");
  }

  document
    .getElementById("btnSubmit")
    .addEventListener("click", async function (e) {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value.trim();
      if (!newPassword) {
        alert("Vui lòng nhập mật khẩu!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/login/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        });

        const message = await res.text();
        if (res.ok) {
          alert("✅ " + message);
          window.location.href = "dangnhap.html";
        } else {
          alert("❌ " + message);
        }
      } catch (err) {
        alert("Đã xảy ra lỗi.");
        console.error(err);
      }
    });
});
