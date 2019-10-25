/**
 * 分类树 点击 核心方法
 * @param {Object} treeNode 树节点数据
 * @returns {Void}
 */
function zTreeOnClickCoreFunc(treeNode) {

	// EDIT ===>>> 0830
	// 权限校验
	if (typeof isOnlyView === "boolean" && isOnlyView === true) {
		tips_message_func('当前场景仅能查看，请前往数据标注页进行修改..')
		return
	} else if (!permissionFlag) {
		tips_message_func('您没有这个样本的标注权限..')
		return
	}
	// EDIT ===>>> END
	// 根分类检测
	if (treeNode.id == -1) {
		tips_message_func('请不要点击根分类..')
		if (markButtonLightIndex === 3) {
			changeMarkTypeFunc(0)
			typeId = null
			typeName = null
		}

		return false
	}

	// EDIT ===>>> 0520
	// EDIT ===>>> END

	// 事先声明好的name和id赋值，svg注解要用
	typeId = treeNode.id
	typeName = treeNode.name
	typeTid = treeNode.tId

	// 现阶段直接把状态置为3
	// EDIT ===>>> 0511
	// _this.changeMarkTypeFunc(3)
	reload_painting_when_image_change_func()
	markButtonLightIndex = 3

	// 点树节点的时候直接激活标注
	if (checkZtreeClickFunc()) {
		zoom()
		$("#mark_mark").addClass("active")
		var mfs = markFashionString
		$("#mark_" + mfs).addClass("active")

		// EDIT ===>>> 20190823
		showOrHideHLFunc(3)
		// EDIT ===>>> END
	} else {

	}

	tagFlag = true
	// hide_jqContextMenu()
	// EDIT ===>>> END
}

// todo
// 使用时需要注释return
// 把 re ajax 提交到后端即可
// 提交完成的回调需要调用 calcCircleDatasMarkedFunc() 计算已标注数量
/**
 * 实际使用会写在页面里
 * @param {Object} re 标注数据
 * @param {Object} ini 计算一些页面的东西可能需要的附加数据
 * @returns {Void}
 */
function saveSubmitCoreFunc(re, ini) {
	// 更新tip
	// tip.renderContentFunc(tip.changeContentFunc('<br>', typeName, modelTypeName))

	// 赋值caseId
	// 目前没有用上 但应当需要保证数据库里的数据正确
	var caseId = '${caseId}'
	if (typeof caseId === "string") {
		re.caseId = caseId
	}
	// console.log(re)

	// console.log("saveSubmitCoreFunc")
	// console.log(re)

	function type_check_func(typeId, typeName) {
		console.log(`type id is ${typeId}, type name is ${typeName}`)
		if (typeId !== "" && typeName !== "" && typeId !== null && typeName !== null) {
			return true
		} else {
			return false
		}
	}

	// if (typeId !== null && typeId !== "" && typeName !== null && typeName !== "") {
	if (addOrSubNumber > 0 && type_check_func(typeId, typeName)) {
		changeTMCObjectCountFunc(typeId, typeName, addOrSubNumber)
	} else if (type_check_func(deleteTypeId, deleteTypeName)) {
		changeTMCObjectCountFunc(deleteTypeId, deleteTypeName, addOrSubNumber)
	}
	// }
	circleDatasMarkedNumber = calcCircleDatasMarkedFunc()

	return

	$.ajax({
		url: "/ac/data/case/saveTagImg", //请求的url地址
		dataType: "json", //返回格式为json
		async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		data: re, //参数值
		type: "POST", //请求方式
		beforeSend: function () {
			//请求前的处理
		},
		success: function (res) {
			//请求成功时处理
			if (res.flag == 1) {
				circleDatasMarkedNumber = calcCircleDatasMarkedFunc()
			}
		},
		complete: function () {
			//请求完成的处理
		},
		error: function () {
			//请求出错处理
		}
	});
}

/**
 * 实际使用会写在页面里
 * @param {Object} re 标注数据
 * @returns {Void}
 */
