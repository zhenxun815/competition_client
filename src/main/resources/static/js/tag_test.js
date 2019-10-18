// 只有这个值为true 测试专用过滤器才会生效
var testResultFlag = true
// if (typeof testResultFlag === "boolean" && testResultFlag) {
var threshold_value = true
var result_type_value = true
// Flag: 管理是否显示AI计算结果
// true显示
var AIViewFlag = true
var jsColorFlag = false
var baseColor = "#ff0000"
// }

// 测试页面关闭键盘事件
keyboardFlag = false

// 覆写 过滤器
function initPointFilterB(arr) {
	// console.log("test")
	var filters = function (obj) {
		if (AIViewFlag && threshold_filter(obj) && type_filter(obj)) {
			return true
		} else {
			return false
		}
	}
	var threshold_filter = function (obj) {
		if (threshold_value === true) {
			return true
		} else {
			// 阈值筛选
			if (!obj.score || isNaN(parseFloat(obj.score)) || parseFloat(obj.score) < threshold_value) {
				return false
			} else {
				return true
			}
		}
	}
	var type_filter = function (obj) {
		if (result_type_value === true) {
			return true
		} else {
			// 分类筛选
			for (var i in result_type_value) {
				if (result_type_value[i] === obj.typeName) {
					return true
				}
			}
			return false
		}
	}
	var new_arr = []
	var new_circle_func = function (obj) {
		var o = {}
		for (var i in obj) {
			if (i === "circle") {
				o[i] = objectCopy(obj[i])
			} else {
				o[i] = obj[i]
			}
		}
		return o
	}
	arr.forEach(function (item, index) {
		// 此处需要根据实际情况写判定条件
		// 比如 分类和阈值符合要求
		if (filters(item)) {
			new_arr.push(new_circle_func(item))
		}
	})
	return new_arr
}

// 覆写 换页时需要变更颜色
function change_page_func() {
	// 换图和多边形
	initPoint(jsarray, mark_image_index); // 修改SVG宽高

	var the_new_image_now_width = jsarray[mark_image_index].imgNowWidth;
	var the_new_image_now_height = jsarray[mark_image_index].imgNowHeight;
	change_svg_size(the_new_image_now_width, the_new_image_now_height); // 修改用户看到的图片序列信息|左上角

	getNowImageIndexFunc(mark_image_index);

	color_setting(baseColor)
};

// 需要对SVG对象上的方法进行部分覆写
function color_setting(color) {
	var polygon = $(mysvg).find("polygon")
	var circle = $(mysvg).find("circle")
	polygon.css({
		'stroke': color
	})
	circle.css({
		'stroke': color
	})
	polygon.each(function () {
		this.setAttribute("style", "fill:pink;stroke:" + color + ";stroke-width:1;fill-opacity:0.0;");
		this.onmouseover = function (event) {
			tip.start(this)
			this.setAttribute("style", "fill:pink;stroke:" + color + ";stroke-width:1.5;fill-opacity:0.0;");
		}
		this.onmouseout = function (event) {
		}
		this.onmouseleave = function (event) {
			this.setAttribute("style", "fill:pink;stroke:" + color + ";stroke-width:1;fill-opacity:0.0;");
		}
	})
}

function layuiInitFunc() {
	// 蓝色小三角
	$(".blue-tri").click(function () {
		toggleClassFunc(this)
		if ($(this).hasClass("active")) {
			$(this).parent().addClass("height-auto")
		} else {
			$(this).parent().removeClass("height-auto")
		}
	})
	// 蓝色信息小图标
	bindInfomationTipsFunc()
	// 缩放图片
	$("#t_r_btn_a").click(function () {
		toggleClassFunc(this)
		if ($("#t_r_btn_a").hasClass("active")) {
			$("#" + svg_father_id).smartZoom({
				'left': '0px',
				'top': '0px',
				'dblClickEnabled': false,
				'mouseMoveEnabled': false
			});
		} else {
			unbundZoom()
		}
	})
	// 保存图片
	$("#t_r_btn_b").click(function () {
		saveImageFunc(initPointFilterA(jsarray[mark_image_index]))
	})
	// 更换颜色
	$("#t_r_btn_c").click(function () {
		document.getElementById('my_color').jscolor.show()
	})
	$("#my_color").change(function () {
		if (typeof baseColor === "string") {
			var color = $(this).val()
			baseColor = "#" + color
			color_setting(baseColor)
		}
	})
	// 隐藏AI标注
	$("#t_r_btn_d").click(function () {
		toggleClassFunc(this)
		// saveImageFunc(initPointFilterA(jsarray[mark_image_index]))
		if (typeof AIViewFlag === "boolean") {
			AIViewFlag = !AIViewFlag
			initPointCore(initPointFilterA(jsarray[mark_image_index]))
			color_setting(baseColor)
		}
	})
	// 阈值滑块
	sliderEle = layui.slider.render({
		elem: '#demo_slider',
		min: 0 //最小值
		,
		max: 100 //最大值
		,
		step: 1,
		change: function (value) {
			console.log(new Date().getTime())
			// if (typeof testResultFlag === "boolean" && testResultFlag) {
			// 分类阈值
			// console.log("阈值")
			threshold_value = value
			initPointCore(initPointFilterA(jsarray[mark_image_index]))
			color_setting(baseColor)
			// }
		}
	});
	// checkbox
	// 全选
	layui.form.on('checkbox(c_all)', function (data) {
		var a = data.elem.checked;
		if (a == true) {
			$(".cityId").prop("checked", true);
			layui.form.render('checkbox');
		} else {
			$(".cityId").prop("checked", false);
			layui.form.render('checkbox');
		}
		enterFilter()
	});
	layui.form.on('checkbox(c_other)', function (data) {
		var city = $(".cityId")
		var boolean_arr = []
		city.each(function () {
			boolean_arr.push($(this).prop("checked"))
		})
		for (var i = 0; i < boolean_arr.length; i++) {
			var bool = boolean_arr[i]
			if (!bool) {
				$(".cityAll").prop("checked", false);
				break
			} else if (i === (boolean_arr.length - 1) && bool) {
				$(".cityAll").prop("checked", true);
			}
		}
		layui.form.render('checkbox');
		enterFilter()
	});
}

