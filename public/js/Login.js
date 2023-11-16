window.onload = pageLoad;

function pageLoad() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error") == 1) {
		document.getElementById('errordisplay').innerHTML = "Username or password does not match.";
	}
	if (urlParams.get("error") == 2) {
		if (window.location.href.split('/').pop() == "register.html?error=2") {
			document.getElementById('errordisplay').innerHTML = "Username is already use."
		}
	}
	if (urlParams.get("error") == 3) {
		if (window.location.href.split('/').pop() == "register.html?error=3") {
			document.getElementById('errordisplay').innerHTML = "Email is already use."
		}
	}
	if (urlParams.get("error") == 4) {
		if (window.location.href.split('/').pop() == "register.html?error=4") {
			document.getElementById('errordisplay').innerHTML = "Username And Email is already use."
		}
	}
}