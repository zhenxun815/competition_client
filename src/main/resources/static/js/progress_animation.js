var $ = null
var count = 0
var total = 11
var timeGap = 500

layui.use(['layer'], function () {
	$ = layui.$
	$(function () {
		setInterval(function () {
			animationFunc()
		}, timeGap)
	})
});

function animationFunc() {
	$(".progress-f").children().css({
		'background': '#7d7d7d',
		'border': '0'
	})
	$.each($(".progress-f").children(), function (index, item) {
		if (count > index) {
			$(item).css({
				'background': '#019E3C',
				'border-top': '1px solid #019E3C',
				'border-right': '1px solid #019E3C',
			})
		}
	})
	if (count > total) {
		$(".progress-end").addClass("green")
	} else {
		$(".progress-end").removeClass("green")
	}
	count = count > total ? 0 : count + 1
}
