window.onload = function () {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (token && user) {
    try {
      // access to user data
      user = JSON.parse(user);

      // redirect
      const signinPage = window.location.href.includes("myaccount.html");
      if (signinPage) window.location.replace("/index.html");
      const nav = document.querySelector("#main-navbar");

      // remove my account link
      let found = null;
      nav.childNodes.forEach((node) => {
        if (node.tagName == "LI") {
          node.childNodes.forEach((childNode) => {
            if (childNode.tagName == "A") {
              if (childNode.innerHTML.toLowerCase() == "my account")
                found = node;
            }
          });
        }
      });
      if (found) nav.removeChild(found);
      // user name
      const userA = document.createElement("a");
      userA.href = "#";
      userA.innerHTML = `${user.firstName} ${user.lastName}`;
      const userLi = document.createElement("li");
      userLi.appendChild(userA);
      nav.appendChild(userLi);

      // signout

      const signoutA = document.createElement("a");
      signoutA.href = "#";
      signoutA.innerHTML = `Sign Out`;
      const signOutLi = document.createElement("li");
      signOutLi.appendChild(signoutA);
      signOutLi.onclick = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload();
      };
      nav.appendChild(signOutLi);
    } catch (error) {
      console.error(error);
      return;
    }
  }
};
