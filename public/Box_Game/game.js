window.onload = pageLoad;

function pageLoad(){
	document.getElementById("start").onclick = startGame;
	var x = document.getElementById('clock');
	x.innerHTML = 30;
}

var timer = null;

function startGame(){
	alert("Ready");
	addBox();
	timeStart();
}

function timeStart(){
	var TIMER_TICK = 1000;
	var timer = null;
	var min = 0.5; 
	var second = min*60; 
	var x = document.getElementById('clock');
	timer = setInterval(timeCount,TIMER_TICK);

	function timeCount(){
		var allbox = document.querySelectorAll("#layer div");
		second--;
		x.innerHTML = second;
		console.log(allbox.length)

		if(allbox.length === 0){
			alert("Wingame");
			clearScreen();
			x.innerHTML = 30;
			clearInterval(timer);
		}
		else if(second < 0){
			alert("Lose");
			clearScreen();
			x.innerHTML = 30;
			clearInterval(timer);
		}
	}
}

function addBox(){
	// สร้างกล่องตาม input ที่เราใส่ 
	var numbox = document.getElementById("numbox").value;
	var gameLayer = document.getElementById("layer");
	var colorDrop = document.getElementById("color").value;
	for (var i =0; i<numbox;i++){
		var tempbox = document.createElement('div');
		tempbox.className = "square";
		tempbox.classList.add(colorDrop);
		tempbox.id = "box"+i;
		tempbox.style.left = Math.random() * (500 - 25) + "px";
		tempbox.style.top = Math.random() * (500 - 25) + "px";
		//add element to HTML node
		gameLayer.appendChild(tempbox);
		bindBox(tempbox);
	}
}

function bindBox(box){
	//เมื่อกดแล้ว กล่องจะหายไป
	box.onclick = box.remove;
}

function clearScreen(){
	var allbox = 0;

	var allbox = document.querySelectorAll("#layer div");
	for (var i=0;i<allbox.length;i++){
		allbox[i].remove();
	}
}




