const socket = io();
let username = "";

function join() {
  username = document.getElementById("username").value;
  if (!username) return;

  document.getElementById("login").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");
}

function send() {
  const msg = document.getElementById("msg").value;
  if (!msg) return;

  socket.emit("message", {
    user: username,
    text: msg
  });

  document.getElementById("msg").value = "";
}

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.innerHTML = `<b>${data.user}:</b> ${data.text}`;
  document.getElementById("messages").appendChild(div);
});

function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    socket.emit("message", {
      user: username,
      text: `📎 File: <a href="/uploads/${data.file}" download>${data.original}</a>`
    });
  });
}
