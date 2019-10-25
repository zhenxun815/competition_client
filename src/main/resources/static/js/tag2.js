// todo
// URL 需要根据环境更换
// var url_dicomImagePath = "http://192.168.1.176:8080/viewImg?path="
// var url_dicomImagePath = "/viewImg?path="
// 路径前缀
var url_dicomImagePath
// var url_dicomImagePath = ""

// === 这两个值是svg原点与窗口原点的距离，必须正确设置才能得到正确的标注 ===
// left 距离视窗左边
// 宽度是 1366时 这个值为 413
// 为了让这个值可以计算正确，相应区域的ID必须为mark_tree

// 把原先的一个值提出来
// var left_margin = 0
// 分类树 DIV 距离屏幕左侧的距离 现在是 0
var left_margin
// tips需要的偏移量 left X也用
// var mjs_tip_offset = (function () {
//   return document.getElementById('mark_tree') ? document.getElementById('mark_tree').clientWidth : 0
// })()
// 分类树 DIV 的宽度
var mjs_tip_offset
// === 这两个值是svg原点与窗口原点的距离，必须正确设置才能得到正确的标注 ===
// leftX 距离左边
// var leftX = left_margin + mjs_tip_offset;
// leftX 可以通过 left_margin 和 mjs_tip_offset 求得
var leftX
// top 距离视窗上边
// var topY = 0
var topY
// === END
// var jqContextMenuOffsetLeftNumber = (leftX - left_margin) + 20
// 菜单距离鼠标的偏差
// 现在是20
var jqContextMenuOffsetLeftNumber

// EDIT ===>>> 0826
// 只需要渲染一次的那些东西是否渲染过了
// var mountedOnceFlag = true
// EDIT ===>>> END

// todo
// OriginA -> imgArray
// 需要两个数组区分原始数据和显示的数据
// 这三个在正式中会被赋值替换
// 模拟的数据
// 实际使用时会被覆写

// 模拟的数据 networkImagePageData.imgArray = OriginA
// 实际使用时没用上
var networkImagePageData = {
	"editFlag": "1",
	"tagFlag": 0,
	"caseId": "107d2d2f7b4342e08d2595cb9f1c98f4",
	"caseName": "肺结节第二批_21",
	"imgArray": A,
	"msgSpan": "(0/2 例)"
}

// 模拟的数据
// 实际使用时会用JSP注入到页面DOM里 需要数据时从DOM里拿
var modelTypeNameStringArray = ['肺结节', '小结节']

// var topicStringArray = [{
//   id:
// }]

/**
 * 过滤器 | 现在之后拷贝的作用 防止 A　污染　OriginA
 * @param {Array} arr 原数组
 * @returns {Array} 新数组
 */
var FilterGetterB = function (arr) {
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
		// console.log(o)
		return o
	}
	arr.forEach(function (item, index) {
		// todo
		// 此处需要根据实际情况写判定条件
		// item.id 只是一个举例
		if (item.id) {
			// console.log(item)
			new_arr.push(new_circle_func(item))
		}
	})
	return new_arr
}
/**
 * 过滤器 | 现在之后拷贝的作用 防止 A　污染　OriginA
 * @param {Object} item 原对象
 * @returns {Object} 新对象
 */
var FilterFuncA = function (item) {
	var o = {}
	for (var i in item) {
		if (i === "circle_datas") {
			// o[i] = item[i].map(FilterFuncB)
			o[i] = FilterGetterB(item[i])
		} else {
			o[i] = item[i]
		}
	}
	return o
}

/**
 * 把接口拿到的标注数据拷贝一下
 * @param {Array} OriginA 原数组
 * @returns {Array} 新数组
 */
function getAFunc(OriginA) {
	return OriginA.map(FilterFuncA)
}

/**
 * 切病例时调的方法 实际使用的时候情况不同 所以没用上
 * @param {Void}
 * @returns {Void}
 */
function jumpFunc() {
	// 可以在这里赋值 OriginA
	alert("OriginA = new OriginA")
	RenderFunc(OriginA)
}

// EDIT ===>>> 0826
/**
 * 渲染方法
 * 进来时会调 切病例时也会调 和获取标注数据的接口对接
 * @param {Array} OriginA 从接口拿到的标注数据的数组
 * @returns {Void}
 */
function RenderFunc(OriginA) {
	// 拷贝数据
	A = getAFunc(OriginA)

	// 第一次不需要调重置方法 但切病例时需要
	if (!mountedOnceFlag) {
		BEFORE_DESTORY_FUNC()
	}

	// 开始调渲染流
	MOUNTED_FUNC(A)

	// 在注入配置时会调 MOUNTED_ONCE 所以这里不再调
	// if (mountedOnceFlag) {
	//   MOUNTED_ONCE()
	// }

	// 最后置一下状态
	mountedOnceFlag = false
}

// EDIT ===>>> END

/**
 * 样式切换方法
 * @param {Object} self jquery选择器拿到的实例
 * @returns {Void}
 */
function toggleClassFunc(self) {
	if ($(self).hasClass("active")) {
		$(self).removeClass("active")
	} else {
		$(self).addClass("active")
	}
}

