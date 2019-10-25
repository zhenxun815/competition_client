// ********************************
// image array
// 从接口获取到的标注数据都在这里面
var jsarray = [];


// var svgId = 'svg_my';
// svg 标签的id
var svgId
// svg 的父元素div 的标签的 id
// var svg_father_id = 'svg_my_father';
var svg_father_id
// var mysvg = document.getElementById(svgId);
// 提前 getElementById 便于获取svg DOM
var mysvg

// 能否标注开关 true 可以标注
var tagFlag = false;

// 是否闭合开关 true 已闭合
var endFlag = true;
// 是否移动开关 true 正在移动 false 不移动
var movePoint = false;
// 图片总数量
var allNum = 0;
// 图片序列的 index
var dnum = 0;
// 存储正在编辑的多边形的点
var tagPoints = [];
// 存储正在编辑的多边形的线
var tagLines = [];
// 当前图片的id
var dImgId = null;
// 选中的分类树的id
var typeId = null;
// 选中的分类树的名称
var typeName = null;

// EDIT ===>>> 0826
// 准备删除的分类树的id
var deleteTypeId = ""
// 准备删除的分类树的名称
var deleteTypeName = ""
// EDIT ===>>> END

// EDIT ===>>> 0830
// 右键多边形的时候需要把模型分类id存一下
var modelTypeId = ""
// 右键多边形的时候需要把模型分类id存一下
var modelTypeName = ""
// EDIT ===>>> END
// 蓝色文字提示 tip
var t = null;

// 右键菜单（删除 变更分类） 都用这个
var delPolygon = null;
// 能不能添加点 | 右键菜单激活是不能添加点
var addPointFlag = true;

// QT
// 图片序列的 index
var mark_image_index = 0
// 图片序列的长度
var mark_image_length = 0
// EDIT ===>>> 0823
// jsarray.imgArray 需要事先声明时数组
var imgArray = new Array()
// EDIT ===>>> END
// 图片onload手动计数
var image_onload_index = 0

// EDIT ===>>> 0506
// 最新的一次鼠标移动事件
var the_last_mouse_event = null
// EDIT ===>>> END
// EDIT ===>>> 0512
// 预先声明延时函数
var the_timeout_func = null
// 图片error手动计数
var image_error_index = 0
// EDIT ===>>> END
// EDIT ===>>> 0515
// 废弃
var is_touch_line = false
// 右键闭合时的时间戳
var complete_painting_right_timestamp = 0
// EDIT ===>>> END
// EDIT ===>>> 0520
// 矩形临时点 存储正在编辑的
var tagPoints_rect = [];
// 矩形临时线 存储正在编辑的
var tagLines_rect = [];
// EDIT ===>>> END
// EDIT ===>>> 0624

// var now_tag_type = null
// 已经废弃的变量
var circleDatasMarkedNumber = 0
// var markFashionString = "polygon"
// 现在是矩形还是多边形？理论上一定是 polygon rect 其中一个
var markFashionString
// 存储图片缩放比例的数组
var dataToSubmitModelMultipleNumber = [1]
// 可以存储接口返回的数据（主要是分页的）| 用不上
var networkImagePageData = {}
// 现在读取的图片序列的长度 | 现在读取的图片序列不等于总共的图片序列
var imageTotalNumber = 0
// 已废弃
var imageLoadStatus = false
// 读取界面是否显示 | 已废弃
var loadingModalDisplayBoolean = false
// 现在读取的图片序列读取到第几个了
var imageNowNumber = 0
// 标注按钮状态变量 激活是3 不激活是0
var markButtonLightIndex = 0
// 能不能使用键盘
var keyboardFlag = true
// 存储当前视区宽高的对象
var localViewPortSize = {}
// 数组，里面的一个对象是一张图片应该显示在视区里的宽高
var imageInitialDisplaySize = [{}]
// 暂时不需要
var typeTid = null
// 图片是否读取完 | 已废弃
var imageLoadFlag = false
// 存储序列中的图片标注数量的对象
// key 图片id value框的标注数量
var imageMarkObject = {}
// 跳当前页还是下一页　废弃
var nextPageFlag = true

/* 
当前图片载入序列的count
initimage() [First] count = 0
load() count++
if (count === 10) {
  // 执行下一次initimage
}
*/
var image_load_count = null
/* 
当前预备进入图片载入序列的jsarray部分集合的起始终止index
initimage() [Last] index[0]+=10 index[1]+=10
*/
// 现在设为10 意为一次读取10张 可以改成别的数字 但是需要测试是否正常
var image_load_length = 10
// 序列读取数组
// 比如 第一次[0,10] 第二次[10,20]
// 但因为for循环 其实读取序列是 第一次[0,9] 第二次[10,19]
var image_load_index_array = [0, image_load_length]
// 移动点用 | 暂时用不上
var dpoint = null
// 病例里标注且保存了的图形数量 | 暂时用不上
var circleDatasMaSNumber = 0

// 原本在测试里面的
// var baseColor = "#ff0000"
// 标注框颜色
var baseColor
// EDIT ===>>> 0904
// var wordColor = "#ff0000"
// 提示文字颜色
var wordColor
// 提示文字字体字号
var tipFont = {
	fontSize: '14px',
	lineHeight: '16px',
	fontWeight: '400'
}
// 点的大小
// 分别是 一般 第一个点 触摸放大时
var pointSizeArray = [1.5, 3, 6]
// 线点偏差值 | 需要线和点有一定距离防止点不到起始点
var pointOffOffset
// EDIT ===>>> END
// 过滤器变量|阈值
var threshold_value = 20
// 过滤器变量|标签分类
var result_type_value = true
// 过滤器变量|模型分类
var model_type_value = true

// 存储分类标了多少个的对象
var type_mark_count_object = {}
// 加框 还是 删框？
// 加 1 删 -1
var addOrSubNumber = 1

// EDIT ===>>> 0830
// 权限旗子
var permissionFlag = true
// EDIT ===>>> END

// EDIT ===>>> 0826
// 只需要渲染一次的那些东西是否渲染过了
var mountedOnceFlag = true
// EDIT ===>>> END

// var SynchronizationArray = []
// 识别转标注用的数组
var saveSynchronizationArray = []
// 绘制历史纪录的颜色
var historyColor = "blue"
// toggle 值 | true时点击历史按钮显示历史 false时点击历史按钮清除历史
var historyFlag = true

// QT END

// var mousewheelFlag = true;

// EDIT ===>>> 0912
// 变矩形的点时应该怎么变?
/*
第一层 index 指的是 驱动点第几个点
第二层 index 指的是 x or y
第二层 value 指的是 执行点第几个点
例子：
当点 0 变的时候
点 0 x y 都变
点 3 x 变
点 1 y 变
[
  ['x', 'y']
  ['x', 'y']
  ['x', 'y']
  ['x', 'y']
]
*/
var change_rect_map_array = [
	[3, 1],
	[2, 0],
	[1, 3],
	[0, 2],
]
// map 点和框的关系
var circle_to_polygon_map = {}
// map 框的id和SVG实体的关系
var polygon_id_to_svg_map = {}
// EDIT ===>>> END

// --------------------------------
// ********************************

// EDIT ===>>> 20190624
/**
 * 把挂在window对象下的tag数据提出来
 * @param {Void}
 * @returns {Void}
 */
function reload_painting_data_func() {
	// alert("?")

	for (var i = 0; i < imgArray.length; i++) {
		imgArray[i].removeEventListener('load', loadOrErrorFunc_load, false)
		imgArray[i].removeEventListener('error', loadOrErrorFunc_error, false)
		imgArray[i] = null

	}
	imgArray = new Array()

	// EDIT ===>>> 0902
	tip.html = ""
	tip.top_offset = -20
	tip.mjs_tip_offset = 0
	// EDIT ===>>> END

	imageLoadFlag = false

	// 解除事件绑定
	$("#" + svg_father_id).smartZoom('destroy');
	$("#delete").unbind()
	// $("#" + svg_father_id).unbind()

	// _this = null

	jsarray = [];

	// ********************************
	// svgId = 'svg_my';
	tagFlag = false; // 能否标注开关 true 可以标注
	// mysvg = document.getElementById(svgId);

	endFlag = true; // 是否闭合开关 true 已闭合
	movePoint = false;
	//图片总数量
	allNum = 0;
	dnum = 0;
	tagPoints = [];
	tagLines = [];
	dImgId = null;
	// === 这两个值是svg原点与窗口原点的距离，必须正确设置才能得到正确的标注 ===
	// left 距离视窗左边
	// 宽度是 1366时 这个值为 413
	// leftX = parseInt((window.innerWidth - 1200) / 2) + 330;
	// top 距离视窗上边
	// topY = 0
	// === 这两个值是svg原点与窗口原点的距离，必须正确设置才能得到正确的标注 ===
	// typeId = null;
	// typeName = null;

	t = null; // 蓝色文字提示 tip
	delPolygon = null;
	addPointFlag = true; // 能不能添加点 | 右键菜单激活是不能添加点

	// QT
	mark_image_index = 0
	mark_image_length = 0

	// for (var i = 0; i < imgArray.length; i++) {
	//   imgArray[i].removeEventListener('load', loadOrErrorFunc_load, false)
	//   imgArray[i].removeEventListener('error', loadOrErrorFunc_error, false)
	//   imgArray[i] = null
	// }
	// imgArray = null

	image_onload_index = 0 // 图片onload手动计数
	// svg_father_id = 'svg_my_father';
	// EDIT ===>>> 0506
	// 最新的一次鼠标移动事件
	the_last_mouse_event = null
	// EDIT ===>>> END
	// EDIT ===>>> 0512
	the_timeout_func = null
	image_error_index = 0
	// EDIT ===>>> END
	// EDIT ===>>> 0515
	is_touch_line = false // 废弃
	complete_painting_right_timestamp = 0 // 右键闭合时的时间戳
	// EDIT ===>>> END
	// EDIT ===>>> 0520
	tagPoints_rect = []; // 矩形临时点
	tagLines_rect = []; // 矩形临时线
	// EDIT ===>>> END
	// now_tag_type = null;
	circleDatasMarkedNumber = 0
	// 根据需求不再重置这个变量
	// markFashionString = "polygon"
	dataToSubmitModelMultipleNumber = [1]
	networkImagePageData = {}
	// jqContextMenuOffsetLeftNumber = (leftX - parseInt((window.innerWidth - 1200) / 2)) + 20
	imageTotalNumber = 0
	imageLoadStatus = false
	loadingModalDisplayBoolean = false
	imageNowNumber = 0
	// 根据需求不再重置这个变量
	// markButtonLightIndex = 0
	keyboardFlag = true

	localViewPortSize = {}
	imageInitialDisplaySize = [{}]

	typeTid = null

	imageMarkObject = {}

	circleDatasMaSNumber = 0

	image_load_count = null
	image_load_index_array = [0, image_load_length]

	result_type_value = true
	model_type_value = true

	type_mark_count_object = {}
	// QT END
}

// 右键菜单
// document.oncontextmenu = function (event) {
//   event.preventDefault();
// };

/**
 * 深拷贝
 * @param {Object} Object
 * @returns {Object} Object
 */
//
function objectCopy(obj) {
	var newobj = obj.constructor === Array ? [] : {};
	if (typeof obj !== 'object') {
		return;
	}
	for (var i in obj) {
		newobj[i] = (typeof obj[i] === 'object' && !(obj[i] === null)) ?
			this.objectCopy(obj[i]) : obj[i];
	}
	return newobj
}

