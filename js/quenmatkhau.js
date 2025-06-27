document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("btnSubmit")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();

      if (!email) {
        alert("Vui lòng nhập email!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/login/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const message = await res.text();
        if (res.ok) {
          alert("✅ " + message);
        } else {
          alert("❌ " + message);
        }
      } catch (err) {
        alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
        console.error(err);
      }
    });
});