// 声明进度条实例
var sliderEle;
// layui渲染方法
// 注意 layui的渲染是异步的 类似于 $(document).ready(function(){})
layui.use(['layer', 'slider', 'form', 'table', 'element'], function () {

	// 用一个对象装载 layui 组件
	var lu = {}
	lu.layer = layui.layer;
	lu.slider = layui.slider;
	lu.form = layui.form;
	lu.table = layui.table;
	lu.element = layui.element;

	// 挂载 tips 提示
	$("#tips_back").on("mouseover", function () {
		layui.layer.tips('返回', this, {
			tips: 2
		})
	})
	$("#tips_delete").on("mouseover", function () {
		layui.layer.tips('删除', this, {
			tips: 2
		})
	})
	$("#tips_distribution").on("mouseover", function () {
		layui.layer.tips('分配任务', this, {
			tips: 3
		})
	})
	$("#tips_back, #tips_distribution, #tips_delete").on("mouseout", function () {
		layui.layer.closeAll('tips');
	})

	// 在下一个方法继续初始化
	layuiInitFunc(lu)
	// 初始化ztree
	zTree_init_func()

	// console.log("layui.use===", new Date().getTime())

})

// *** 从 MOUNTED 抽出来的 START ***
/**
 * 计算视区
 * @param {Object} localViewPortSize 存储视区宽高的对象
 * @returns {Void}
 */
function calcViewPortSizeFunc(obj) {
	// var width_sub = 746
	// 需要减去的屏幕宽度
	var width_sub = document.getElementsByClassName('mark-core-tree-zone')[0].clientWidth + document.getElementsByClassName('mark-core-data-zone')[0].clientWidth
	obj.width = window.innerWidth - width_sub
	obj.height = window.innerHeight
}

/**
 * 通过 视区宽高 图片原宽高 倍率 计算 图片现在应该显示的宽高
 * @param {Object} natural 图片原宽高对象
 * @param {Object} viewport 视区宽高对象
 * @param {Object} display_initial 图片现宽高对象
 * @param {Number} index 下标
 * @returns {Void}
 */
function calcImageDisplaySizeFunc(natural, viewport, display_initial, index) {
	// 计算图片显示倍率
	function fn(natural, viewport) {
		var obj = {
			width: natural.width / viewport.width,
			height: natural.height / viewport.height
		};
		var multiple = Math.max(obj.width, obj.height);
		return multiple;
	}

	dataToSubmitModelMultipleNumber[index] = fn(natural, viewport);
	display_initial.width = natural.width / dataToSubmitModelMultipleNumber[index];
	display_initial.height = natural.height / dataToSubmitModelMultipleNumber[index];
}

/**
 * 根据倍率转换标注点的坐标 | 显示用
 * @param {Array<Object>} res 标注数据数组
 * @param {Array<Number>} multiple_array 倍率数组
 * @returns {Void}
 */
function parseCoorOutputFunc(res, multiple_array) {
	// item_1 图片对象
	// item_2 多边形对象
	// item_3 点对象
	res.map(function (item_1, index_1) {
		// circle_datas
		item_1.circle_datas.map(function (item_2) {
			item_2.circle.map(function (item_3) {
				item_3.x = item_3.x / multiple_array[index_1];
				item_3.y = item_3.y / multiple_array[index_1];
			});
		}); // imgWidth imgHeight -> imgNowWidth imgNowHeight

		item_1.imgNowWidth = item_1.imgWidth / dataToSubmitModelMultipleNumber[index_1];
		item_1.imgNowHeight = item_1.imgHeight / dataToSubmitModelMultipleNumber[index_1];
	});
}

// *** 从 MOUNTED 抽出来的 END ***

/**
 * 改变标注状态
 * @param {Number} index 状态值 3 进入标注状态 0 进入查看状态
 * @returns {Void}
 */
function changeMarkTypeFunc(index) {
	// 权限检测
	if (typeof isOnlyView === "boolean" && isOnlyView === true) {
		tips_message_func('当前场景仅能查看，请前往数据标注页进行修改..')
		return
	} else if (!permissionFlag) {
		tips_message_func('您没有这个样本的标注权限..')
		return
	}
	if (!checkZtreeClickFunc()) {
		tips_message_func('请选择标注分类..')
		return
	}
	// 如果不是标注状态就改成标注状态
	// 如果是标注状态就退出标注状态
	var status = markButtonLightIndex === index ? 0 : index
	markButtonLightIndex = status
	// 标注状态绑定smartzoom
	// 查看状态解绑smartzoom
	if (status === 3) {
		if (checkZtreeClickFunc()) {
			zoom()
			$("#mark_mark").addClass("active")
			var mfs = markFashionString
			$("#mark_polygon, #mark_rect").removeClass("active")
			$("#mark_" + mfs).addClass("active")
		} else {
			changeMarkTypeFunc(0)
		}
	} else if (status === 0) {
		reload_painting_when_image_change_func()
		tagFlag = false;
		unbundZoom()
		$("#mark_mark").removeClass("active")
	}

	// EDIT ===>>> 20190827
	// 根据标注状态和现在标注的图形决定是否显示辅助线
	showOrHideHLFunc(status)
	// EDIT ===>>> END
}

/**
 * 变更当前的标注图形
 * @param {String} markFashionString 当前标注的图形 polygon or rect
 * @returns {Void}
 */