// EDIT ===>>> 20190514
/**
 * 按键wsad对应上下左右移动图片进行查看
 * @param {Object} Event 事件对象
 * @returns {Void}
 */
function moveButtonClickHandler(e) {
	if (tagFlag) {
		var pixelsToMoveOnX = 0;
		var pixelsToMoveOnY = 0;

		switch (e.keyCode) {
			case 90: //左z
				pixelsToMoveOnX = 200;
				break;
			case 67: //右c
				pixelsToMoveOnX = -200;
				break;
			case 83: //上s
				pixelsToMoveOnY = 200;
				break;
			case 88: //下x
				pixelsToMoveOnY = -200;
				break;
		}
		if (pixelsToMoveOnX != 0 || pixelsToMoveOnY != 0)
		// smartzoom
		//   $('#'+svgId).smartZoom('pan', pixelsToMoveOnX, pixelsToMoveOnY);
			$('#' + svg_father_id).smartZoom('pan', pixelsToMoveOnX, pixelsToMoveOnY);
	}
}

// EDIT ===>>> END

/**
 * 加点
 * @param {Number} x circle.x
 * @param {Number} y circle.x
 * @param {String} imgId 图片ID
 * @param {String} id imgArray[i].imgID
 * @returns {Object} rectObj 多边形对象
 */
function addPoint(x, y, imgId, id) {
	/*
	  点的大小
	  一般的点 1.5
	  第一个点 3
	  第一个点放大 6
	*/
	var point_size_arr = pointSizeArray

	// alert("addPoint")
	// console.log("addPoint")
	// EDIT ===>>> 0515
	var is_new = false
	// EDIT ===>>> END
	if (id == null) {
		id = uuid(32, 16);
		// EDIT ===>>> 0515
		is_new = true
		// EDIT ===>>> END
	}
	var rectObj = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	if (rectObj) {
		rectObj.setAttribute("cx", x);
		rectObj.setAttribute("id", id);
		rectObj.setAttribute("imgId", imgId);
		rectObj.setAttribute("cy", y);

		//points.push({index: index,x:x, y:y});
		// rectObj.setAttribute("r", 4);
		// EDIT ===>>> 0515
		// 1 只在画的时候变大，回显是和以前一样
		// 2 只有第一个点变大
		// 变大的 3 6 普通的 1.5 1.5
		// rectObj.setAttribute("r", 1.5);
		// console.log(is_new)
		// console.log(tagPoints.length)
		// alert(is_new)
		if (is_new && tagPoints.length === 0) {
			rectObj.setAttribute("r", point_size_arr[1]);

			// console.log(point_size_arr[1])
		} else {
			rectObj.setAttribute("r", point_size_arr[0]);

			// console.log(point_size_arr[0])
		}


		// EDIT ===>>> END

		rectObj.setAttribute("style", "fill:" + baseColor + ";stroke-width:1;stroke:" + baseColor + "");
		mysvg.appendChild(rectObj);
		//为每个圆形添加事件绑定
		rectObj.onmouseover = function () {
			// console.log("onmouseover")
			if (tagFlag) {
				// EDIT ===>>> 0515
				// 1 只在画的时候变大，回显是和以前一样
				// 2 只有第一个变大
				// 变大的 3 6 普通的 1.5 1.5
				// EDIT ===>>> END


				// 鼠标触摸上去时圆形的大小需要根据此时的放大倍率进行计算
				// smartzoom
				// var str = $("#" + svgId).css("transform").split("(")[1].split(")")[0].split(",");
				// console.log(str)
				// str[0] : scale

				// console.log("3")

				addPointFlag = false;
				var that = this; //保留事件源的引用
				// var r = that.getAttribute('r');
				// r=10; //隐式的浮点数解析
				// r = (10 / parseFloat(str[0])).toFixed(2)
				// that.setAttribute('r', r)

				// EDIT ===>>> 0515
				if (tagPoints.length > 0 && tagPoints[0].id === that.id) {
					var r = that.getAttribute('r');
					r = point_size_arr[2]
					that.setAttribute('r', r)
				}
				// EDIT ===>>> END

			}
		}
		rectObj.onmouseout = function () {
			if (tagFlag) {
				// console.log(1)
				// console.log("4")
				addPointFlag = true;
				var that = this; //保留事件源的引用
				var r = that.getAttribute('r');
				// r = 4; //隐式的浮点数解析
				// EDIT ===>>> 0515
				// console.log(is_new)
				// console.log("===onmouseout===")
				// console.log(is_touch_line)

				if (tagPoints.length > 0 && tagPoints[0].id === that.id) {
					r = point_size_arr[1]
				}

				// if (is_new && tagPoints.length === 1) {
				// r = 3
				// } else {
				// r = 1.5
				// }
				// r = 1.5; //隐式的浮点数解析
				// EDIT ===>>> END
				that.setAttribute('r', r)
			}
		}
		rectObj.onmousedown = function (event) {
		}
		rectObj.onmousemove = function (event) {
			var that = this; //保留事件源的引用
		}
		rectObj.onmouseup = function (event) {
			var that = this; //保留事件源的引用
		}
		rectObj.onclick = function (event) {
			// console.log("双击")

			// console.log(tagPoints.length)
			// console.log(tagPoints_rect.length)
			// console.log(new Date().getTime())

			// EDIT ===>>> 0624
			// alert(now_tag_type)
			// if (now_tag_type == 'polygon') {

			// alert(markFashionString)

			if (markFashionString == "polygon") {
				complete_painting_func('dblclick')
			}
			// }
			// complete_painting_func('dblclick')
			// EDIT ===>>> END


		}
	}
	return rectObj;
}

// SVG 文字
// SVG 文字
var tip = {
	// EDIT ===>>> 0830
	// html字符串
	html: "",
	// tip 位置垂直偏移量
	top_offset: -20,
	// tip 位置水平偏移量 | 暂时用不上
	mjs_tip_offset: 0,
	// EDIT ===>>> 0906
	/**
	 * 变更 tip 内容的方法
	 * @param {String} br 现在用<br>分隔 也可以用别的
	 * @param {String} typeName 分类名称
	 * @param {String} modelTypeName 模型分类名称
	 * @returns {Void}
	 */
	changeContentFunc: function (br, typeName, modelTypeName) {
		// 装对象
		var type_obj = {
			typeName: typeName,
			modelTypeName: modelTypeName
		}
		// ok_type type or model
		var ok_type = 'type'
		// 对象转数组
		var type_arr = (function (obj) {
			// var count = 0
			// console.log(obj)
			var arr = []
			for (var i in obj) {
				// console.log(obj[i])
				if (typeof obj[i] === "string" && obj[i].length > 0 && obj[i] !== "null") {
					if (i === 'modelTypeName') {
						ok_type = 'model'
					}
					// count++
					arr.push(obj[i])
				}
			}
			return arr
		})(type_obj)
		// 通过 [].length 和 ok_type 的不同输出相应的字符
		if (type_arr.length > 1) {
			return '标注分类 : ' + type_obj.typeName + br + '模型分类 : ' + type_obj.modelTypeName
		} else if (type_arr.length === 1) {
			return (ok_type === 'type' ? '标注' : '模型') + '分类 : ' + (ok_type === 'type' ? type_obj.typeName : type_obj.modelTypeName)
		} else {
			return ""
		}
	},
	/**
	 * 把新的内容渲染到视图上
	 * @param {String} html html字符串
	 * @returns {Void}
	 */
	renderContentFunc: function (html) {
		t = this.$("mjs:tip");
		t.innerHTML = html;
	},
	// EDIT ===>>> END
	/**
	 * 获取DOM
	 * @param {String|Number|Object} html html字符串
	 * @returns {Void}
	 */
	$: function (ele) {
		if (typeof (ele) == "object")
			return ele;
		else if (typeof (ele) == "string" || typeof (ele) == "number")
			return document.getElementById(ele.toString());
		return null;
	},
	/**
	 * 获取坐标对象
	 * @param {Object} Event 事件对象
	 * @returns {Object} Coor 坐标对象
	 */
	mousePos: function (e) {
		var x, y;
		var e = e || window.event;
		return {
			x: e.pageX,
			y: e.pageY,
		}
	},
	/**
	 * tip 初始化
	 * @param {Object} SVG 多边形对象
	 * @returns {Void}
	 */
	start: function (obj) {
		var self = this;
		// 获取tip DOM
		t = self.$("mjs:tip");

		// EDIT ===>>> 20190711
		// 获取SVG中存的值
		var typeName = obj.getAttribute("typeName")
		var modelTypeName = obj.getAttribute("modelTypeName")
		// 更新 this.html
		self.html = self.changeContentFunc('<br>', typeName, modelTypeName)
		// this.html 有或没有<br> 需要留的高度不一样
		var match_test = self.html.indexOf("<br>")
		if (match_test !== -1) {
			self.top_offset = -40
		} else {
			self.top_offset = -20
		}
		self.mjs_tip_offset = mjs_tip_offset
		// 更新样式
		updateDOMStyle(t, {
			'display': 'block',
			'color': 'red',
			'font-size': '14px',
			'font-weight': '400',
			'z-index': '2',
			'line-height': '16px'
		})
		// EDIT ===>>> END

		// 在多边形事件里加上tip相关内容
		obj.onmousemove = function (e) {

			// console.log(html)

			// EDIT ===>>> 20190711
			// 正在标注时不出提示
			if (endFlag) {

				// alert(endFlag)
				var mouse = self.mousePos(e);
				t.innerHTML = self.html;
				// left 需要加上 leftX
				updateDOMStyle(t, {
					'display': 'block',
					'left': mouse.x + 'px',
					'top': mouse.y + self.top_offset + 'px'
				})
			}
			// EDIT ===>>> END

		};
		// 多边形onmouseout事件
		obj.onmouseout = function () {
			var color = baseColor
			if (obj.dataset && obj.dataset.history && obj.dataset.history === "history") {
				color = historyColor
			}

			t.style.display = 'none';

			obj.setAttribute("style", "stroke:" + color + ";stroke-width:1;fill-opacity:0.0;");
		};
	}
}

/**
 * 添加多边形方法
 * @param {Array} pointSet 临时点对象的数组
 * @param {String} imgId 图片ID
 * @param {String} typeId 分类ID
 * @param {String} typeName 分类名称
 * @param {String} polygonId 多边形ID
 * @param {String} type svgtype polygon多边形 or rect矩形
 * @param {String} modelTypeId 模型分类ID
 * @param {String} modelTypeName 模型分类名称
 * @returns {Object} SVG 多边形对象
 */
