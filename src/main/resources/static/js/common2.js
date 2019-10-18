function post_ajax(apiName, ajaxUrl, request, callback) {
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

function get_ajax(apiName, ajaxUrl, callback, timeOut) {
	var xhr = $.ajax({
		type: "GET",
		url: ajaxUrl,
		async: true,
		timeout: 3000,
		beforeSend: function () {

		},
		complete: function (XMLHttpRequest, status) {
			console.log(`status is ${status}`)
			if (status == 'timeout' || status == 'error') {
				xhr.abort();    // 超时中断请求
				// 这里可以重新执行请求
				timeOut()
			}
		},
		success: function (response) {

			if (response) {
				callback(response);
			} else {
				//alert("问题接口：" + apiName + "\n失败----" + response.desc + response.flag);
				return false;
			}
		},
		error: function (err) {
			//alert("问题接口：" + apiName + "\n异常错误" + JSON.stringify(response));

			return false;
		}
	})
}