function saveSubmitAllCoreFunc(re) {
	console.log(`re is ${JSON.stringify(re)}`)
	$.ajax({
		//url: "http://192.168.1.233:8887/answer/save", //请求的url地址
		url: "http://" + serverIP + "/answer/save", //请求的url地址
		dataType: "json", //返回格式为json
		contentType: 'application/json',
		async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		data: JSON.stringify(re), //参数值
		type: "POST", //请求方式
		beforeSend: function () {
			//请求前的处理
		},
		success: function (res) {
			//请求成功时处理
			console.log(`res is ${JSON.stringify(res)}`)
		},
		complete: function () {
			//请求完成的处理
		},
		error: function () {
			//请求出错处理
		}
	});
}

/*
  === tag_test 方法 移植到 tag_tag ===
*/

// lu 存储了部分layui组件
/**
 * Layui 初始化方法
 * @param {Object} lu 存了一些layui组件
 * @returns {Void}
 */
function layuiInitFunc(lu) {
	// 打开同步到标注弹窗的方法
	function openSynchronizationLayer() {
		/*layer.open({
			title: '添加分类样本',
			move: false,
			type: 1,
			area: ['600px', '400px'], //宽高
			content: $("#layer_synchronization"),
			// shadeClose: true,
			shade: 0.5,
			skin: 'ml-iframe-3',
			closeBtn: 0,
			success: function () {
				calcSynchronizationFunc()
			}
		});*/
	}

	// 同步到标注
	$("#synchronization").click(function () {
		openSynchronizationLayer()

		// saveSubmitAllFunc()
	})
	// 更换颜色
	// $("#t_r_btn_c").click(function () {
	// document.getElementById('my_color').jscolor.show()
	// })

	// 清除单张标注
	$("#t_r_btn_e").click(function () {
		layer.confirm('确认清除当前图片的所有标注？', {
			btn: ['取消', '确认清除'],
			closeBtn: 0,
			skin: 'ml-confirm',
			title: '',
			move: false,
			area: ['600px']
		}, function () {
			layer.closeAll('dialog');
		}, function () {
			layer.closeAll('dialog');

			clearMarkOneFunc()
		});
	})
	// 清除全部标注
	$("#t_r_btn_f").click(function () {
		layer.confirm('确认清除当前样本的所有图片的所有标注？', {
			btn: ['取消', '确认清除'],
			closeBtn: 0,
			skin: 'ml-confirm',
			title: '',
			move: false,
			area: ['600px']
		}, function () {
			layer.closeAll('dialog');
		}, function () {
			layer.closeAll('dialog');

			clearMarkAllFunc()
		});
	})

	// 历史
	$("#mark_history").click(function () {
		if (typeof getHistoryTagFunc === "function") {
			getHistoryTagFunc()
		} else {
			tips_message_func("无 此 方 法")
		}
	})
	// 标注颜色
	$("#my_color").change(function () {
		if (typeof baseColor === "string") {
			var color = $(this).val()
			baseColor = "#" + color
			color_setting(baseColor)
		}
	})

	// 阈值
	lu.slider.render({
		elem: '#demo_slider',
		value: threshold_value,
		//最小值
		min: 10,
		//最大值
		max: 100,
		step: 1,
		change: function (value) {

			threshold_value = value;
			initPointCore(initPointFilterA(jsarray[mark_image_index]));

		}
	});
	// 分类多选 checkbox
	layui_checkbox_render_func(lu.form)

	lu.form.on('checkbox(c_all)', function (data) {
		// EDIT ===>>> 0829
		if ($(".cityId").length === 0) {
			return
		}
		// EDIT ===>>> END

		var a = data.elem.checked;
		if (a == true) {
			$(".cityId").prop("checked", true);
			layui.form.render('checkbox');
		} else {
			$(".cityId").prop("checked", false);
			layui.form.render('checkbox');
		}
		enterFilter(-1)
	});
	lu.form.on('checkbox(c_other)', function (data) {
		var city = $(".cityId")
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
		layui.form.render('checkbox');
		enterFilter(1)
	});

	lu.form.on('checkbox(m_all)', function (data) {
		// alert("??")

		// EDIT ===>>> 0829
		if ($(".modelId").length === 0) {
			return
		}
		// EDIT ===>>> END

		var a = data.elem.checked;
		if (a == true) {
			$(".modelId").prop("checked", true);
			layui.form.render('checkbox');
		} else {
			$(".modelId").prop("checked", false);
			layui.form.render('checkbox');
		}
		enterFilter(-2)
	});
	lu.form.on('checkbox(m_other)', function (data) {
		// alert("??")

		var city = $(".modelId")
		var boolean_arr = []
		city.each(function () {
			boolean_arr.push($(this).prop("checked"))
		})
		for (var i = 0; i < boolean_arr.length; i++) {
			var bool = boolean_arr[i]
			if (!bool) {
				$("#m_all").prop("checked", false);
				break;
			} else if (i === (boolean_arr.length - 1) && bool) {
				$("#m_all").prop("checked", true);
			}
		}
		layui.form.render('checkbox');
		enterFilter(2)
	});

}