function addPolygon(pointSet, imgId, typeId, typeName, polygonId, type, modelTypeId, modelTypeName) {

	var canSubmitFlag = false

	// modelTypeId modelTypeName 可能没有
	if (typeof modelTypeId !== "string") {
		modelTypeId = ""
	}
	if (typeof modelTypeName !== "string") {
		modelTypeName = ""
	}


	// if (type) {
	//   now_tag_type = type
	// } else {
	//   now_tag_type = null
	// }


	var addArFlag = false;
	// 给添加的图形建一个ID
	if (polygonId == null) {
		polygonId = uuid(32, 16);
		addArFlag = true;
	}

	// 检查临时点数组是否有对象
	if (pointSet == null || pointSet.length < 3) {
		if (type == 'rect') {
			return null;
		}
		// EDIT ===>>> 20190711
		tips_message_func('必须三点以上才能保存.')
		// EDIT ===>>> END

		return null;
	}
	// 拼接字符并写入SVG
	var points = '';
	var pointIds = '';
	var pointObjs = '[';
	for (var i in pointSet) {
		var point = mysvg.getElementById(pointSet[i].id);
		point.setAttribute('polygonid', polygonId);
		var x = pointSet[i].getAttribute('cx');
		var y = pointSet[i].getAttribute('cy');

		pointIds = pointIds + pointSet[i].getAttribute('id');
		pointObjs = pointObjs + '{id:"' + pointSet[i].getAttribute('id') + '",x:' + x + ',y:' + y + '}';
		points = points + x + ',' + y;
		if (i < pointSet.length - 1) {
			points = points + ' ';
			pointObjs = pointObjs + ',';
			pointIds = pointIds + ',';
		}
	}
	pointObjs = pointObjs + ']';

	// 写入多边形数据 jsarray[i].circle_datas
	if (addArFlag) {
		//新增多边形 加入数据中
		var svgtype
		if (!type) {
			svgtype = 'polygon'
		} else {
			svgtype = type
		}

		// var polygonObj='{id:"'+ polygonId+'",circle:'+ pointObjs+',typeId:"'+typeId+'",typeName:"'+typeName+'"}';

		var polygonObj = '{id:"' + polygonId + '",circle:' + pointObjs + ',typeId:"' + typeId + '",typeName:"' + typeName + '",modelTypeId:"' + modelTypeId + '",modelTypeName:"' + modelTypeName + '",svgType:"' + svgtype + '",score:"' + '100' + '"}';
		if (jsarray == null) {
			jsarray = [];
		}
		for (var i in jsarray) {
			if (jsarray[i].imgID == imgId) {
				jsarray[i].circle_datas.push(eval('(' + polygonObj + ')'));
				// console.log('---------添加后-------');
				// console.log(jsarray[i].circle_datas);

				// === SAVE
				// addOrSubNumber = 1
				// saveSubmitFunc()
				// === SAVE

				canSubmitFlag = true

				break;
			}

		}
	}
	//
	// 写入多边形 SVG视图
	var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	if (polygon) {
		polygon.setAttribute('typeId', typeId);
		polygon.setAttribute('typeName', typeName);
		polygon.setAttribute('modelTypeName', modelTypeName);
		polygon.setAttribute('modelTypeId', modelTypeId);
		polygon.setAttribute('imgId', imgId);
		polygon.setAttribute('id', polygonId);
		polygon.setAttribute('pointids', pointIds);
		polygon.setAttribute("points", points);
		// EDIT ===>>> 0520
		if (!type) {
			polygon.setAttribute('data-svgtype', 'polygon');
		} else {
			polygon.setAttribute('data-svgtype', type);
		}
		// EDIT ===>>> END
		polygon.setAttribute("style", "stroke:" + baseColor + ";stroke-width:1;fill-opacity:0.0;");
		mysvg.appendChild(polygon);
		// 绑定鼠标事件
		polygon.onclick = function (event) {
			console.log("onclick")

			var that = this; //保留事件源的引用
			if (delPolygon != null) {
				that.setAttribute("style", "stroke:" + baseColor + ";stroke-width:1;fill-opacity:0.0;");
				$('#jqContextMenu').css('display', 'none');
				delPolygon = null;

				console.log("A")

				tagFlag = true;
			}

		}
		polygon.onmouseover = function (event) {

			tip.start(this)
			this.setAttribute("style", "stroke:" + baseColor + ";stroke-width:1.5;fill-opacity:0.0;");
		}
		polygon.onmouseout = function (event) {
		}
		polygon.onmouseup = function (event) {

			console.log("onmouseup")

			// 右键菜单
			if ((tagFlag && endFlag) || (!tagFlag && delPolygon != null)) {
				var that = this; //保留事件源的引用
				if (event.button == 2) {
					tagFlag = false;
					if (tagPoints == null || tagPoints.length == 0) {
						// EDIT ===>>> 0515

						delPolygon = that;
						that.setAttribute("style", "stroke:" + baseColor + ";stroke-width:3;fill-opacity:0.0;");

						// var x = event.pageX + 5;
						// var y = event.pageY - 50;

						$('#jqContextMenu').css('left', event.pageX + jqContextMenuOffsetLeftNumber + 'px');
						$('#jqContextMenu').css('top', event.pageY + 'px');
						$('#jqContextMenu').css('display', '');

						// if (t != null) {
						//   t.style.display = 'none';
						// }

						if ((new Date().getTime()) - complete_painting_right_timestamp < 300) {
							$('#jqContextMenu').css('display', 'none');

							console.log("B")

							tagFlag = true
						}

						// EDIT ===>>> END
					}
				}
			} else {
				if (event.button == 2) {
					if (typeof isOnlyView === "boolean" && isOnlyView === true) {
						tips_message_func('当前场景仅能查看，请前往数据标注页进行修改..')
					} else {
						tips_message_func("请在标注状态下..")
					}
				}
			}
		}

	}
	//
	// if (addArFlag && canSubmitFlag) {
	// === SAVE
	// addOrSubNumber = 1
	// saveSubmitFunc()
	// === SAVE
	// }

	return polygon;
}

/**
 * 画线方法
 * @param {Number} x2 坐标
 * @param {Number} y2 坐标
 * @returns {Object} SVG 多边形对象
 */
function addLine(x2, y2) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	if (line) {
		//去点的数组里去到最后一个来确定是线的 X1 Y1
		if (tagPoints != null && tagPoints.length > 0) {
			var point = tagPoints[tagPoints.length - 1];
			var x1 = point.getAttribute('cx');
			var y1 = point.getAttribute('cy');
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y1);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y2);
			line.setAttribute("style", "stroke-width:1;stroke:" + baseColor + ";z-index:-100;");
			mysvg.appendChild(line);
		} else {
			// alert('画线出现错误');
			tips_message_func('画线出现错误..')
			line = null;
		}
	}
	// EDIT ===>>> 0515
	line.onmouseover = function (event) {
		// console.log("line onmouseover")
		// is_touch_line = true
	}
	line.onmouseout = function (event) {
		// console.log("line onmouseout")
		// is_touch_line = false
	}
	// EDIT END
	return line;
}

/**
 * 标注数据渲染入口
 * @param {Object} ar jsarray 标注数据数组
 * @param {Number} index mark_image_index 此时图片序列 index
 * @returns {Void}
 */
function initPoint(ar, index) {
	var base_url = url_dicomImagePath

	// 一共是几张图？
	imageTotalNumber = ar.length

	if (t != null)
		t.style.display = 'none';
	if (ar != null && ar.length > 0) {
		allNum = ar.length;
		if (allNum > index) {

			var imgObj = ar[index];

			// 移除原来的图片
			$('#svg_img').remove()
			// 加上新的图片
			$('#svg_my_father').append(imgArray[index])
			// 初始化点
			// initPointFilterA(imgObj) 经过过滤器计算的当前图片数据 包括图和标注
			// 继续执行核心方法
			initPointCore(initPointFilterA(imgObj))
			// circle_datas 多边形集合
			// circle_datas[p] 一个多边形

		}
	}
}

/**
 * 图片渲染入口
 * @param {Object} ar jsarray 标注数据数组
 * @returns {Void}
 */
function initImage(ar) {
	// console.log(imgArray)

	// image_load_count = 0
	// 确定起点和终点
	var start = image_load_index_array[0]
	var end = image_load_index_array[1]
	// 确定图片路径前缀
	var base_url = url_dicomImagePath

	for (var i = start; i < end; i++) {
		// if (!imageLoadFlag) {
		//   return
		// }

		// 检查图片对象是否存在
		var imgObj_t = ar[i]
		if (typeof imgObj_t === "undefined") {
			return
		}

		// 图片路径拼接
		var the_img_str_t = base_url + encodeURI(imgObj_t.imagePath)

		// console.log(the_img_str_t)

		// 声明图片对象
		var img = new Image();

		// EDIT ===>>> 0512
		// 把onload写在src前面
		img.addEventListener('load', loadOrErrorFunc_load, false);
		img.addEventListener('error', loadOrErrorFunc_error, false);
		// EDIT ===>>> END

		// 赋值与设定样式
		img.src = the_img_str_t
		img.id = "svg_img"
		updateDOMStyle(img, {
			'width': '100%',
			'height': '100%',
			'position': 'absolute',
			'z-index': '98',
			'left': '0',
			'top': '0',
			'user-select': 'none',
			'-webkit-user-select': 'none'
		})
		// 推进图片数组
		imgArray.push(img)
	}
	// 变更读取序列起终点
	image_load_index_array[0] += image_load_length
	image_load_index_array[1] += image_load_length
}

/**
 * initPoint核心方法|接收一个图片对象 调用addpolygon
 * @param {Object} imgObj 图片数据对象
 * @returns {Void}
 */
function initPointCore(imgObj) {
	// 清除SVG
	$("#" + svgId).empty();

	// EDIT ===>>> 0916
	circle_to_polygon_map = {}
	polygon_id_to_svg_map = {}
	// EDIT ===>>> END

	// circle_datas 多边形集合
	// circle_datas[p] 一个多边形
	var circle_datas = imgObj.circle_datas;
	var imgId = imgObj.imgID;
	dImgId = imgId;
	if (circle_datas != null && circle_datas.length > 0) {
		//var polygCount=0;
		for (var p in circle_datas) {
			var pointObj = circle_datas[p]
			//画点
			var circle = pointObj.circle;
			//多边形Id
			var polygonId = pointObj.id;
			var typeId = pointObj.typeId;
			var typeName = pointObj.typeName;
			var modelTypeId = pointObj.modelTypeId;
			var modelTypeName = pointObj.modelTypeName;
			// EDIT ===>>> 0520
			var svgType = pointObj.svgType;
			// EDIT ===>>> END
			var pointSet = [];
			if (circle != null && circle.length > 0) {
				for (var i in circle) {
					var x = circle[i].x;
					var y = circle[i].y;
					var pointId = circle[i].id;
					// 循环画点
					var point = addPoint(x, y, imgId, pointId);
					// 推进pointSet数组 画多边形要用
					pointSet.push(point);

					// EDIT ===>>> 0916
					circle_to_polygon_map[pointId] = polygonId
					// EDIT ===>>> END
				}
			}
			// 渲染已有的
			// 画多边形
			var Polygon = addPolygon(pointSet, imgId, typeId, typeName, polygonId, svgType, modelTypeId, modelTypeName);
			polygon_id_to_svg_map[polygonId] = Polygon
		}
	}

	//console.log(circle_to_polygon_map)
	//console.log(polygon_id_to_svg_map)
}

/**
 * initPoint 过滤器 A 一般不用改
 * item 一个图 带图和标注
 * item[i] item[circle_datas] 标注数组
 * @param {Object} item 原对象
 * @returns {Object} o 新对象
 */
function initPointFilterA(item) {
	// 如果是标注数据就走下一层过滤器
	var o = {}
	for (var i in item) {
		if (i === "circle_datas") {
			o[i] = initPointFilterB(item[i])
		} else {
			o[i] = item[i]
		}
	}
	return o
}

/**
 * initPoint 过滤器 B 需要根据阈值分类等条件在HTML里面覆写
 * arr item[circle_datas] 标注数组
 * arr.forEach() item 一个标注框
 * filter() 判断一个标注框是否绘制的函数
 * @param {Array} arr 原数组
 * @returns {Array} new_arr 新数组
 */
