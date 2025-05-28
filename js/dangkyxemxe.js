window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("orderId");
  await fetch(`${API_BASE_URL}/orders/account?orderId=${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => {
      console.log("fetch response:", response); // Log toàn bộ response
      if (!response.ok) {
        throw new Error("Lỗi mạng: " + response.status);
      }
      return response.json();
    })
    .then(async (data) => {
      document.getElementById("name").value = data.name;
      document.getElementById("email").value = data.email;
      document.getElementById("phone").value = data.phoneNumber;
    });
  document
    .getElementById("carForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = event.target;
      const schedule = {
        orderId: id,
        scheduledDateTime: form.appointmentdate.value,
        remark: form.remarks.value,
      };
      try {
        const res = await fetch(`${API_BASE_URL}/orders/schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(schedule),
        });
        if (!res.ok) {
          console.log("fetch api not ok");
          return;
        }
        alert("Đăng ký thành công");
        window.location.href = "index.html";
      } catch (err) {
        console.log(err);
      }
    });
};
