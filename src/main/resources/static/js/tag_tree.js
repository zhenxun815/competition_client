// Tree START

/**
 * 选中标注类型
 * @param {Object} event
 * @param {String} treeId
 * @param {Object} treeNode
 * @returns {Void}
 */
function zTreeOnClickFunc(event, treeId, treeNode) {

	// 只有标注页面会需要选中分类后的逻辑
	// 在 tag_tag.js里面
	zTreeOnClickCoreFunc(treeNode)

}

/**
 * 触摸时显示相关按钮
 * @param {String} treeId
 * @param {Object} treeNode
 * @returns {Void}
 */
function addHoverDom(treeId, treeNode) {
	// console.log(treeId)

	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
		"' title='add node' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_" + treeNode.tId);
	if (btn) btn.bind("click", function () {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo0");
		zTree.addNodes(treeNode, {id: (100 + ztreeNewCount), pId: treeNode.id, name: "new node" + (ztreeNewCount++)});
		return false;
	});
}

/**
 * 不触摸时去掉相关按钮
 * @param {String} treeId
 * @param {Object} treeNode
 * @returns {Void}
 */
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.tId).unbind().remove();
};

/**
 * 删除时的拦截方法
 * @param {String} treeId
 * @param {Object} treeNode
 * @returns {Void}
 */
function beforeRemove(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo0");
	zTree.selectNode(treeNode);
	return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}

/**
 * 更名时的拦截方法
 * @param {String} treeId
 * @param {Object} treeNode
 * @param {String} newName
 * @returns {Void}
 */
function beforeRename(treeId, treeNode, newName) {
	if (newName.length == 0) {
		setTimeout(function () {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo0");
			zTree.cancelEditName();
			alert("节点名称不能为空.");
		}, 0);
		return false;
	}
	return true;
}

// 在配置项里配置过了所以这里不再配置

// var newtree = new Tree()
// var ztreeSetting = {
//   view: {
//     expandSpeed: "",
//     addHoverDom: addHoverDom,
//     removeHoverDom: removeHoverDom,
//     selectedMulti: false,
//     nameIsHTML: true, //允许name支持html	
//     showIcon: false,
//     showLine: false,
//     addDiyDom: function (treeId, treeNode) {
//       // console.log(treeNode)
//       // var aObj = $("#" + treeNode.tId + "_a");
//       var editStr = "<i class='origin_id' data-originid='" + treeNode.id + "' style='display:none'></i>"
//       $("#" + treeNode.tId + "_span").before(editStr);
//     }
//   },
//   edit: {
//     enable: true,
//     editNameSelectAll: false
//   },
//   data: {
//     simpleData: {
//       enable: true
//     }
//   },
//   callback: {
//     beforeRemove: beforeRemove,
//     beforeRename: beforeRename,
//     onClick: zTreeOnClickFunc
//   }
// };

// 先声明 在配置项里会被覆写掉
var ztreeSetting
// 方法里会用到这个值
var ztreeNewCount = 1

// END