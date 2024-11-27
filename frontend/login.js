// Sign-up
const nameRegister = document.querySelector("#registerName");
const emailRegister = document.querySelector("#registerEmail");
const passwordRegister = document.querySelector("#registerPassword");
const registerBtn = document.querySelector("#register");

registerBtn.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3003/users/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameRegister.value,
      email: emailRegister.value,
      password: passwordRegister.value,
    }),
  });

  const isRegistered = await response.json();

  if (isRegistered.result) {
    window.location.assign("index.html");
  }
  nameRegister.textContent = "";
  emailRegister.textContent = "";
  passwordRegister.textContent = "";
});

// Sign-in
const emailConnection = document.querySelector("#connectionEmail");
const passwordConnection = document.querySelector("#connectionPassword");
const connectionBtn = document.querySelector("#connection");

connectionBtn.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3003/users/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailConnection.value,
      password: passwordConnection.value,
    }),
  });

  const isConnected = await response.json();

  if (isConnected.result) {
    window.location.assign("index.html");
  }

  emailConnection.textContent = "";
  passwordConnection.textContent = "";
});