function initPointFilterB(arr) {
	var AIViewFlag = true

	// 过滤入口
	var filters = function (obj) {
		if (AIViewFlag && threshold_filter(obj) && type_filter(obj) && model_type_filter(obj)) {
			return true
		} else {
			return false
		}
	}
	// 过滤器
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
	// EDIT ===>>> 0901
	// 过滤器
	var model_type_filter = function (obj) {
		if (model_type_value === true) {
			return true
		} else {
			// 分类筛选
			for (var i in model_type_value) {
				if (model_type_value[i] === obj.modelTypeId) {
					return true
				}
			}
			return false
		}
	}
	// EDIT ===>>> END
	// 过滤器
	var type_filter = function (obj) {
		if (result_type_value === true) {
			return true
		} else {
			// 分类筛选
			for (var i in result_type_value) {
				if (result_type_value[i] === obj.typeId) {
					return true
				}
			}
			return false
		}
	}
	var new_arr = []
	// 拷贝方法
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
	// 入口
	arr.forEach(function (item, index) {
		// 此处需要根据实际情况写判定条件
		// 比如 分类和阈值符合要求
		if (filters(item)) {
			new_arr.push(new_circle_func(item))
		}
	})
	return new_arr
}

/**
 * 根据坐标和放大倍率的样式算出所需坐标
 * @param {Object} Event 事件对象
 * @returns {Array} [x, y] 带有xy坐标的数组
 */
function transformXY(event) {
	var x = event.pageX - leftX;
	var y = event.pageY - topY;
	// smartzoom
	// var num = $("#" + svgId).css("transform").split("(")[1].split(")")[0].split(",");
	var num = $("#" + svg_father_id).css("transform").split("(")[1].split(")")[0].split(",");
	var tran_x = num[4];
	var tran_y = num[5];
	var scale = num[0];
	x = ((x - tran_x) / scale).toFixed(4);
	y = ((y - tran_y) / scale).toFixed(4);

	return [x, y];

}

/**
 * 鼠标移动时重绘线条
 * @param {Object} Event 事件对象
 * @returns {Void}
 */
function tagMousemove(event) {
	// EDIT ===>>> 0506
	// 把这个鼠标事件存起来，回退的时候会用到
	the_last_mouse_event = event
	// 线的偏差值
	var off_standand = pointOffOffset
	// EDIT ===>>> AEND

	if (tagFlag) {
		if (tagLines != null && tagLines.length > 0) {
			// get所需坐标
			var xy = transformXY(event);
			var x2 = xy[0];
			var y2 = xy[1];
			// get所需线段对象
			var dline = tagLines[tagLines.length - 1];

			// EDIT ===>>> 20190710
			// 根据偏差标准值计算偏差之后的线段位置
			// 如果邻近检测不通过就维持原状
			var last_point = tagPoints[tagPoints.length - 1]
			var cx = last_point.getAttribute("cx");
			var cy = last_point.getAttribute("cy");
			if (!checkPointAndPointIsNearFunc(cx, cy, x2, y2, off_standand)) {
				var new_x1y1_coor_arr = calcNewX1Y1CoorFunc(cx, cy, x2, y2, off_standand)
				var new_x2y2_coor_arr = calcNewX1Y1CoorFunc(x2, y2, cx, cy, off_standand)

				var new_x1 = new_x1y1_coor_arr[0]
				var new_y1 = new_x1y1_coor_arr[1]
				var new_x2 = new_x2y2_coor_arr[0]
				var new_y2 = new_x2y2_coor_arr[1]

				dline.setAttribute("x1", new_x1);
				dline.setAttribute("y1", new_y1);

				dline.setAttribute("x2", new_x2);
				dline.setAttribute("y2", new_y2);
			} else {
				dline.setAttribute("x2", x2);
				dline.setAttribute("y2", y2);
			}
			// EDIT ===>>> 20190710
		}
	}
}

/**
 * 鼠标点击方法
 * @param {Object} Event 事件对象
 * @returns {Void}
 */
function tagMousedown(event) {

	// console.log(tagFlag)
	// console.log(!movePoint)
	// console.log(event.button == 0)

	// 左键
	if (tagFlag && !movePoint && event.button == 0) {
		endFlag = false;
		// get坐标
		var xy = transformXY(event);
		var x = xy[0];
		var y = xy[1];
		if (addPointFlag) {
			// 调用画点方法
			var point = addPoint(x, y, dImgId, undefined);
			// push进临时数组
			tagPoints.push(point);
			if (tagPoints % 2 == 0) {
				var dline = tagLines[tagLines.length - 1];
				dline.setAttribute("x2", x);
				dline.setAttribute("y2", y);
			} else {
				// 调用画线方法
				var dline = addLine(x, y);
				if (dline != null) {
					// push进临时数组
					tagLines.push(dline);
				}
			}
		}
	} else if (event.button == 2) {
		// 右键闭合
		// EDIT ===>>> 0513
		if (tagFlag && !movePoint) {
			if (tagPoints != null && tagPoints.length > 0) {
				// 闭合方法
				complete_painting_func('right')
				// console.log("5")
				addPointFlag = true;
			}
		}
		// EDIT ===>>> END
		// 关闭右键取消功能
		// if (tagFlag && !movePoint){
		//     if(tagPoints!=null && tagPoints.length>0){
		//         for(var i in tagLines ){
		//             mysvg.removeChild(tagLines[i])
		//         }
		//         for (var i in tagPoints) {
		//             mysvg.removeChild(tagPoints[i])
		//         }
		//         tagPoints = [];
		//         tagLines = [];
		//         endFlag = true;
		//         addPointFlag=true;
		//     }
		// }
		// EDIT ===>>> END
	}
	// 如果删除按钮出现 则隐藏
	if (!tagFlag && !movePoint && (event.button == 0 || event.button == 2) && delPolygon != null) {
		tagFlag = true;
		$('#jqContextMenu').css('display', 'none');
		delPolygon = null;
	}
}

// *** 这4个是从矩形方法中抽出来的 ***
/**
 * 矩形预画点方法
 * @param {String} imgId 图片id
 * @param {String} id 点id
 * @returns {Object} SVG 矩形对象
 */
var pre_add_point_func = function pre_add_point_func(imgId, id) {
	if (id == null) {
		id = uuid(32, 16);
	}

	var rectObj = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	// 预点只需要set id 图片id、
	if (rectObj) {
		rectObj.setAttribute("id", id);
		rectObj.setAttribute("imgId", imgId);
	}
	// EDIT ===>>> 0521
	mysvg.appendChild(rectObj);
	// EDIT ===>>> END

	return rectObj;
};
/**
 * 矩形完成画点方法
 * @param {Object} rectObj 矩形对象
 * @param {Object} coor 坐标对象
 * @returns {Void}
 */
var com_add_point_func = function com_add_point_func(rectObj, coor) {
	// 完成时再补上样式和坐标值
	rectObj.setAttribute("r", 3);
	rectObj.setAttribute("style", "fill:" + baseColor + "");
	rectObj.setAttribute("cx", coor.x);
	rectObj.setAttribute("cy", coor.y);
	// EDIT ===>>> 0521
	// EDIT ===>>> END
};
/**
 * 检验点时候过近 过近就放弃绘制
 * @param {Object} start_coor 坐标对象
 * @param {Object} now_coor 坐标对象
 * @returns {Boolean} 是否可以绘制
 */
var check_point_distance_func = function check_point_distance_func(start_coor, now_coor) {
	var w = Math.abs(parseFloat(start_coor.x) - parseFloat(now_coor.x));
	var h = Math.abs(parseFloat(start_coor.y) - parseFloat(now_coor.y));

	// isNaN 异常检测
	if (isNaN(w) || isNaN(h)) {
		return false;
	} else {
		var area = w * h;

		// 100 是可调的值 可改成配置项
		if (isNaN(area)) {
			return false;
		} else if (area < 100) {
			return false;
		} else {
			return true;
		}
	}
};
/**
 * 取消绘制
 * @param {Void}
 * @returns {Void}
 */
var cancel_mark_func = function cancel_mark_func() {
	if (tagFlag && !movePoint) {
		// 清除临时数组
		tagPoints_rect.splice(1, 1);
		tagPoints_rect.splice(2, 1);

		if (tagPoints_rect != null) {
			// 清除视图
			for (var i in tagLines_rect) {
				mysvg.removeChild(tagLines_rect[i]);
			}

			for (var j in tagPoints_rect) {
				mysvg.removeChild(tagPoints_rect[j]);
			}

			// 更改状态值
			tagPoints_rect = [];
			tagLines_rect = [];
			endFlag = true;
			addPointFlag = true;
		}
	}
};

// *** 这4个是从矩形方法中抽出来的 ***

/**
 * 鼠标松开时固定矩形
 * @param {Void}
 * @returns {Void}
 */
function mouseup_rect_before_func() {
	if (tagFlag && !endFlag && (markFashionString === "rect") && (tagPoints_rect.length > 0)) {
		var p1 = tagPoints_rect[0]
		var p2 = tagPoints_rect[1]
		var p3 = tagPoints_rect[2]
		var p4 = tagPoints_rect[3]
		mouseup_rect_func(p1, p2, p3, p4)
	}
}

/**
 * 鼠标松开时固定矩形
 * @param {Object} point_1 SVG start_coor
 * @param {Object} point_2 SVG two_coor
 * @param {Object} point_3 SVG now_coor
 * @param {Object} point_4 SVG four_coor
 * @returns {Void}
 */
function mouseup_rect_func(point_1, point_2, point_3, point_4) {

	// 1
	var start_coor = {
		x: point_1.getAttribute("cx"),
		y: point_1.getAttribute("cy") // console.log(start_coor)
	};
	// 3
	var now_coor = {
		x: point_3.getAttribute("cx"),
		y: point_3.getAttribute("cy")
	};
	// 2
	var two_coor = {
		x: now_coor.x,
		y: start_coor.y
	};
	// 4
	var four_coor = {
		x: start_coor.x,
		y: now_coor.y
	};
	// 检查画的面积是否够大
	if (!check_point_distance_func(start_coor, now_coor)) {
		// alert("标注区域过小")
		tips_message_func("标注区域过小..")

		cancel_mark_func();
		return;
	}

	// 完成 2 4 点绘制
	com_add_point_func(point_2, two_coor);
	com_add_point_func(point_4, four_coor); // return

	endFlag = true;
	// addPointFlag = false;


	if (tagFlag && !movePoint) {
		if (tagPoints_rect != null) {

			// 生成矩形
			// console.log("C===========================", new Date().getTime())
			complete_painting_func('rect')

			// addPolygon(tagPoints_rect, dImgId, typeId, typeName, null, 'rect', modelTypeId, modelTypeName); //删除线
			// console.log("D===========================", new Date().getTime())

			// 去除临时点
			for (var i in tagLines_rect) {
				mysvg.removeChild(tagLines_rect[i]);
			}

			tagPoints_rect = [];
			tagLines_rect = [];
			// EDIT ===>>> 0521
			// EDIT ===>>> END
		}
	}

	return;
}

// 这4个是从矩形方法中抽出来的 ***
/**
 * 画矩形起始方法
 * @param {Object} Event 事件对象
 * @returns {Void}
 */