function markFashionStringChangeFunc(string) {
	// 清除画了一半的图形
	clear_uncomplete_mark_func()
	// set 变量
	markFashionString = string
	// 绑定事件
	bind_mouse_event_func()
	// 变更视图样式
	$("#mark_polygon, #mark_rect").removeClass("active")
	$("#mark_" + string).addClass("active")

	// 辅助线
	showOrHideHLFunc(3)
}

// EDIT ===>>> 20190711

// function tips_message_func(string) {
//   // 没有layui的时候用alert提示
//   var classic_func = function () {
//     alert(string)
//   }
//   // 有layui就用Layui
//   var tips_func = function (layer, string) {
//     layer.msg(string);
//   }

//   if (!layui) {
//     classic_func()
//     return
//   }
//   // 引入layui还是直接引入layer都可以
//   var layer = layui.layer || layer
//   if (!layer) {
//     classic_func()
//     return
//   } else {
//     tips_func(layer, string)
//   }
// }
// EDIT ===>>> END

// 先声明
// 它会用来装 OriginA
var A
// MOUNTED_FUNC(A)
// MOUNTED_ONCE()


// 检测失去焦点 清除标了一半的多边形

/**
 * 切病例时需要销毁并重置一些东西
 * @param {Void}
 * @returns {Void}
 */
function BEFORE_DESTORY_FUNC() {
	// 重置标注
	reload_painting_when_image_change_func()
	tagFlag = false;
	// 解绑
	unbundZoom()
	// 置样式
	$("#mark_mark").removeClass("active")
	// 重置一些变量
	reload_painting_data_func()
	// 重置一些交互控件
	$("#t_r_btn_a,#t_r_btn_b,#t_r_btn_c,#t_r_btn_d,#t_r_btn_e,#t_r_btn_f").removeClass("active")
	$(".cityId, .cityAll").prop("checked", true);
}

/**
 * 初始化入口 | 核心方法
 * 第一次进入 切病例 时都会调这个方法
 * @param {Array<Object>} A 初始化需要的标注数据
 * @returns {Void}
 */
function MOUNTED_FUNC(A) {
	// 数据错误时跳出，防止卡死
	if (typeof A !== "object" || A.length === 0) {
		$(".fm-word").html("数据错误，返回前一页面...")
		setTimeout(function () {
			// window.parent.layer.closeAll()
		}, 1000)
		return
	}
	// console.log("======== " + new Date().getTime())

	// 计算SVG视区
	calcViewPortSizeFunc(localViewPortSize)

	// 模型分类
	makeMTDOMfunc()
	// natural 图片原始宽高 | object
	var img_arr = A;
	var img_arr_single = A[0];

	var imageNaturalSize = [];
	img_arr.forEach(function (item) {
		// 计算图片原始宽高
		imageNaturalSize.push({
			width: item.imgWidth,
			height: item.imgHeight
		});
	});

	// 遍历标注数据并做一些记录和处理
	img_arr.map(function (item, index) {
		// 声明现宽高数组中的对象
		imageInitialDisplaySize[index] = {};
		// 计算图片现在应该显示的宽高
		calcImageDisplaySizeFunc(imageNaturalSize[index], localViewPortSize, imageInitialDisplaySize[index], index);

		// EDIT ===>>> 20190823
		// 记录图片序列中的图是否标过
		setImageMarkMapFunc(item.imgID, item.tagFlag)
		// EDIT ===>>> END

		// EDIT ===>>> 20190826
		// 遍历标注数据
		item.circle_datas.forEach(function (item_1) {
			// 如果没有分数就加个分数
			if (typeof item_1.score === "undefined") {
				item_1.score = "100"
			}
			// 如果 typeId 不合法就跳过这一个
			if (item_1.typeId === "" || item_1.typeId === null) {
				return
			}
			// id 框的ID typeId 分类的ID
			var obj = type_mark_count_object[item_1.typeId]

			// 把分类数据存在对象里
			if (typeof obj === "object") {
				obj.count++
			} else if (typeof obj === "undefined") {
				setTMCObjectFunc(item_1.typeId, item_1.typeName)
			}
		})
		// EDIT ===>>> END
	});

	// console.log(type_mark_count_object)

	// 渲染分类池DOM
	makeTMCDOMFunc()

	// console.log(imageInitialDisplaySize)
	// 计算应该显示的坐标
	parseCoorOutputFunc(img_arr, dataToSubmitModelMultipleNumber);

	// console.log("======== " + new Date().getTime())

	// 给jsarray赋值
	jsarray = A;
	// 长度也记一下
	mark_image_length = A.length;

	// 真正的渲染核心
	mark_image_init_func(jsarray, mark_image_index);
	// 设置SVG宽高
	change_svg_size(img_arr_single.imgNowWidth, img_arr_single.imgNowHeight)

	// smartzoom
	// 切图事件
	$("#" + svg_father_id).unbind("mousewheel")
	$("#" + svg_father_id).bind("mousewheel", function (event, delta) {
		tagMousewheel(event, event.originalEvent.deltaY);
	});

	// $(document).unbind();
	// $(document).keydown(function (event) {
	//   otherButtonClickHandler(event)
	//   if (tagFlag == true) {
	//     moveButtonClickHandler(event);
	//   }
	// });
	// 修改用户看到的图片序列信息|左上角
	getNowImageIndexFunc()

	// 各种按钮事件绑定
	$("#delete").bind("click", function (event) {
		deletePolygon()
	});

	// EDIT ===>>> 0829
	$("#change_type").bind("click", function (event) {
		changeTypePolygon()
	});
	// EDIT ===>>> END

	$(".mark-enter").unbind("click");
	$(".mark-enter").bind("click", function (event) {
		changeMarkTypeFunc(3)
		event.stopPropagation()
	});

	$("#mark_polygon, #mark_rect").unbind("click");
	$("#mark_polygon").bind("click", function (event) {
		// EDIT ===>>> 20190805
		clear_uncomplete_mark_func()
		// EDIT ===>>> END
		markFashionStringChangeFunc('polygon')
		event.stopPropagation()
	});
	$("#mark_rect").bind("click", function (event) {
		// EDIT ===>>> 20190805
		clear_uncomplete_mark_func()
		// EDIT ===>>> END
		markFashionStringChangeFunc('rect')
		event.stopPropagation()
	});

	// 生成序列DOM并输出
	var flz_html = ""
	var have_mark_boolean = false
	img_arr.forEach(function (item, index) {
		if (imageMarkObject[item.imgID]) {
			// EDIT ===>>> 20190808
			circleDatasMaSNumber++
			// EDIT ===>>> END

			have_mark_boolean = true
			flz_html += ('<div class="mi-f mark-index active" onclick="flz_jump_func(' + index + ')"><span class="m-icon"></span>' + (index + 1) + '</div>')
		} else {
			flz_html += ('<div class="mi-f mark-index" onclick="flz_jump_func(' + index + ')"><span class="m-icon"></span>' + (index + 1) + '</div>')
		}
	});
	$(".flz-core").html(flz_html)
	$(".mi-f.mark-index").eq(0).addClass("the-index");
	$("#imageMarkSpan").html(" (" + circleDatasMaSNumber + "/" + mark_image_length + ")张")

	// EDIT ===>>> 20190805
	// 加辅助线
	addHelpLineFunc()
	// EDIT ===>>> END

	// EDIT ===>>> 20190825
	// 渲染layui checkbox
	if (typeof layui === "object" && typeof layui.form === "object") {
		layui_checkbox_render_func(layui.form)
	}
	// EDIT ===>>> END

	// 如果在切病例之前就处于标注状态 且有当前标注权限 就维持标注状态
	if (markButtonLightIndex === 3) {
		markButtonLightIndex = 0
		if (permissionFlag) {
			changeMarkTypeFunc(3)
		} else {
			tips_message_func('您没有这个样本的标注权限..')
		}
	}
}

