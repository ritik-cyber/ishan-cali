let name = document.querySelector("#name");
let lastName = document.querySelector("#last-name");
let number = document.querySelector("#phone-number");
let email = document.querySelector("#email");
let password = document.querySelector("#pasw");
let repassword = document.querySelector("#rePassword");

document.querySelector("#signUpBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    firstName: name.value,
    lastName: lastName.value,
    number: number.value,
    email: email.value,
    password: password.value,
  };

  fetch("/register", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("verificationToken", data.verificationToken);
    })
    .catch((err) => console.error(err));
});