function tagMousedown_rect(event) {
	// console.log(tagFlag)
	// console.log(!movePoint)
	// console.log(event.button == 0)
	// console.log(tagPoints_rect.length === 0)
	// console.log(addPointFlag)

	if (tagFlag && !movePoint && event.button == 0 && tagPoints_rect.length === 0) {
		endFlag = false;
		// get坐标
		var xy = transformXY(event);
		var x = xy[0];
		var y = xy[1];

		if (addPointFlag) {
			// 点1 点3 绘制
			// 点2 点4 预设 不绘制
			// point_2.x = point_3.x point_2.y = point_1.y
			// point_4.x = point_1.x point_4.y = point_3.y

			// 画点
			// 1
			var point_1 = addPoint(x, y, dImgId);
			point_1.onmousedown = function () {
			};
			point_1.onclick = function () {
			};
			tagPoints_rect.push(point_1);
			// 2
			var point_2 = pre_add_point_func(dImgId);
			tagPoints_rect.push(point_2);
			// 3
			var point_3 = addPoint(x, y, dImgId);
			point_3.onmousedown = function () {
			};
			point_3.onmouseup = function (event) {
				// console.log(event)
				// mouseup_rect_before_func()
			};
			tagPoints_rect.push(point_3);
			// 4
			var point_4 = pre_add_point_func(dImgId);
			tagPoints_rect.push(point_4);

			// 画线
			if (false) {
			} else {
				// return
				var dline_1 = addLine_extra(x, y, x, y);
				var dline_2 = addLine_extra(x, y, x, y);
				var dline_3 = addLine_extra(x, y, x, y);
				var dline_4 = addLine_extra(x, y, x, y);

				if (dline_1 && dline_2 && dline_3 && dline_4) {
					tagLines_rect.push(dline_1);
					tagLines_rect.push(dline_2);
					tagLines_rect.push(dline_3);
					tagLines_rect.push(dline_4);
				}
			}
		}
	} else if (event.button == 2) {
		cancel_mark_func();
	}
}

// EDIT ===>>> 0513
/**
 * 把闭合方法提出来
 * @param {String} type polygon or rect
 * @returns {Void}
 */
function complete_painting_func(type) {
	// 设置样式方法
	function set_style_func(point_0) {
		if (point_0) {
			var r = point_0.getAttribute("r")
			r = point_size_arr[1]
			point_0.setAttribute("r", r)
		}
	}

	if (type === "rect") {
		addPolygon(tagPoints_rect, dImgId, typeId, typeName, null, 'rect', modelTypeId, modelTypeName);
		endFlag = true;
		addPointFlag = true;
	} else {
		var point_size_arr = pointSizeArray
		// type
		// dblclick 双击闭合
		// right 右键闭合
		endFlag = true;
		// console.log("8")
		addPointFlag = false;
		if (tagFlag && !movePoint) {
			if (tagPoints != null && tagPoints.length >= 3) {
				// console.log("A===========================", new Date().getTime())
				//生成多边形
				addPolygon(tagPoints, dImgId, typeId, typeName, null, 'polygon', modelTypeId, modelTypeName);
				// console.log("B===========================", new Date().getTime())
				// 删除线
				for (var i in tagLines) {
					mysvg.removeChild(tagLines[i]);
				}
				// EDIT ===>>> 0513
				// console.log(tagPoints[0])
				// var point_0 = tagPoints[0]
				set_style_func(tagPoints[0])

				// if (point_0) {
				//   var r = point_0.getAttribute("r")
				//   r = point_size_arr[1]
				//   point_0.setAttribute("r", r)
				// }

				// EDIT ===>>> END
				tagPoints = [];
				tagLines = [];

				// EDIT ===>>> 0513
				if (type === "right") {
					complete_painting_right_timestamp = new Date().getTime()
				}
				// EDIT ===>>> END
			} else {
				if (tagPoints == null || tagPoints.length == 0) {
					endFlag = true;
				} else {
					endFlag = false;
				}
				// console.log(3)
				console.log("9")
				addPointFlag = true;
				//console.log('点单击 点数量:'+tagPoints.length);
				// alert('必须三点以上才能保存..')
				tips_message_func('必须三点以上才能保存..')
			}
		}
	}
	// === SAVE
	addOrSubNumber = 1
	saveSubmitFunc()
	// === SAVE
}

// EDIT ===>>> END
// EDIT ===>>> 0520
/**
 * smartzoom 解绑方法
 * @param {Void}
 * @returns {Void}
 */
function unbundZoom() {

	// smartzoom
	// $("#"+ svgId).smartZoom('destroy');
	$("#" + svg_father_id).smartZoom('destroy');
	tagFlag = false;

	// 切图事件
	// smartzoom
	// $("#" + svgId).bind("mousewheel", function (event, delta) {
	$("#" + svg_father_id).unbind("mousewheel")
	// alert("?")
	$("#" + svg_father_id).bind("mousewheel", function (event, delta) {
		// tagMousewheel(event, delta);
		tagMousewheel(event, event.originalEvent.deltaY);
	});
}

/**
 * smartzoom 绑定方法
 * @param {Void}
 * @returns {Void}
 */
function zoom() {
	// $("#" + svgId).smartZoom({
	$("#" + svg_father_id).smartZoom({
		'left': '0px',
		'top': '0px',
		// 'height':'512px',
		'dblClickEnabled': false,
		'mouseMoveEnabled': false,
		'containerBackground': '#0f0f0f'
	});
	// EDIT ===>>> 0520
	// 绑定鼠标事件
	bind_mouse_event_func()
}

/**
 * 公共方法 获取uuid
 * @param {Number} len 需要的字符串的长度
 * @param {Number} radix 字符串取值范围[0, radix]
 * @returns {String} uuid
 */
function uuid(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [],
		i;
	radix = radix || chars.length;
	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form
		var r;
		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data. At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
}

/**
 * 渲染入口方法
 * @param {Void}
 * @returns {Void}
 */
function mark_image_init_func() {
	// 获取svg DOM
	mysvg = document.getElementById(svgId);

	// EDIT ===>>> 20190823
	imageLoadFlag = true
	initImage(jsarray);
	// EDIT ===>>> END

	initPoint(jsarray, mark_image_index);
}

/**
 * 改变SVG 宽高的方法
 * @param {Number} width
 * @param {Number} height
 * @returns {Void}
 */
function change_svg_size(width, height) {
	// 不再设置SVG宽高
	// 设置SVG父元素宽高，SVG永远100%
	// $("#" + svgId).css({
	$("#" + svg_father_id).css({
		"width": "".concat(width, "px"),
		"height": "".concat(height, "px")
	});
}

/**
 * 改样式方法 类似于 $().css()
 * @param {Object} DOM
 * @param {Object} style 样式对象
 * @returns {Void}
 */
function updateDOMStyle(DOM, obj) {
	Object.keys(obj).forEach(function (key) {
		DOM["style"][key] = obj[key];
	});
}

/**
 * 把存在SVG对象里的string 100,100 200,200 ... 坐标数据转成形如 [[x,y],[x,y],..]的数组
 * @param {String} 坐标字符串
 * @returns {Array} 坐标数组
 */
function polygon_points_coor_string_to_array(string) {
	var arr_a = string.split(" ");
	var arr_b = [];
	arr_a.forEach(function (item) {
		var o = item.split(",");
		o[0] = parseInt(o[0]);
		o[1] = parseInt(o[1]); // console.log(o)

		arr_b.push(o);
	}); // console.log(arr_b)

	return arr_b;
}

/**
 * 获取坐标数组中的最小值并组成数组
 * @param {Array<Number>} 坐标数组
 * @returns {Array<Number>}
 */
function calc_min_coor(array) {
	/*SVG TEXT COOR
	X 取最小值
	Y 取最小值
	SVG TEXT是从左下角开始画的*/
	var y = 65535,
		x = 65535;
	array.forEach(function (item) {
		item[0] < x ? x = item[0] : '';
		item[1] < y ? y = item[1] : '';
	}); // 最后的结果需要放在略微靠右下的位置

	return [x, y];
}

/**
 * 删除最后一个点和线
 * @param {Void}
 * @returns {Void}
 */
function delete_the_point_line_func() {
	mysvg.removeChild(tagLines[tagLines.length - 1])
	mysvg.removeChild(tagPoints[tagPoints.length - 1])
}

/**
 * 变更最后一条线的坐标
 * @param {Object} Event 事件对象
 * @returns {Void}
 */
function change_last_line_func(event) {
	console.log("change_last_line_func")
	// console.log(event)
	var xy = transformXY(event);
	// console.log(xy)
	var x2 = xy[0];
	var y2 = xy[1];
	var dline = tagLines[tagLines.length - 1];
	// console.log(dline)
	dline.setAttribute("x2", x2);
	dline.setAttribute("y2", y2);
	// console.log(dline)
}

/**
 * 模拟鼠标点击的行为
 * @param {Number} x 坐标
 * @param {Number} y 坐标
 * @returns {Void}
 */
function simulate_mouse_down_func(x, y) {
	if (true) {
		endFlag = false;
		if (true) {
			// 生成点
			var point = addPoint(x, y, dImgId, undefined);
			tagPoints.push(point);
			var length = tagPoints.length

			// 从第二次开始，需要给现在最新的线的x2y2重新赋值坐标
			if (length > 1) {
				var dline = tagLines[tagLines.length - 1];
				dline.setAttribute("x2", x);
				dline.setAttribute("y2", y);
			}
			var dline = addLine(x, y);
			if (dline != null) {
				// push进临时数组
				tagLines.push(dline);
			}
		}
	}
}

/**
 * 切图方法
 * @param {Void}
 * @returns {Void}
 */
function change_page_func() {
	// 换图和多边形
	initPoint(jsarray, mark_image_index);
	// 获取新的宽高
	var the_new_image_now_width = jsarray[mark_image_index].imgNowWidth;
	var the_new_image_now_height = jsarray[mark_image_index].imgNowHeight;
	// 修改SVG宽高
	change_svg_size(the_new_image_now_width, the_new_image_now_height);
	// 修改用户看到的图片序列信息|左上角
	getNowImageIndexFunc(mark_image_index);
	// 改变右下角tab的序列指示
	changeListIndexFunc(mark_image_index)
	// 给个提示
	last_index_tips_func()
};

// EDIT ===>>> END
/*
    切图需要做3件事
    0 检查是否可以翻页
    1 关闭标注状态
    2 切图
    3 打开标注状态
*/
/**
 * 点击按钮切图方法
 * @param {String} type 翻页状态 up or down
 * @returns {Void}
 */
function toJumpImageFunc(type) {

	var dir = type;
	console.log(`next click ${JSON.stringify(jsarray[mark_image_index])}`)
	/*	if (jsarray[mark_image_index].circle_datas.length > 0) {
			$(".mi-f.mark-index").eq(mark_image_index).addClass("active");
		}*/
	if (dir === 'up') {
		// 检验不通过 什么也不做
		// 检验通过 改变 mark_image_index 的值
		var check = function check() {
			return mark_image_index < 1 ? false : true;
		};

		if (!check()) {
			// alert("超过最小页数")
			return;
		} else {

			mark_image_index--;


		}
	} else if (dir === 'down') {
		var _check = function _check() {
			return mark_image_index > mark_image_length - 2 ? false : true;
		};

		if (!_check()) {
			// alert("超过最大页数")
			return;
		} else {
			mark_image_index++;
		}
	} else {
		return;
	}

	// 1 关闭标注状态
	if (checkZtreeClickFunc()) {
		// 当 换图|取消标注状态 时执行一个初始化方法
		reload_painting_when_image_change_func();

		if (markButtonLightIndex === 3) {
			unbundZoom();
		}
	}

	// 2 切图
	change_page_func();

	// 3 打开标注状态
	if (checkZtreeClickFunc()) {
		if (markButtonLightIndex === 3) {
			zoom();
		}
	}
}

// EDIT END
// EDIT ===>>> 0513
/*
当 换图|取消标注状态 时执行一个初始化方法
- a 删除没有闭合的线
- b 隐藏蓝色文字提示
- c 隐藏删除菜单
*/
/**
 * 当 换图|取消标注状态 时执行一个初始化方法
 * @param {Void}
 * @returns {Void}
 */
