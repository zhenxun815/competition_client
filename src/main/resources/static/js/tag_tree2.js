// 使本地能正常运行的默认值
// 实际使用会被接口获取的值覆写
zNodes = [
	{id: '-1', name: "标注分类", isParent: true, open: true},
	{id: '1', pId: '-1', name: "肺结核", open: true},
	{id: '2', pId: '-1', name: "肺癌", open: true},
	{id: '3', pId: '-1', name: "肺炎", open: true}
];
// 先声明
var zTree
// 需要校验之后渲染树
// console.log(setting && zNodes && $.fn.zTree)
// return

// zTree_init_func()

/**
 * ztree 渲染方法
 * @param {Void}
 * @returns {Void}
 */
function zTree_init_func() {
	// console.log("TIMESTAMP === zTree_init_func ", new Date().getTime())

	if (typeof ztreeSetting === "object") {
		if (typeof zNodes === "object") {
			if (typeof $.fn.zTree === "object") {
				zTree = $.fn.zTree.init($("#treeDemo0"), ztreeSetting, zNodes);
				fuzzySearch('treeDemo0', '#key', null, true); //初始化模糊搜索方法

				zTree_bind_func()
			}
		}
	}
}

/**
 * ztree 绑定业务所需方法
 * @param {Void}
 * @returns {Void}
 */
function zTree_bind_func() {
	$("#treeDemo0 a span.node_name").unbind('mouseover')
	$("#treeDemo0 a span.node_name").bind('mouseover', function (event) {
		var origin_top = $(this).offset().top

		var dom = event.target.previousElementSibling
		var dom_origin = event.target
		if (dom) {
			var id = dom.dataset.originid
			if (id) {
				getTheMTMarkedNumber(id)
				var index = parseInt(dom_origin.id.split('_')[1])
				if (isNaN(index)) {
					treeZoneMouseFunc({display: 'inline-block'})
				} else {
					var i = index - 2
					// var top = i * 23 + 60 + `px`
					// var top = origin_top + 'px'
					var top = origin_top - 32 + 'px'
					treeZoneMouseFunc({display: 'inline-block', top: top})
				}
			}
		}
	})
	$("#treeDemo0 a").unbind('mouseout')
	$("#treeDemo0 a").bind('mouseout', function () {
		treeZoneMouseFunc({display: 'none'})
	})

	// console.log("layui.use==", new Date().getTime())
}

/**
 * 控制 ztree 分类数量提示区的显示和位置的方法
 * @param {Object} style
 * @returns {Void}
 */
function treeZoneMouseFunc(style) {
	var DOM = document.getElementById('showy')
	// 在 tag.js 里面
	updateDOMStyle(DOM, style)
}

/**
 * 获取分类数量的前置方法
 * @param {String} id
 * @returns {Void}
 */
function getTheMTMarkedNumber(id) {
	$("#showy")[0].innerHTML = "\u5DF2\u6807\u6CE8<br>\u6837\u672C\u6570 ...<br>\u56FE\u7247\u6570 ...";
	// todo
	// projectId 需要JSP赋值
	var re = {
		eq_projectId: '',
		eq_typeId: id
	};
	getProjectLabelCaseImgCountFunc(re)
}

/**
 * todo
 * 使用时需要注释return
 * 把 re ajax 提交到后端即可
 * 提交完成的回调需要把计算结果赋值给DOM
 * @param {Object} re
 * @returns {Void}
 */
function getProjectLabelCaseImgCountFunc(re) {
	return

	$.ajax({
		url: "/ac/data/imgtagtype/projectLabelCaseImgCount", //请求的url地址
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
				$("#showy")[0].innerHTML = "\u5DF2\u6807\u6CE8 \u6837\u672C\u6570 ".concat(res.data.caseCount, " \u56FE\u7247\u6570 ").concat(res.data.imgCount);
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