/*
  为了与线上版本兼容做此处理
  你可以自行选择是否优化...
*/

// 选中标注类型
function zTreeOnClickFunc(event, treeId, treeNode) {
	// 只有标注页面会需要选中分类后的逻辑
	zTreeOnClickCoreFunc(treeNode)
}