function reload_painting_when_image_change_func() {
	// 删除没有闭合的线
	clear_uncomplete_mark_func()
	// 隐藏蓝色文字提示
	if (t) {
		t.style.display = 'none'
	}
	// 隐藏删除菜单
	hide_jqContextMenu()
}

/**
 * 删除没有闭合的线
 * @param {Void}
 * @returns {Void}
 */
function clear_uncomplete_mark_func() {
	if (tagFlag && !movePoint) {
		endFlag = true;
		addPointFlag = true;
		// 多边形 矩形
		// EDIT ===>>> 0521
		// 矩形点集合 多边形点集合
		if (tagPoints != null && tagPoints.length > 0 || tagPoints_rect != null && tagPoints_rect.length > 0) {
			var arr = [tagLines, tagPoints, tagLines_rect, tagPoints_rect];
			arr.forEach(function (item) {
				for (var i in item) {
					mysvg.removeChild(item[i]);
				}
			});
			arr.forEach(function (item) {
				item.length = 0;
			});
		}
	}
}

/**
 * 隐藏删除菜单
 * @param {Void}
 * @returns {Void}
 */
function hide_jqContextMenu() {
	if (delPolygon != null) {
		$('#jqContextMenu').css('display', 'none');
		delPolygon = null;
	}
}

// EDIT ===>>> END
/**
 * 事件入口
 * @param {Object} event
 * @returns {Void}
 */
function tagMousedown_enter(event) {
	tagMousedown(event);
}

/**
 * 事件入口
 * @param {Object} event
 * @returns {Void}
 */
function tagMousemove_enter(event) {
	tagMousemove(event);
}

/**
 * 绑定事件方法
 * @param {Void}
 * @returns {Void}
 */
function bind_mouse_event_func() {

	tagFlag = true;
	endFlag = true;
	tagPoints = [];
	tagLines = [];
	tagPoints_rect = []; // 矩形临时点
	tagLines_rect = []; // 矩形临时线
	$("#" + svgId).unbind("mousedown", tagMousedown_enter);
	$("#" + svgId).unbind("mousemove", tagMousemove_enter);
	$("#" + svgId).unbind("mousedown", tagMousedown_rect_enter);
	$("#" + svgId).unbind("mousemove", tagMousemove_rect_enter);
	$("#" + svgId).unbind("mouseup", mouseup_rect_before_func);

	// 矩形和多边形的绘制事件不一样
	if (markFashionString === "rect") {
		$("#" + svgId).bind("mousedown", tagMousedown_rect_enter);
		$("#" + svgId).bind("mousemove", tagMousemove_rect_enter);
		$("#" + svgId).bind("mouseup", mouseup_rect_before_func);
	} else {
		$("#" + svgId).bind("mousedown", tagMousedown_enter);
		$("#" + svgId).bind("mousemove", tagMousemove_enter);
	}
}

/**
 * 矩形绘制方法 移动鼠标时
 * @param {Object} event
 * @returns {Void}
 */
function tagMousemove_rect(event) {
	// if (tagFlag && !movePoint && event.button==0) {
	if (!endFlag && tagFlag && !movePoint && event.button == 0) {
		// endFlag=false;
		var xy = transformXY(event);
		var x = xy[0];
		var y = xy[1];
		if (addPointFlag) {
			// start_coor point_1
			// point_2.x = point_3.x|now_coor
			// point_2.y = point_1.y|start_coor
			// point_4.x = point_1.x|start_coor
			// point_4.y = point_3.y|now_coor

			var point_1 = tagPoints_rect[0]
			// 1
			var start_coor = {
				x: point_1.getAttribute("cx"),
				y: point_1.getAttribute("cy")
			}
			// console.log(start_coor)
			// 3
			var now_coor = {
				x: x,
				y: y
			}
			// 2
			var two_coor = {
				x: now_coor.x,
				y: start_coor.y
			}
			// 4
			var four_coor = {
				x: start_coor.x,
				y: now_coor.y
			}

			var point_3 = tagPoints_rect[2]
			point_3.setAttribute("cx", now_coor.x);
			point_3.setAttribute("cy", now_coor.y);

			var dline_1 = tagLines_rect[0];
			var dline_2 = tagLines_rect[1];
			var dline_3 = tagLines_rect[2];
			var dline_4 = tagLines_rect[3];
			set_line_coor_func(dline_1, start_coor, two_coor)
			set_line_coor_func(dline_2, two_coor, now_coor)
			set_line_coor_func(dline_3, now_coor, four_coor)
			set_line_coor_func(dline_4, four_coor, start_coor)
		}
	}
}

/**
 * 事件入口
 * @param {Object} event
 * @returns {Void}
 */
function tagMousedown_rect_enter(event) {
	// console.log(tagFlag)

	tagMousedown_rect(event);
}

/**
 * 事件入口
 * @param {Object} event
 * @returns {Void}
 */
function tagMousemove_rect_enter(event) {
	tagMousemove_rect(event);
}

// function tagMouseUp_rect(event){
//     console.log("tagMouseUp_rect")
// }

/**
 * 矩形需要另外的画线方法
 * @param {Number} x1 坐标
 * @param {Number} y1 坐标
 * @param {Number} x2 坐标
 * @param {Number} y2 坐标
 * @returns {Object} SVG 线对象
 */
function addLine_extra(x1, y1, x2, y2) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	if (line) {
		if (tagPoints_rect != null && tagPoints_rect.length > 0) {
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y1);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y2);
			line.setAttribute("style", "stroke-width:1;stroke:" + baseColor + ";z-index:-100;");
			mysvg.appendChild(line);
		} else {
			// alert('画线出现错误');
			tips_message_func('画线出现错误..')
			line = null;
		}
	}
	return line;
}

// 给线设置坐标的方法
/**
 * 给线设置坐标的方法
 * @param {Object} SVG 线对象
 * @param {Object} form 前坐标
 * @param {Object} to 后坐标
 * @returns {Void}
 */
function set_line_coor_func(line, form, to) {
	line.setAttribute("x1", form.x);
	line.setAttribute("y1", form.y);
	line.setAttribute("x2", to.x);
	line.setAttribute("y2", to.y);
}

/**
 * 计算已标注数量 现在不需要了
 * @param {Void}
 * @returns {Number} count
 */
function calcCircleDatasMarkedFunc() {
	var count = 0;
	jsarray.forEach(function (item) {
		if (item.circle_datas && item.circle_datas.length > 0) {
			count++;
		}
	});
	return count
}

//输出某个图片中的多边形 也就是多个点
/**
 * 把要删除的框从 circle_datas 里删掉
 * @param {Array} ar jsarray 标注数据数组
 * @param {String} imgid 图片ID
 * @param {String} polygonId 多边形ID
 * @returns {Void}
 */
function removeArrayImgPoint(ar, imgid, polygonId) {

	// 重组 circle_datas
	if (ar != null && ar.length > 0) {
		for (var imgIndex in ar) {
			var imgObj = ar[imgIndex];
			if (imgObj.imgID == imgid) {
				var oldCircleData = imgObj.circle_datas;
				var newCircleData = [];
				for (var i = 0; i < oldCircleData.length; i++) {
					if (oldCircleData[i].id != polygonId) {
						newCircleData.push(oldCircleData[i]);
					} else {

					}
				}
				ar[imgIndex].circle_datas = newCircleData;

				// === SAVE
				addOrSubNumber = -1
				saveSubmitFunc()
				// === SAVE

				break
			}
		}
	}
}

/**
 * 删除多边形入口 会调用 removeArrayImgPoint
 * @param {Array} ar jsarray 标注数据数组
 * @param {String} imgid 图片ID
 * @param {String} polygonId 多边形ID
 * @returns {Void}
 */
function deletePolygon() {
	if (delPolygon != null) {
		// EDIT ===>>> 0826
		deleteTypeId = delPolygon.getAttribute('typeId');
		deleteTypeName = delPolygon.getAttribute('typeName');
		// EDIT ===>>> END

		var id = delPolygon.getAttribute('id');
		var imgId = delPolygon.getAttribute('imgId');
		var pointids = delPolygon.getAttribute('pointids');

		// 移除 SVG视图
		if (pointids != null && pointids.length > 0) {
			var pids = pointids.split(',');
			for (var i = 0; i < pids.length; i++) {
				mysvg.removeChild(mysvg.getElementById(pids[i]))
			}
			mysvg.removeChild(delPolygon);
			removeArrayImgPoint(jsarray, imgId, id);


		}
		if (t != null)
			t.style.display = 'none';
		if (delPolygon != null) {
			$('#jqContextMenu').css('display', 'none');

			console.log("E")

			tagFlag = true;
			delPolygon = null;
		}

		// console.log('jsarray')
		// console.log(jsarray)
	}
}

/**
 * 滚轮切图方法
 * @param {Object} event
 * @param {Number} delta 滚轮状态值
 * @returns {Void}
 */
function tagMousewheel(event, delta) {
	if (!tagFlag) {
		var dir = delta < 0 ? 'Up' : 'Down';
		if (dir == 'Up') {
			if (dnum > 1) {
				dnum = dnum - 1;
			}
		} else {
			if (dnum < allNum) {
				dnum = dnum + 1;
			}
		} // up 上一页
		// down 下一页
		var dir = delta < 0 ? 'Up' : 'Down';
		if (dir == 'Up') {
			var check = function check() {
				return mark_image_index < 1 ? false : true;
			};
			// console.log(check())
			if (check()) {
				mark_image_index--; // 换图和多边形

				change_page_func()
			}
		} else {
			// console.log(mark_image_index)
			// console.log(mark_image_length)
			var _check = function _check() {
				return mark_image_index > mark_image_length - 2 ? false : true;
			};
			// console.log(_check())
			if (_check()) {
				mark_image_index++; // 换图和多边形

				change_page_func()
			}
		}
	}

	return false;
}

// 提交
// 原坐标 * 倍率
// 保存数据
// x 状态 0 只保存数据
// jsarray 标注数据
// dataToSubmitModelMultipleNumber 图片放大倍率数组
// networkImagePageData 后端返回的数据（含分页数据）
// ini 附加数据
/**
 * 提交
 * 会调用 saveSubmitCoreFunc
 * @param {Object} ini 会在别的方法里用到的附加数据对象
 * @returns {Void}
 */
function saveSubmitFunc(ini) {
	// 已完成的标注不能再次提交 | 现在可以了
	// if (this.isMarkCompleted) {
	//     return
	// }
	// 还是保留为array形式，提交时再取object
	var copyed_obj = objectCopy(jsarray);

	// var parseCoorFunc = function parseCoorFunc(res, multiple_array) {
	//   // item_1 图片对象
	//   // item_2 多边形对象
	//   // item_3 点对象
	//   res.map(function (item_1, index_1) {
	//     item_1.circle_datas.map(function (item_2) {
	//       item_2.circle.map(function (item_3) {
	//         item_3.x = item_3.x * multiple_array[index_1];
	//         item_3.y = item_3.y * multiple_array[index_1];
	//       });
	//     }); // delete imgNowWidth imgNowHeight

	//     delete item_1.imgNowWidth;
	//     delete item_1.imgNowHeight;
	//   });
	// };

	// EDIT ===>>> 0908
	// 转化数据
	// 如果转化错误就不再执行下面
	var status = parseCoorInputFunc(copyed_obj, dataToSubmitModelMultipleNumber);
	if (!status) {
		tips_message_func("有错误数据，请确认<br>(可以点清除所有清除错误数据)")
		return
	}
	// EDIT ===>>> END

	// 获取需要的数据
	var tagJson = JSON.stringify(copyed_obj[mark_image_index]);

	var caseId
	if (typeof networkImagePageData !== "undefined" && typeof networkImagePageData.caseId !== "undefined") {
		caseId = networkImagePageData.caseId
	}

	// 装载数据
	var re = {
		caseId: caseId,
		// overTag:x,
		answer: tagJson
	};

	var res = {
		data: {
			id: copyed_obj[mark_image_index].imgID,
			tagFlag: (copyed_obj[mark_image_index].circle_datas.length > 0) ? 1 : 0,
		}
	}
	changeMarkStatusWhenSaveFunc(res)
	// 在下个方法提交
	saveSubmitCoreFunc(re, ini)
}

