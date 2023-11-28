function checkCookie() {
  var username = "";
  if (getCookie("username") == false) {
    document.cookie = "username=Guest";
    document.cookie = "img=avatar.png";
  }
}

checkCookie();
window.onload = pageLoad;

function getCookie(name) {
  var value = "";
  try {
    value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name))
      .split("=")[1];
    return value;
  } catch (err) {
    return false;
  }
}

async function pageLoad() {
  if (getCookie("username") == "Guest") {
    document.getElementById("username").innerText = 'Guest';
  }

  toggleElement();
  document.getElementById("displayPic").onclick = fileUpload;
  document.getElementById("fileField").onchange = fileSubmit;

  var username = getCookie("username");

  document.getElementById("username").innerHTML = username;
  showImg("img/" + getCookie("img"));
}

function toggleElement() {
  var loginAndRegisterButton = document.getElementById("RegisterAndLoginButton");
  var logoutButton = document.getElementById("LogoutButton");
  if (getCookie("username") != "Guest") {
    loginAndRegisterButton.style.display = "none";
    logoutButton.style.display = "block";
  }
  else {
    loginAndRegisterButton.style.display = "block";
    logoutButton.style.display = "none";
  }
}

async function getData(tablename, textmsg) {
  var msg = document.getElementById(textmsg).value;
  document.getElementById(textmsg).value = "";
  await writePost(msg, tablename);
  await readPost(tablename);
}

function fileUpload() {
  document.getElementById("fileField").click();
}

function fileSubmit() {
  document.getElementById("formId").submit();
}

function showImg(filename) {
  if (filename !== "") {
    var showpic = document.getElementById("displayPic");
    showpic.innerHTML = "";
    var temp = document.createElement("img");
    temp.src = filename;
    showpic.appendChild(temp);
  }
}