/**
 * Layui 渲染checkbox方法
 * @param {Object} form layui.form 组件
 * @returns {Void}
 */
function layui_checkbox_render_func(form) {
	form.render();
	$(".c_all").prop("checked", true);
	// $(".cityId").prop("checked", true);
	form.render('checkbox');
}

/**
 * 更改当前标注的颜色
 * @param {String} color 颜色字符串
 * @returns {Void}
 */
function color_setting(color) {
	// 获取SVG DOM
	var polygon = $(mysvg).find("polygon")
	var circle = $(mysvg).find("circle")
	polygon.css({
		'stroke': color
	})
	circle.css({
		'stroke': color,
		'fill': color
	})
	// 循环改样式
	polygon.each(function () {
		this.setAttribute("style", "fill:pink;stroke:" + color + ";stroke-width:1;fill-opacity:0.0;");
	})
}

/**
 * 收集结果 重新渲染svg
 * 分发过滤器赋值方法并重绘标注框
 * @param {Number} status 状态值
 * @returns {Void}
 */
function enterFilter(status) {
	// 通过status判断
	if (status > 0) {
		// 分类阈值
		changeResultTypeFunc(status)
	} else {
		changeResultTypeExtraFunc(status)
	}
	// 重绘
	initPointCore(initPointFilterA(jsarray[mark_image_index]))
}

/**
 * 根据用户勾选结果判断过滤哪些框
 * 根据status进行分类和模型的分发
 * @param {Number} status 状态值
 * @returns {Void}
 */
function changeResultTypeFunc(status) {

	var m
	var arr = []
	if (status === 1) {
		m = $(".cityId")
		m.each(function () {
			var id = $(this)[0].dataset.id
			// var title = $(this)[0].getAttribute("title")
			var bool = $(this).prop("checked")
			if (bool) {
				arr.push(id)
			}
		})
		result_type_value = arr
	} else if (status === 2) {
		m = $(".modelId")
		m.each(function () {
			var id = $(this)[0].dataset.id
			// var title = $(this)[0].getAttribute("title")
			var bool = $(this).prop("checked")
			if (bool) {
				arr.push(title)
			}
		})
		model_type_value = arr
	} else {
		return
	}
}

/**
 * 如果不选中全选就不出现任何框
 * 选中全选出现所有框
 * 根据status进行分类和模型的分发
 * @param {Number} status 状态值
 * @returns {Void}
 */
function changeResultTypeExtraFunc(status) {
	if (status === -1) {
		var m = $(".cityId")
		var bool = m.prop("checked");
		if (bool) {
			result_type_value = true
		} else {
			result_type_value = []
		}
	} else if (status === -2) {
		var m = $(".modelId")
		var bool = m.prop("checked");
		if (bool) {
			model_type_value = true
		} else {
			model_type_value = []
		}
	} else {
		return
	}
}

/**
 * 空方法 不用管
 */
function saveEmptyAllCoreFunc() {
}

// function getHistoryTagFunc() {}