/**
 * 识别转标注用
 * 点击识别转标注按钮 出提示弹窗 点击确定 调这个方法
 * @param {Void}
 * @returns {Void}
 */
function saveSubmitAllFunc() {
	// var Synchronization = SynchronizationArray

	// 拷贝
	var copyed_obj = objectCopy(saveSynchronizationArray);

	// EDIT ===>>> 0908
	// 转化数据并检验有效性
	var status = parseCoorInputFunc(copyed_obj, dataToSubmitModelMultipleNumber);
	if (!status) {
		tips_message_func("有错误数据，请确认(可以点清除所有清除错误数据)")
		return
	}
	// EDIT ===>>> END

	// 转一下
	var tagJson = JSON.stringify(copyed_obj);
	var caseId
	if (typeof networkImagePageData !== "undefined" && typeof networkImagePageData.caseId !== "undefined") {
		caseId = networkImagePageData.caseId
	}
	// 装载数据
	var re = {
		caseId: caseId,
		orderVal: currCaseIndex,
		caseName: currCaseName,
		answer: tagJson,
		zjCode: userName
	};
	// 现在不需要了
	//circleDatasMarkedNumber = calcCircleDatasMarkedFunc();
	// 在下个方法提交
	saveSubmitAllCoreFunc(re)
	// console.log(copyed_obj)
}

// 清除全部用
// function saveSubmitEmptyAllFunc() {
//   var copyed_obj = objectCopy(jsarray);
//   parseCoorInputFunc(copyed_obj, dataToSubmitModelMultipleNumber);
//   var tagJson = JSON.stringify(copyed_obj);
//   var caseId
//   if (typeof networkImagePageData !== "undefined" && typeof networkImagePageData.caseId !== "undefined") {
//     caseId = networkImagePageData.caseId
//   }
//   var re = {
//     caseId: caseId,
//     tagJson: tagJson
//   };
//   circleDatasMarkedNumber = calcCircleDatasMarkedFunc();
//   saveSubmitEmptyAllCoreFunc(re)
// }

/**
 * 抽出保存时用的坐标转换
 * @param {Array} res 数据数组
 * @param {Array} multiple_array 缩放倍率数组
 * @returns {Boolean} canSubmit
 */
function parseCoorInputFunc(res, multiple_array) {
	//  EDIT ===>>> 0909
	var canSubmit = true

	// 如果检查不通过 后面就不用算了 返回false
	function check_func(number, standand) {
		if (number > standand) canSubmit = false;
	}

	//  EDIT ===>>> END

	// item_1 图片对象
	// item_2 多边形对象
	// item_3 点对象
	res.map(function (item_1, index_1) {
		item_1.circle_datas.map(function (item_2) {
			item_2.circle.map(function (item_3) {

				item_3.x = item_3.x * multiple_array[index_1];
				item_3.y = item_3.y * multiple_array[index_1];

				check_func(item_3.x, item_1.imgWidth)
				check_func(item_3.y, item_1.imgHeight)
			});
		}); // delete imgNowWidth imgNowHeight

		delete item_1.imgNowWidth;
		delete item_1.imgNowHeight;
	});

	return canSubmit
}

/**
 * 加载完成后关闭遮罩
 * @param {Void}
 * @returns {Void}
 */
function imageLoadStatusFunc() {
	imageLoadStatus = true
	// console.log("===TIMESTAMP=== IMAGE ONLOAD " + new Date().getTime());
	if (calcCircleDatasMarkedFunc) {
		circleDatasMarkedNumber = calcCircleDatasMarkedFunc();
	} else {
		circleDatasMarkedNumber = 0
	}
	setTimeout(function () {
		loadingModalDisplayBoolean = false;
		// console.log("===TIMESTAMP=== this.$Modal.remove() " + new Date().getTime());
		if (document.getElementById('full_mask')) {
			keyboardFlag = true
			// if (document.getElementById('full_mask').style.display === "block") {
			document.getElementById('full_mask').style.display = "none"
			// }
		}
		// console.log("imageLoadStatusFunc===", new Date().getTime())
	}, 500);
}

/**
 * 图片读取事件
 * @param {String} type load or error
 * @returns {Void}
 */
function loadOrErrorFunc(type) {
	/*
	  image_load_length {Number} const 常量 设定的图片读取序列的长度
	  jsarray.length {Number} let 获取的数据里的图片总数
	  imageNowNumber {Number} let
	  image_load_count {Number} let
	*/
	// 根据 type 不同加不同的变量
	var ar = jsarray
	if (type === "load") {
		image_onload_index++
	} else if (type === "error") {
		image_error_index++
	} else {
		return
	}
	imageNowNumber = image_onload_index + image_error_index
	// 不管是否正确 读取值都会加一个
	image_load_count++
	// 算百分比（现在用不上）
	var per = parseInt((imageNowNumber / imageTotalNumber) * 100)
	// 在各种情况下都需要关掉遮罩
	if (ar.length === 1 && imageNowNumber === 1) {
		imageLoadStatusFunc()
	} else if (ar.length > 1 && imageNowNumber === (ar.length)) {
		imageLoadStatusFunc()
	} else if (imageNowNumber === 10) {
		// 切记！能触发一次的方法就不要触发一万次！
		// 改成加载10张后就关闭
		imageLoadStatusFunc()
	}
	// 当这个序列（读取序列一般是总序列的一部分）读完的时候
	if (image_load_count === image_load_length) {
		// 读取值置回到 0
		image_load_count = 0
		// 如果总序列还没有被读取序列读完
		if (ar.length - imageNowNumber !== 0) {
			// 读取下一波图片
			initImage(jsarray)
		}
	}
}

/**
 * 标注之前必须检查是否选中标注类型
 * @param {Number} status
 * @returns {Boolean}
 */
function checkZtreeClickFunc(status) {
	// alert(typeId)
	// alert(typeName)
	// if (this.ztreeSelectObj.name === "" || this.ztreeSelectObj.id === "") {
	if (typeId === null || typeName === null) {
		if (status && status === 1) {
			// alert('请选择标注分类')
			tips_message_func('请选择标注分类..')
		}
		return false
	} else {
		return true
	}
}

// EDIT ===>>> 0506
/**
 * 键盘方法
 * @param {Object} event
 * @returns {Void}
 */
function otherButtonClickHandler(e) {
	// console.log("mark_core_page keyboard");
	// 必须处于正在标注的状态
	// 如果keyboardFlag false 就禁用键盘事件
	if (!keyboardFlag) {
		return
	}

	var parse_points_func = function parse_points_func(string) {
		return string.split(" ");
	};

	var delete_func = function delete_func(arr) {
		arr.splice(arr.length - 1, 1);
	};

	switch (e.keyCode) {
		// case 46://删除
		// EDIT ===>>> 0513
		// 回退键位改动
		// backspace -> w -> ESC
		// EDIT ===>>> END
		case 27:
			// 删除
			// 只有回退需要检验tagFlag
			if (tagFlag === false) {
				return;
			}
			// if 删除图形
			// else 回退
			if (endFlag === false) {
				// 临时数组里必须有数据
				if (tagLines.length < 1 || tagPoints.length < 1) {
					return;
				}
				// 正在画
				// 删除最后一个
				delete_the_point_line_func();
				delete_func(tagLines);
				delete_func(tagPoints);
				// console.log("===DELETE===");
				// console.log(tagLines)
				// console.log(tagPoints)
				// 如果删了一个之后发现已经没有了，就改变状态
				if (tagLines.length === 0 || tagPoints.length === 0) {
					endFlag = true;
					// console.log("11")
					addPointFlag = true
					return;
				} else {
					// 重置 the last line 的位置 让这个点可以和鼠标指针重合
					change_last_line_func(the_last_mouse_event);
					return;
				}
			} else {
				// 画完了
				// 删除最新的polygon
				// EDIT ===>>> 0520
				var polygon_array = [];
				var polygon_array_origin = document.getElementsByTagName("polygon");
				for (var i = 0; i < polygon_array_origin.length; i++) {
					var dom = polygon_array_origin[i];
					if (dom.getAttribute("data-svgtype") && dom.getAttribute("data-svgtype") === "polygon") {
						polygon_array.push(dom);
					}
				}
				// EDIT ===>>> END
				// 必须要有多边形存在
				if (polygon_array.length === 0) {
					return;
				}

				var the_polygon = polygon_array[polygon_array.length - 1];
				delPolygon = polygon_array[polygon_array.length - 1];
				deletePolygon();

				// 把要删的多边形的数据存一下
				var polygon_data_obj = {
					typeId: the_polygon.getAttribute("typeId"),
					typeName: the_polygon.getAttribute("typeName"),
					imgId: the_polygon.getAttribute("imgId"),
					id: the_polygon.getAttribute("id"),
					pointids: the_polygon.getAttribute("pointids"),
					points: the_polygon.getAttribute("points")
				};
				// 转一下坐标
				var points_arr = parse_points_func(polygon_data_obj.points);

				// 模拟鼠标点击
				points_arr.forEach(function (item) {
					var arr = item.split(',');
					simulate_mouse_down_func(arr[0], arr[1]);
				});
				// 重置 the last line 的位置 让这个点可以和鼠标指针重合
				change_last_line_func(the_last_mouse_event);
			}
			// console.log(jsarray[mark_image_index])
			break;
		// A 前一例
		case 65:
			if (typeof upCase === "function") {
				upCase()
			}
			break;
		// D 后一例
		case 68:
			if (typeof downCase === "function") {
				downCase()
			}
			break;
		// Q 多边形
		case 81:
			// alert('多边形')
			markFashionStringChangeFunc('polygon')
			break;
		// E 矩形
		case 69:
			// alert('矩形')
			markFashionStringChangeFunc('rect')
			break;
		// 键位修改 a -> w
		case 87:
			// 上一张图
			toJumpImageFunc('up');
			break;
		// 键位修改 d -> s
		case 83:
			// 下一张图
			toJumpImageFunc('down');
			break;
	}
}

// 选中标注类型
// 目前已废弃

// EDIT ===>>> 20190710
/**
 * 检查两点是否过近
 * @param {Number} x 坐标
 * @param {Number} y 坐标
 * @param {Number} p_x 坐标
 * @param {Number} p_y 坐标
 * @param {Number} standand 标准值
 * @returns {Boolean}
 */
function checkPointAndPointIsNearFunc(x, y, p_x, p_y, standand) {
	if (!p_x || !p_y || !x || !y) {
		return null
	}
	var across = Math.abs(x - p_x)
	var release = Math.abs(y - p_y)
	var distance = Math.sqrt(across * across + release * release)
	if (distance < standand) {
		return true
	} else {
		return false
	}
}

/**
 * 计算两点距离公共方法
 * x0 y0 鼠标此时的坐标 x1 y1 参照点的坐标
 * @param {Number} x0 坐标
 * @param {Number} y0 坐标
 * @param {Number} x1 坐标
 * @param {Number} y1 坐标
 * @returns {Number} 两点距离
 */