function bindInfomationTipsFunc() {
	var template_tips = `<div class="box">
  <span class="common-inline-block">
    阳性：
  </span>
  <span class="common-inline-block">
    肺炎200，肺结核300，肋膈角钝化300，斑片影450，结节影219.
    肺炎200，肺结核300，肋膈角钝化300，斑片影450，结节影219.
    肺炎200，肺结核300，肋膈角钝化300，斑片影450，结节影219.
  </span>
</div>
<div class="box">
  <span class="common-inline-block">
    阴性：
  </span>
  <span class="common-inline-block">
    双桥阴性1000，北体检阴性2000，新疆阴性500...
  </span>
</div>`
	var t = $("#infomation")
	layui.each(t, function (index, item) {
		$(item).on("mouseover", function () {
			layer.open({
				content: [template_tips, this],
				shade: 0,
				tips: 4,
				type: 4,
				area: ['220px'],
				skin: 'my-tips-b',
				offset: ['0px', '0px'],
				time: 0
			})
		})
		$(item).on("mouseout", function () {
			layer.closeAll('tips');
		})
	})
}

function saveImageFunc(saveData) {
	// 这个函数需要放入数组参数 所以写法有点特殊
	parseCoorFunc([saveData], [dataToSubmitModelMultipleNumber[mark_image_index]]);
	var tagJson = JSON.stringify(saveData);
	var re = {
		caseId: networkImagePageData.caseId,
		// overTag:x,
		tagJson: tagJson
	};

	saveImageCoreFunc(re)
}

// todo
// 保存图片|前端ALERT，客户端接收并调接口
function saveImageCoreFunc(re) {
	console.log(re)
	alert("保存图片")
}

function enterFilter() {
	if (typeof testResultFlag === "boolean" && testResultFlag) {
		// 分类阈值
		// console.log("分类")
		var m = $(".cityId")
		var arr = []
		m.each(function () {
			// var id = $(this)[0].dataset.id
			var title = $(this)[0].getAttribute("title")
			var bool = $(this).prop("checked")
			if (bool) {
				arr.push(title)
			}
		})
		result_type_value = arr
		initPointCore(initPointFilterA(jsarray[mark_image_index]))
		color_setting(baseColor)
	}
}

function BEFORE_DESTORY_FUNC() {
	reload_painting_when_image_change_func()
	tagFlag = false;
	unbundZoom()
	$("#mark_mark").removeClass("active")
	reload_painting_data_func()
	$("#t_r_btn_a,#t_r_btn_b,#t_r_btn_c,#t_r_btn_d").removeClass("active")
	$(".cityId, .cityAll").prop("checked", true);

	sliderEle.setValue(0);

	threshold_value = true
	result_type_value = true
	AIViewFlag = true
	jsColorFlag = false
}

function MOUNTED_FUNC(A) {
	calcViewPortSizeFunc(localViewPortSize)

	console.log(localViewPortSize)

	var img_arr = A;
	var img_arr_single = A[0]; // natural 图片原始宽高 | object

	var imageNaturalSize = [];
	img_arr.forEach(function (item) {
		imageNaturalSize.push({
			width: item.imgWidth,
			height: item.imgHeight
		});
	});

	console.log(imageNaturalSize)

	img_arr.map(function (item, index) {
		imageInitialDisplaySize[index] = {};
		calcImageDisplaySizeFunc(imageNaturalSize[index], localViewPortSize, imageInitialDisplaySize[index], index);
	});

	console.log(imageInitialDisplaySize)

	parseCoorFunc(img_arr, dataToSubmitModelMultipleNumber);
	jsarray = A;
	mark_image_length = A.length;
	mark_image_init_func(jsarray, mark_image_index);
	// 设置SVG宽高
	change_svg_size(img_arr_single.imgNowWidth, img_arr_single.imgNowHeight)

	// smartzoom
	// 切图事件
	$("#" + svg_father_id).unbind("mousewheel")
	$("#" + svg_father_id).bind("mousewheel", function (event, delta) {
		tagMousewheel(event, event.originalEvent.deltaY);
	});
	$(document).unbind();
	$(document).keydown(function (event) {
		otherButtonClickHandler(event)
		if (tagFlag == true) {
			moveButtonClickHandler(event);
		}
	});
	getNowImageIndexFunc()

	$("#delete").bind("click", function (event) {
		deletePolygon()
	});

	$(".mark-enter").unbind("click");
	$(".mark-enter").bind("click", function (event) {
		changeMarkTypeFunc(3)
		event.stopPropagation()
	});

	$("#mark_polygon, #mark_rect").unbind("click");
	$("#mark_polygon").bind("click", function (event) {
		markFashionStringChangeFunc('polygon')
		event.stopPropagation()
	});
	$("#mark_rect").bind("click", function (event) {
		markFashionStringChangeFunc('rect')
		event.stopPropagation()
	});

	// 第一次不会进来
	if (layui && layui.form) {
		layui.form.render()
	}

	// 颜色
	color_setting(baseColor);
}