/**
 * 只需要初始化一次的东西
 * @param {Void}
 * @returns {Void}
 */
function MOUNTED_ONCE() {
	var my_color = document.getElementById("my_color")
	if (my_color) {
		my_color.value = baseColor.replace(/#/g, "");
	}

	// 张手动跳转
	$("#choose_manual_button").click(function () {
		var check = function (number) {
			if (number > mark_image_length - 1) {
				tips_message_func('超过最后一张的页码，无法跳转..')
				return false
			}
			if (number < 0) {
				tips_message_func('请不要输入零和负数..')
				return false
			}
			return true
		}
		// alert(but)
		// picture 张
		// sample 例
		var p = $("#choose_manual_value").val()
		if (!isNaN(parseInt(p))) {
			var page = parseInt(p) - 1
			if (check(page)) {
				mark_image_index = page
				change_page_func()
			}
		} else {
			tips_message_func('请输入合法的数字..')
		}

	})
	$("#choose_manual_value").unbind();
	$("#choose_manual_value").bind('keydown', function (e) {
		if (e.keyCode === 13) {
			$("#choose_manual_button").click();
		}
	});
	$(function () {
		key_down_func()
	})

	// TEST
	/*$("#jump_button_b").click(function () {
		// permissionFlag = !permissionFlag
		RenderFunc(OriginA)
	})*/
}

// EDIT ===>>> 0902
/**
 * 注入配置方法
 * 线上项目没有这个 请自行考虑是否添加注入配置功能
 * @param {Object} config 配置对象
 * @returns {Void}
 */
function TagInitFunc(config) {

	var set_color_func = function (color, def_color) {
		return (typeof color === "string" && color.length === 7) ? color : def_color
	}

	var markTreeId

	url_dicomImagePath = (typeof config.url_dicomImagePath === "string") ? config.url_dicomImagePath : "/viewImg?path=";
	left_margin = config.left_margin ? config.left_margin : 0;

	markTreeId = (config.RenderDomId && config.RenderDomId.markTreeId) ? config.RenderDomId.markTreeId : "mark_tree";
	mjs_tip_offset = (function (id) {
		return document.getElementById(id) ? document.getElementById(id).clientWidth : 0
	})(markTreeId)

	// leftX 可以直接设定 也可以用 left_margin mjs_tip_offset 计算
	leftX = config.leftX ? config.leftX : left_margin + mjs_tip_offset;
	topY = config.topY ? config.topY : 0;
	jqContextMenuOffsetLeftNumber = config.jqContextMenuOffsetLeftNumber ? config.jqContextMenuOffsetLeftNumber : 20;

	// 默认颜色也是可调的 现在是红色 注意别漏了#符号
	baseColor = set_color_func(config.Colors ? config.Colors.baseColor : "#FF0000", "#FF0000")
	wordColor = set_color_func(config.Colors ? config.Colors.wordColor : "#FF0000", "#FF0000")

	svg_father_id = (config.RenderDomId && config.RenderDomId.svg_father_id) ? config.RenderDomId.svg_father_id : "svg_my_father";
	svgId = (config.RenderDomId && config.RenderDomId.svgId) ? config.RenderDomId.svgId : "svg_my";
	mysvg = document.getElementById(svgId);

	// 在这里加上onblur方法 防止离开页面时有标注残留
	mysvg.onblur = function () {
		clear_uncomplete_mark_func()
	}

	// 目前支持 polygon rect 想关掉其中一个也是可以的
	markFashionString = (function (arr) {
		var obj = {}
		var check_func = function (graph) {
			if (!obj[graph]) {
				$("#mark_" + graph).parent().unbind().remove()
			}
		}
		arr.forEach(function (item) {
			obj[item] = item
		})
		check_func('polygon')
		check_func('rect')
		return arr[0]
	})(
		(typeof config.graphArray === "object" && typeof config.graphArray.length === "number" && config.graphArray.length > 0) ?
			config.graphArray : ['polygon', 'rect']
	)

	tipFont = (typeof config.TipFont === "object" && config.TipFont !== null) ? Object.assign(tipFont, config.TipFont) : tipFont

	pointOffOffset = (config.SVGGraphSize && typeof config.SVGGraphSize.pointOffOffset === "number") ? Math.abs(config.SVGGraphSize.pointOffOffset) : 3

	// [平时点的大小 标注时第一个点的大小 触摸上去时点的大小]
	// 考虑了各种情况 不传或者传一部分值也是可以的
	pointSizeArray = (function (arr) {
		var dv = [1.5, 3, 6]
		if (arr === null) {
			return dv
		} else if (typeof arr === "number") {
			return [arr, arr, arr]
		} else if (typeof arr === "object" && arr.length === 1) {
			return [arr[0], arr[0], arr[0]]
		} else if (typeof arr === "object" && arr.length === 2) {
			return [arr[0], arr[1], arr[1]]
		} else if (typeof arr === "object" && arr.length > 2) {
			return [arr[0], arr[1], arr[2]]
		} else {
			return dv
		}
	})(
		(config.SVGGraphSize && typeof config.SVGGraphSize.pointSizeArray) ?
			config.SVGGraphSize.pointSizeArray : null
	)

	// 不传ztree配置时会给一个比较简单的配置（但没有什么功能）
	ztreeSetting = config.ztreeSetting ?
		config.ztreeSetting : {
			data: {
				simpleData: {
					enable: true
				}
			}
		}

	console.log("url_dicomImagePath", url_dicomImagePath)
	console.log("left_margin", left_margin)
	console.log("mjs_tip_offset", mjs_tip_offset)
	console.log("leftX", leftX)
	console.log("topY", topY)
	console.log("jqContextMenuOffsetLeftNumber", jqContextMenuOffsetLeftNumber)
	console.log("baseColor", baseColor)
	console.log("wordColor", wordColor)
	console.log("svg_father_id", svg_father_id)
	console.log("svgId", svgId)
	console.log("markFashionString", markFashionString)
	console.log("tipFont", tipFont)
	console.log("pointOffOffset", pointOffOffset)
	console.log("=== INIT END ===")

	// 把只渲染一次的渲染方法放这里了
	MOUNTED_ONCE()
}

// EDIT ===>>> END

// 当前是第几张图？一共几张图？
/**
 * 更新标了多少张的提示
 * @param {Void}
 * @returns {Void}
 */
function getNowImageIndexFunc() {
	var imageIndexString = "（".concat(mark_image_index + 1, "/").concat(mark_image_length, "张）");
	$("#specimen_address_index").html(imageIndexString)
}

/**
 * 激活标注按钮
 * @param {Void}
 * @returns {Void}
 */
function auto_start_mark() {
	$("#mark_mark").click();
}

/**
 * 提示方法
 * @param {String} 提示语
 * @returns {Void}
 */
function tips_message_func(string) {

	var classic_func = function () {
		alert(string)
	}
	var tips_func = function (layer, string) {
		layer.msg(string, {
			time: '2000'
		});
	}

	if (!layui) {
		classic_func()
		return
	}
	var layer = layui.layer || layer
	if (!layer) {
		classic_func()
		return
	} else {
		tips_func(layer, string)
	}
}

/**
 * 序列里面的跳张方法
 * @param {Number} page 页码
 * @returns {Void}
 */
function flz_jump_func(page) {
	/*if (jsarray[mark_image_index].circle_datas.length > 0) {
		$(".mi-f.mark-index").eq(mark_image_index).addClass("active");
	}*/
	mark_image_index = page
	change_page_func()
}

/**
 * 更新序列中页数显示激活的方法
 * @param {Number} page 页码
 * @returns {Void}
 */
function changeListIndexFunc(page) {
	$(".mi-f.mark-index").removeClass("the-index");
	$(".mi-f.mark-index").eq(page).addClass("the-index");
}

/**
 * 记录每一张图的标注数量的方法
 * @param {String} id 图片id
 * @param {Number} number 标注数量
 * @returns {Void}
 */
function setImageMarkMapFunc(id, number) {
	imageMarkObject[id] = number
}

/**
 * 绑定键盘事件
 * @param {Void}
 * @returns {Void}
 */
function key_down_func() {
	$(document.body).unbind("keydown", document_keydown_enter);
	$(document.body).bind("keydown", document_keydown_enter);
	$(document.body)[0].tabIndex = '0';
	$(document.body).focus();
}

/**
 * 键盘事件的分发
 * @param {Object} event
 * @returns {Void}
 */
function document_keydown_enter(event) {
	// 新键盘事件入口
	otherButtonClickHandler(event)
	if (tagFlag == true) {
		moveButtonClickHandler(event);
	}
}

// EDIT ===>>> 0801
/**
 * 在提交之后记录这张图片的标注状态
 * @param {Object} res 接口返回的数据
 * @returns {Void}
 */
function changeMarkStatusWhenSaveFunc(res) {

	var img_arr = jsarray
	// 存起来，方便更新DOM
	setImageMarkMapFunc(res.data.id, res.data.tagFlag)

	// EDIT ===>>> 20190823
	// 数据返回检测方法
	var MaSFixedFunc = function (num) {
		return Math.min(Math.max(0, num), mark_image_length)
	}
	// EDIT ===>>> END

	// 图片 index
	var the_index
	// try catch 提高效率 不做多余的循环
	// circleDatasMaSNumber 已标注多少张的数字
	try {
		img_arr.forEach(function (item, index) {
			if (res.data.id === item.imgID) {
				the_index = index
				throw new error("success")
			}
		})
	} catch (e) {
		// 根据 tagFlag 不同 来更新DOM
		if (res.data.tagFlag == 1) {
			$(".mi-f.mark-index").eq(the_index).addClass("active");

			// EDIT ===>>> 20190823
			circleDatasMaSNumber = MaSFixedFunc(circleDatasMaSNumber + 1)
			// EDIT ===>>> END
		} else {
			$(".mi-f.mark-index").eq(the_index).removeClass("active");

			// EDIT ===>>> 20190823
			circleDatasMaSNumber = MaSFixedFunc(circleDatasMaSNumber - 1)
			// EDIT ===>>> END
		}
	}
}

// EDIT ===>>> END

// EDIT ===>>> 0823
/**
 * 渲染辅助线
 * @param {Void}
 * @returns {Void}
 */
function addHelpLineFunc() {
	// 如果已经渲染过了就清一下
	if ($("#help_line_x").length > 0 || $("#help_line_y").length > 0) {
		$("#help_line_x").unbind().remove();
		$("#help_line_y").unbind().remove();
	}

	var ox = document.createElement('div');
	var oy = document.createElement('div');
	ox.style.width = '100%';
	ox.style.height = '1px';
	ox.style.backgroundColor = '#D7D7D7';
	ox.style.position = 'absolute';
	ox.style.left = 0;
	ox.style.display = "none";
	ox.id = "help_line_x"
	// ox.style.transform = "translateX(-1px)"
	document.getElementsByClassName('mark-core-mark-zone')[0].appendChild(ox);
	oy.style.height = '100%';
	oy.style.width = '1px';
	oy.style.backgroundColor = '#D7D7D7';
	oy.style.position = 'absolute';
	oy.style.top = 0;
	oy.style.display = "none";
	oy.id = "help_line_y"
	// ox.style.transform = "translateY(-1px)"
	document.getElementsByClassName('mark-core-mark-zone')[0].appendChild(oy);

	// 辅助线移动方法
	// 辅助线偏移量也是可配置的
	document.onmousemove = function (e) {
		var e = e || event;
		var x = e.pageX - 330 - 2;
		var y = e.pageY - 2;
		ox.style.top = y + 'px';
		oy.style.left = x + 'px';
	}
}

/**
 * 显示（隐藏）辅助线
 * @param {Number} status 当前标注状态值
 * @returns {Void}
 */
function showOrHideHLFunc(status) {
	// 只有在标注状态和是矩形时才会激活辅助线
	if (status === 3) {
		if (markFashionString === "rect") {
			$("#help_line_x, #help_line_y").show()
		} else {
			$("#help_line_x, #help_line_y").hide()
		}
	} else {
		$("#help_line_x, #help_line_y").hide()
	}
}

/**
 * 检测是否是最后一张
 * 当病例里不止一张图 且切到最后一张图时给这个提示
 * @param {Void}
 * @returns {Void}
 */
function last_index_tips_func() {
	if (mark_image_length > 1) {
		if (mark_image_index === (mark_image_length - 1)) {
			tips_message_func('已经是最后一张..')
		}
	}
}

// EDIT ===>>> END

// EDIT ===>>> 0826
/**
 * 分类数据对象 type_mark_count_object 的增改
 * @param {Void}
 * @returns {Void}
 */
function setTMCObjectFunc(typeId, typeName) {
	// 数据检测
	if (typeof typeId !== "string" && typeof typeName !== "string" && typeId.length === 0 && typeName.length === 0) {
		return
	}
	// 能进来这个方法表示这个分类的标注至少有一个
	var typeId = typeId
	var typeName = typeName
	var number = 1
	var obj = {
		id: typeId,
		name: typeName,
		count: number
	}
	type_mark_count_object[typeId] = obj
}

// EDIT ===>>> END

/**
 * 变更标注分类对象计数的方法
 * 注意 当前版本因为一定会更新分类
 * 所以标好之后会清除当前标注并根据当前想显示的分类重绘
 * （这个方法稍微复杂一点）
 * @param {String} typeId 分类id
 * @param {String} typeName 分类名称
 * @param {Number} number 1 加 -1 减
 * @returns {Void}
 */
function changeTMCObjectCountFunc(typeId, typeName, number) {
	// layui DOM 更新方法
	function lfr() {
		if (typeof layui === "object" && typeof layui.form === "object") {
			layui.form.render('checkbox')
			// changeResultTypeFunc()
		}
	}

	/**
	 * @param {String} typeId 分类id
	 * @param {String} typeName 分类名称
	 * @returns {Boolean}
	 */
	function type_check_func(typeId, typeName) {
		if (typeId !== "" && typeName !== "") {
			return true
		} else {
			return false
		}
	}

	// 清除临时点和线
	function clear_func() {
		var arr = [tagLines, tagPoints, tagLines_rect, tagPoints_rect];
		arr.forEach(function (item) {
			if (typeof item.length === "number") {
				item.length = 0;
			}
		});
	}

	/**
	 * 更新checkbox状态的方法
	 * @param {String} typeId 分类id
	 * @param {Number} status 传给DOM的状态值
	 * @returns {Void}
	 */
	function setCBStatusFunc(typeId, status) {
		/**
		 * 根据checkbox状态判断是否勾选全选并更新DOM
		 * @param {Array<DOM>} city DOM数组
		 * @returns {Void}
		 */
		function allCheckFunc(city) {
			var boolean_arr = []
			city.each(function () {
				boolean_arr.push($(this).prop("checked"))
			})
			for (var i = 0; i < boolean_arr.length; i++) {
				var bool = boolean_arr[i]
				if (!bool) {
					$("#c_all").prop("checked", false);
					break;
				} else if (i === (boolean_arr.length - 1) && bool) {
					$("#c_all").prop("checked", true);
				}
			}
		}

		// 更新相应的DOM
		layui.$('input:checkbox[data-id="' + typeId + '"]').each(function () {
			$(this).prop("checked", status)
		})
		allCheckFunc($(".cityId"))
	}

	// 更新这个对象的数据
	var obj = type_mark_count_object[typeId]
	var old_count
	if (typeof obj === "object") {
		old_count = obj.count
		obj.count = Math.max(obj.count + number, 0)
	} else {
		old_count = 0
		obj = {
			id: typeId,
			name: typeName,
			count: Math.max(number, 0)
		}
		type_mark_count_object[typeId] = obj
	}
	// 更新分类checkbox视图
	// 三种情况
	// 1 不需要更新视图 old_count new_count(count) 都不是 0
	// 2 添加checkbox  old_count是0    new_count(count)不是0
	// 3 减少checkbox  old_count不是0  new_count(count)是0
	if (old_count === 0 && obj.count > 0) {
		var html = ""
		html += getDTTypesFunc(typeId, typeName)
		$("#types").append(html)

	} else if (old_count > 0 && obj.count === 0) {
		// console.log()
		layui.$('input:checkbox[data-id="' + typeId + '"]').each(function () {
			$(this).next('.layui-form-checkbox').remove(); //移除美化复选框样式
			$(this).remove(); //移除复选框
		})
		// $('input[data-id="' + typeId + '"]').unbind().remove();
	}
	if (addOrSubNumber > 0 && type_check_func(typeId, typeName)) {
		setCBStatusFunc(typeId, true)
	}
	// 清屏
	// console.log("????===========================", new Date().getTime())
	$("#" + svgId).empty();
	// console.log("????===========================", new Date().getTime())
	// 清除残留数组
	clear_func()
	// console.log("????===========================", new Date().getTime())
	// 重置过滤器并重绘
	enterFilter(1)
	// console.log("????===========================", new Date().getTime())
	// 更新layui DOM
	lfr()
}

/**
 * 有的时候会需要直接重绘分类数据DOM
 * @param {Array} arr
 * @returns {Void}
 */
function resetTypeMarkCountObjectFunc(arr) {
	function lfr() {
		if (typeof layui === "object" && typeof layui.form === "object") {
			layui.form.render('checkbox')
		}
	}

	var m = $(".cityId")
	var jsarray = jsarray

	// 清空分类数量对象
	type_mark_count_object = {}
	// 保存之前的选定状态
	var false_arr = {}
	// 把已经选中的存一下（重绘后DOM状态会变成初始状态）
	m.each(function () {
		var id = $(this)[0].dataset.id
		var bool = $(this).prop("checked")
		if (bool === false) {
			false_arr[id] = 1
		}
	})

	// 重设分类数量对象 type_mark_count_object
	jsarray.map(function (item, index) {
		// EDIT ===>>> 20190826
		item.circle_datas.forEach(function (item_1) {
			// id 框的ID typeId 分类的ID
			var obj = type_mark_count_object[item_1.typeId]
			if (typeof obj === "object") {
				obj.count++
			} else if (typeof obj === "undefined") {
				setTMCObjectFunc(item_1.typeId, item_1.typeName)
			}
		})
	});

	// 渲染分类池DOM
	makeTMCDOMFunc()

	var m = $(".cityId")
	// 恢复之前的选定状态
	m.each(function () {
		var id = $(this)[0].dataset.id
		if (typeof false_arr[id] !== "undefined") {
			$(this).prop("checked", false)
		}
	})
	// layui重渲染
	lfr()
}

/**
 * 清除分类池的选定
 * @param {Void}
 * @returns {Void}
 */
function clearTypeMarkCountObjectFunc() {
	function lfr() {
		if (typeof layui === "object" && typeof layui.form === "object") {
			layui.form.render('checkbox')
		}
	}

	type_mark_count_object = {}
	// 渲染分类池DOM
	makeTMCDOMFunc()
	lfr()
}

/**
 * 获取需要的分类DOM
 * @param {String} typeId 分类Id
 * @param {String} typeName 分类名称
 * @returns {Void}
 */
function getDTTypesFunc(typeId, typeName) {
	return '<input type="checkbox" name="' + typeId + '" data-id="' + typeId + '" class="cityId" lay-filter="c_other" lay-skin="primary" title="' + typeName + '" checked="true">'
}

/**
 * 输出需要的分类DOM
 * @param {Void}
 * @returns {Void}
 */
function makeTMCDOMFunc() {
	// console.log($("#types"))

	var string_obj = type_mark_count_object

	// 清空
	var html = ""

	$("#types").unbind();
	$("#types").html(html);

	// 输出
	for (var i in string_obj) {
		html += getDTTypesFunc(string_obj[i].id, string_obj[i].name)
	}

	$("#types").html(html);
}

/**
 * 获取需要的模型分类DOM
 * @param {String} typeId 模型分类id
 * @param {String} typeName 模型分类名称
 * @returns {Void}
 */
function getMTypesFunc(typeId, typeName) {
	return '<input type="checkbox" name="' + typeId + '" data-id="' + typeId + '" class="modelId" lay-filter="m_other" lay-skin="primary" title="' + typeName + '" checked="true">'
}

/**
 * 输出需要的模型分类DOM
 * @param {Void}
 * @returns {Void}
 */
function makeMTDOMfunc() {
	var html = ""
	$("#cb_models").unbind();
	$("#cb_models").html(html);
	for (var i in modelTypeNameStringArray) {
		html += getMTypesFunc('abc', modelTypeNameStringArray[i])
	}
	$("#cb_models").html(html);
}

/**
 * 清空全部的回调
 * @param {Void}
 * @returns {Void}
 */
function saveEmptyAllCallbackFunc() {
	circleDatasMaSNumber = 0
	imageMarkObject = {}
	$(".mi-f.mark-index").removeClass("active");
	$("#imageMarkSpan").html(" (" + circleDatasMaSNumber + "/" + mark_image_length + ") 张")
}

/**
 * 点击识别转标注按钮 弹出弹窗并给用户要转的框的分类的提示
 * @param {Void}
 * @returns {Void}
 */
function calcSynchronizationFunc() {
	/**
	 * 输出DOM
	 * @param {Array} arr
	 * @returns {Void}
	 */
	/*function makeDOMFunc(arr) {
		var html = ""
		arr.forEach(function (item) {
			if (item.typeId === un) {
				html += '<p style="color:red">未指定分类 ' + item.count + ' 个</p>'
			} else {
				html += '<p>分类 ' + item.typeName + ' ' + item.count + ' 个</p>'
			}
		})
		$("#layer_synchronization .synchronization-type-show").html(html)
	}*/

	// 类型数组
	var type = []
	// 类型数组的map
	var type_key = {}
	// 类型数组的map
	var type_key_reverse = []
	// 没有分类时
	var un = "UNKNOWN"
	// 初始下标
	var index = 0
	// 存储过滤后的数组
	var Synchronization = []
	// 清空全局变量
	saveSynchronizationArray = []
	// 遍历标注数据并把过滤后的数据注入到要提交的数组
	jsarray.forEach(function (item) {
		var obj = initPointFilterA(item)
		// if (obj.circle_datas.length > 0) {
		Synchronization.push(obj)
		// }
	})

	// 遍历circleDatas得到相关分类数量
	// map的作用是减少一轮遍历
	Synchronization.forEach(function (item) {
		var circleDatas = item.circle_datas
		circleDatas.forEach(function (item_1) {
			var id = item_1.typeId
			var name = item_1.typeName
			if (id === "") {
				id = un
				name = un
			}
			if (typeof type_key[id] === "undefined") {
				var obj = {}
				obj.typeId = id
				obj.typeName = name
				obj.count = 1
				type.push(obj)

				type_key[id] = index
				type_key_reverse[index] = id
				index++
			} else {
				var i = type_key[id]
				type[i].count++
			}
		})
	})

	// set 全局变量
	saveSynchronizationArray = Synchronization
	// 输出DOM
	//makeDOMFunc(type)
}