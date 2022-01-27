let loginEmail = document.querySelector("#login-email");
let loginPassword = document.querySelector("#login-password");

document.querySelector("#loginBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    email: loginEmail.value,
    password: loginPassword.value,
  };

  fetch("/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      location.reload();
    })
    .catch((err) => console.error(err));
});
