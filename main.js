var data = {
	coins: 0,
	prestiges: [0,0,0,0,0,0,0,0,0,0]
};

var metaBonus = 1;

function resetCheck() {
    if (localStorage.RESET_1) {
        data = {
            coins: 0,
            prestiges: [0,0,0,0,0,0,0,0,0,0]
        };
        localStorage.removeItem("RESET_1");
    }
    return false;
}

function getPPBonus() {
    if (localStorage.PP) {
        let temp = JSON.parse(localStorage.PP).prestiges;
        var out = 1;
        temp.forEach(function (el) {
            out *= 1+el;
        });
        return out;
    }
    return 1;
}

function getGain() {
	var gain = 1;
	data.prestiges.forEach(function (el) {
		gain *= 2+el;
	});
	return gain*metaBonus*getPPBonus();
}

function getRequirement(id) {
	if (id === 0) {
		return Math.floor(Math.pow(1.5,data.prestiges[0])*10);
	} else {
		return Math.pow(id+1,data.prestiges[id]+1);
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (data.coins >= getRequirement(0));
	} else {
		return (data.prestiges[id-1] >= getRequirement(id));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id)) {
			data.coins = 0;
			for (var i = 0; i < id; i++) {
				data.prestiges[i] = 0;
			}
			data.prestiges[id]++;
	}
	draw();
}

function update() {
	//scale the gain by the actual number of seconds since the last update
	const curTime = (new Date()).getTime();
	const deltaTime = (data.lastTime === undefined) ? 1 : ((curTime - data.lastTime) / 1000);
	data.lastTime = curTime;
	data.coins += getGain() * deltaTime;
    resetCheck();
	localStorage.SHITPOST = JSON.stringify(data);
}

function draw() {
	document.getElementById("coins").innerHTML = Math.floor(data.coins);
	document.getElementById("gain").innerHTML = getGain();
	data.prestiges.forEach(function (el, i) {
		document.getElementById("tier"+(i+1)+"cost").innerHTML = getRequirement(i);
		document.getElementById("tier"+(i+1)+"a").innerHTML = el;
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+(i+1);
		if (canActivatePrestige(i)) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
			activatePrestige(i);
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
	});
}

window.addEventListener("load",function () {
	if (localStorage.SHITPOST) {
		data = JSON.parse(localStorage.SHITPOST);
	}
	if (localStorage.META) {
		metaBonus = JSON.parse(localStorage.META).multiForOthers;
	}
	draw();
	for (var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"btn").addEventListener(
			"click",
			(function(n) {
				return (function () {
					activatePrestige(n);
				});
			}(i))
		);
	}
	setInterval(function () {
		update();
		draw();
	}, 1000);
	console.log("interval loaded");
});
