let verifyToken = document.querySelector("#token");

document.querySelector("#verifyBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    verificationToken: verifyToken.value,
  };
  fetch(`/verify`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(data),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        document.querySelector("#verifyMsg").innerHTML =
          "Succesfully verified! You can login now";
      }
    })
    .catch((err) => {
      console.error(err.response);
      document.querySelector("#verifyMsg").innerHTML = "Verification failed!";
    });
});
