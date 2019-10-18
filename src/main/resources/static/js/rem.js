(function (win) {
	var docEl = win.document.documentElement;

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		if (width >= 1920) {
			// 最大宽度
			width = 1920;
		}
		var rem = width / 19.2;
		if (rem > 100) {
			rem = 100;
		}
		docEl.style.fontSize = rem + "px";
		if (width < 1366) {
			docEl.style.fontSize = 70 + "px";
		}
	}

	win.addEventListener(
		"resize",
		function () {
			refreshRem();
		},
		false
	);
	win.addEventListener(
		"pageshow",
		function (e) {
			if (e.persisted) {
				refreshRem();
			}
		},
		false
	);
	refreshRem();
})(window);