function calcPointDistanceFunc(x0, y0, x1, y1) {
	var hori = x1 - x0 // 横向距离
	var vert = y1 - y0 // 纵向距离
	return Math.sqrt(hori * hori + vert * vert)
}

/**
 * 计算考虑偏差值后的线点新坐标
 * x0 y0 鼠标此时的坐标 x1 y1 参照点的坐标
 * @param {Number} x1 坐标
 * @param {Number} y1 坐标
 * @param {Number} x2 坐标
 * @param {Number} y2 坐标
 * @param {Number} standand 标准值
 * @returns {Array<Number>} [Number, Number] 新的x1 y1 坐标
 */
function calcNewX1Y1CoorFunc(x1, y1, x2, y2, standand) {
	var old_dis = calcPointDistanceFunc(x1, y1, x2, y2)
	// 思路是相似三角形
	if (old_dis > standand) {
		var per = standand / old_dis
		var x_dis = x1 - x2
		var y_dis = y1 - y2
		var sub_x = x_dis * per
		var sub_y = y_dis * per
		var x1_new = x1 - sub_x
		var y1_new = y1 - sub_y
		return [x1_new, y1_new]
	} else {
		// console.log("距离比标准小 不用算")
		return [x1, y1]
	}
}

// EDIT ===>>> END

/**
 * 读取入口
 * @param {Void}
 * @returns {Void}
 */
function loadOrErrorFunc_load() {
	loadOrErrorFunc('load')
}

/**
 * 读取入口
 * @param {Void}
 * @returns {Void}
 */
function loadOrErrorFunc_error() {
	loadOrErrorFunc('error')
}

/**
 * 生成DOM数组方法
 * @param {DOM}
 * @returns {Array<DOM>}
 */
function makeDOMArrayFunc(DOM) {
	var arr = []
	for (var i = 0, n; n = DOM[i]; ++i) arr.push(n);
	return arr
}

/**
 * 变更标注分类
 * @param {Void}
 * @returns {Void}
 */
function changeTypePolygon() {
	function changeJsArray(ar, imgid, polygonId) {
		var imgObj = ar[mark_image_index];
		if (imgObj.imgID == imgid) {
			var oldCircleData = imgObj.circle_datas;
			for (var i = 0; i < oldCircleData.length; i++) {
				if (oldCircleData[i].id === polygonId) {
					oldCircleData[i].typeId = typeId
					oldCircleData[i].typeName = typeName
					break
				}
			}
		}
	}

	if (delPolygon != null) {
		// 获取旧的分类
		var old_typeId = delPolygon.getAttribute('typeId');
		var old_typeName = delPolygon.getAttribute('typeName');

		// set 更改 SVG 视图
		delPolygon.setAttribute('typeId', typeId);
		delPolygon.setAttribute('typeName', typeName);
		// 在分类池里减去这个删除的
		if (old_typeId !== "" && old_typeId !== null) {
			addOrSubNumber = -1
			// 调用分类变动方法
			changeTMCObjectCountFunc(old_typeId, old_typeName, addOrSubNumber)
		}
		// get 要改的框的数据
		var id = delPolygon.getAttribute('id');
		var imgId = delPolygon.getAttribute('imgId');
		var pointids = delPolygon.getAttribute('pointids');
		// 更改 jsarray
		changeJsArray(jsarray, imgId, id)
		console.log(typeId)
		console.log(typeName)
		// 提交
		// 提交后在分类池里加上
		addOrSubNumber = 1
		saveSubmitFunc()

		tagFlag = true;
		delPolygon = null
	}
	// 隐藏菜单
	$('#jqContextMenu').css('display', 'none');
}

// EDIT ===>>> 0907
/**
 * 清除单张图的标注
 * @param {Void}
 * @returns {Void}
 */
function clearMarkOneFunc() {
	svgEmptyFunc()
	circleDatasEmptyFunc(jsarray[mark_image_index])

}

/**
 * 清除所有标注
 * @param {Void}
 * @returns {Void}
 */
function clearMarkAllFunc() {
	svgEmptyFunc()
	circleDatasEmptyAllFunc(jsarray)
}

/**
 * 清除SVG
 * @param {Void}
 * @returns {Void}
 */
function svgEmptyFunc() {
	$("#" + svgId).empty();
}

/**
 * 清除 circle_datas 一张
 * @param {Object} imgObj 一张图的数据
 * @returns {Void}
 */
function circleDatasEmptyFunc(imgObj) {

	var type_arr = []

	var circleDatas = imgObj.circle_datas
	// 记录分类 用来分类池更新
	circleDatas.forEach(function (item) {
		type_arr.push({
			typeId: item.typeId,
			typeName: item.typeName
		})
	})

	// circleDatas 清空
	if (typeof circleDatas === "object" && typeof circleDatas.length === "number") {
		circleDatas.length = 0
	}
	// 提交
	saveSubmitFunc({
		type: 'clear_one',
		data: type_arr
	})
}

/**
 * 清除 circle_datas 全部
 * @param {Array} ar jsarray 总共的标注数据数组
 * @returns {Void}
 */
function circleDatasEmptyAllFunc(ar) {
	// 每个 imgObj 的 circle_datas 都清零
	ar.forEach(function (imgObj) {
		imgObj.circle_datas.length = 0

		delete imgObj.imgNowWidth
		delete imgObj.imgNowHeight
	})
	// 拷贝
	var copyed_obj = objectCopy(ar);
	// 转一下
	var tagJson = JSON.stringify(copyed_obj);
	var caseId
	if (typeof networkImagePageData !== "undefined" && typeof networkImagePageData.caseId !== "undefined") {
		caseId = networkImagePageData.caseId
	}
	// 装载数据
	var re = {
		caseId: caseId,
		tagJson: tagJson
	};
	// 装载ini
	var ini = {
		type: 'clear_all',
		data: null
	}
	// 提交
	saveEmptyAllCoreFunc(re, ini)
}

/**
 * 历史标注方法
 * @param {Object} data 从接口获取到的历史数据
 * @returns {Void}
 */
function paintingHistoryMarkFunc(data) {
	var paint_width_a = 1.5
	var paint_width_b = 1

	function load_data_func(data) {
		var circle_datas = data.circle_datas
		var imgId = data.id;

		if (circle_datas != null && circle_datas.length > 0) {
			//var polygCount=0;
			for (var p in circle_datas) {
				var point_set = []

				var pointObj = circle_datas[p]
				//画点
				var circle = pointObj.circle;
				//多边形Id
				var polygonId = pointObj.id;
				var typeId = pointObj.typeId;
				var typeName = pointObj.typeName;
				var modelTypeId = pointObj.modelTypeId;
				var modelTypeName = pointObj.modelTypeName;
				// EDIT ===>>> 0520
				var svgType = pointObj.svgType;
				// EDIT ===>>> END
				if (circle != null && circle.length > 0) {
					for (var i in circle) {
						var x = circle[i].x;
						var y = circle[i].y;
						var pointId = circle[i].id;
						// 画点
						var point = add_point_func(x, y, imgId, pointId);
						point_set.push(point);
					}
				}
				// 渲染已有的
				// 画多边形
				add_polygon_func(point_set, imgId, typeId, typeName, polygonId, svgType, modelTypeId, modelTypeName);
			}
		} else {
			console.log("数据???")
		}
	}

	function add_point_func(x, y, imgId, id) {
		var rectObj = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		if (rectObj) {
			rectObj.setAttribute("cx", x);
			rectObj.setAttribute("id", id);
			rectObj.setAttribute("imgId", imgId);
			rectObj.setAttribute("cy", y);
			rectObj.setAttribute("r", paint_width_a);
			rectObj.setAttribute("style", "fill:" + color + ";stroke-width:1;stroke:" + color + "");

			rectObj.setAttribute("data-history", "history");
			// 画
			mysvg.appendChild(rectObj);
			//为每个圆形添加事件绑定
			rectObj.onmouseover = function () {
			}
			rectObj.onmousedown = function () {
			}
			rectObj.onmousemove = function () {
			}
			rectObj.onmouseup = function () {
			}
			rectObj.onclick = function () {
			}
		}
		return rectObj;
	}

	function add_polygon_func(pointSet, imgId, typeId, typeName, polygonId, type, modelTypeId, modelTypeName) {
		var points = '';
		var pointIds = '';
		var pointObjs = '[';
		for (var i in pointSet) {
			var point = mysvg.getElementById(pointSet[i].id);
			//console.log(point);
			//console.log(polygonId);
			point.setAttribute('polygonid', polygonId);
			var x = pointSet[i].getAttribute('cx');
			var y = pointSet[i].getAttribute('cy');

			pointIds = pointIds + pointSet[i].getAttribute('id');
			pointObjs = pointObjs + '{id:"' + pointSet[i].getAttribute('id') + '",x:' + x + ',y:' + y + '}';
			points = points + x + ',' + y;
			if (i < pointSet.length - 1) {
				points = points + ' ';
				pointObjs = pointObjs + ',';
				pointIds = pointIds + ',';
			}
		}
		pointObjs = pointObjs + ']';
		var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		if (polygon) {
			polygon.setAttribute('typeId', typeId);
			polygon.setAttribute('typeName', typeName);
			polygon.setAttribute('modelTypeName', modelTypeName);
			polygon.setAttribute('modelTypeId', modelTypeId);
			polygon.setAttribute('imgId', imgId);
			polygon.setAttribute('id', polygonId);
			polygon.setAttribute('pointids', pointIds);
			polygon.setAttribute("points", points);
			polygon.setAttribute("data-history", "history");
			// EDIT ===>>> 0520
			if (!type) {
				polygon.setAttribute('data-svgtype', 'polygon');
			} else {
				polygon.setAttribute('data-svgtype', type);
			}
			// EDIT ===>>> END
			var color = historyColor
			polygon.setAttribute("style", "stroke:" + color + ";stroke-width:1;fill-opacity:0.0;");
			mysvg.appendChild(polygon);
			//绑定鼠标点击事件
			polygon.onclick = function () {
			}
			polygon.onmouseover = function (event) {
				var color = historyColor

				tip.start(this)
				this.setAttribute("style", "stroke:" + color + ";stroke-width:1.5;fill-opacity:0.0;");
			}
			polygon.onmouseout = function (event) {
			}
			polygon.onmouseup = function (event) {
			}

		}
		//鼠标右击事件
		return polygon;
	}

	function remove_history_func() {
		// 找到属于历史数据的点和框 原来的点和框不动
		var arr_1 = $('polygon[data-history="history"]');
		var arr_2 = $('circle[data-history="history"]');

		// console.log(arr_1)
		// console.log(arr_2)

		// 从SVG画板中移除
		arr_1.each(function () {
			console.log($(this)[0])
			mysvg.removeChild($(this)[0])
		})
		arr_2.each(function () {
			console.log($(this)[0])
			mysvg.removeChild($(this)[0])
		})

	}

	// console.log("历史标注")
	// console.log(data)

	if (historyFlag) {
		// 把数据转一下
		data.circle_datas = JSON.parse(data.tagJson)
		// 历史数据的标注颜色不一样
		var color = historyColor
		// 之前的转换方法只能喂数组进去 所以造一些数组
		parseCoorOutputFunc([data], [dataToSubmitModelMultipleNumber[mark_image_index]])
		// 核心方法
		load_data_func(data)
	} else {
		// 如果已经画了历史数据 就清掉
		remove_history_func()
	}
	// 历史数据布尔值 点一下显示历史数据 再点一下清掉历史数据
	historyFlag = !historyFlag
}

// EDIT ===>>> END