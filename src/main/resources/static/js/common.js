var $ = null
var layer = null

baseUrlLocal = 'http://localhost:59527/html'
layui.use(['layer', 'form', 'jquery'], function () {
	layer = layui.layer
	$ = layui.jquery
});

var lay_setting = {
	type: 1,
	area: '600px',
	title: false,
	closeBtn: 0,
	shade: 0.8
}

// 调用弹窗
function layOpenFunc1() {
	layer.open({
		type: lay_setting.type
		, area: lay_setting.area
		, title: lay_setting.title
		, closeBtn: lay_setting.closeBtn
		, shade: lay_setting.shade
		, content: $('.lay1')
	});
}

function layOpenFunc2() {
	layer.open({
		type: lay_setting.type
		, area: lay_setting.area
		, title: lay_setting.title
		, closeBtn: lay_setting.closeBtn
		, shade: lay_setting.shade
		, content: $('.lay2')
	});
}

function layOpenFunc3() {
	layer.open({
		type: lay_setting.type
		, area: lay_setting.area
		, title: lay_setting.title
		, closeBtn: lay_setting.closeBtn
		, shade: lay_setting.shade
		, content: $('.lay3')
	});
}

function layOpenFunc4() {
	layer.open({
		type: lay_setting.type
		, area: lay_setting.area
		, title: lay_setting.title
		, closeBtn: lay_setting.closeBtn
		, shade: lay_setting.shade
		, content: $('.lay4')
	});
}

// 关闭弹窗
function layCloseFunc() {
	layer.closeAll()
}

// 表单验证
function checkValueFunc() {
	var result = true
	try {
		$.each($('.input'), function (index, item) {
			// console.log(item,index)
			if (item.value === "") {
				result = false
				$(item).next().addClass("show")
			} else {
				$(item).next().removeClass("show")
			}
		})
	} catch (error) {
	}
	return result
}

function post_ajax(apiName, ajaxUrl, request, callback) {
	$ = layui.jquery
	$.ajax({
		type: "POST",
		url: ajaxUrl,
		async: true,
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify(request),
		beforeSend: function () {

		},
		complete: function () {

		},
		success: function (response) {

			if (response) {
				callback(response);
			} else {
				//alert("问题接口：" + apiName + "\n失败----" + response.desc + response.flag);
				return false;
			}
		},
		error: function (response) {
			//alert("问题接口：" + apiName + "\n异常错误" + JSON.stringify(response));
			return false;
		}
	})
}

function get_ajax(apiName, ajaxUrl, callback) {
	$ = layui.jquery
	$.ajax({
		type: "GET",
		url: ajaxUrl,
		async: true,
		success: function (response) {
			if (response) {
				callback(response);
			} else {
				//alert("问题接口：" + apiName + "\n失败----" + response.desc + response.flag);
				return false;
			}
		},
		error: function (response) {
			//alert("问题接口：" + apiName + "\n异常错误" + JSON.stringify(response));
			return false;
		}
	})
}






