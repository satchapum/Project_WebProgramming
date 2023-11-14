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

  // document.getElementById("postbutton").onclick = getData;
  toggleElement();
  document.getElementById("displayPic").onclick = fileUpload;
  document.getElementById("fileField").onchange = fileSubmit;

  var username = getCookie("username");

  document.getElementById("username").innerHTML = username;
  console.log(getCookie("img"));
  showImg("img/" + getCookie("img"));
  // readPost();
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
  console.log(tablename);
  console.log(textmsg);
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

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename) {
  if (filename !== "") {
    var showpic = document.getElementById("displayPic");
    showpic.innerHTML = "";
    var temp = document.createElement("img");
    temp.src = filename;
    showpic.appendChild(temp);
  }
}

// complete it
async function readPost(tablename) {
  let response = await fetch("/readComment");
  let content = await response.json();
  showPost(content);
}

// complete it
async function writePost(msg, tablename) {
  let response = await fetch("/writeComment", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: getCookie("username"),
      message: msg,
      tablename: tablename,
    }),
  });
}

// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
function showPost(data) {
  var keys = Object.keys(data);
  var divTag = document.getElementById("feed-container");
  divTag.innerHTML = "";
  for (var i = keys.length - 1; i >= 0; i--) {
    var temp = document.createElement("div");
    temp.className = "newsfeed";
    divTag.appendChild(temp);
    var temp1 = document.createElement("div");
    temp1.className = "postmsg";
    temp1.innerHTML = data[keys[i]]["post"];
    temp.appendChild(temp1);
    var temp1 = document.createElement("div");
    temp1.className = "postuser";

    temp1.innerHTML = "Posted by: " + data[keys[i]]["username"];
    temp.appendChild(temp1);
  }
}

