var vueTableExtand = {
	props: {
		row: {
			type: Object,
			default: (function () {
			})
		},
		index: {
			type: Number,
			default: 0
		},
		staticViewObject: {
			type: Object,
			default: (function () {
			})
		}
	},
	data() {
		return {

			// higtCharts 实例
			theTime: new Date().getTime(),
			Charts: null,

			// todo
			// URL 需要根据环境更换
			url_dicomImagePath: "http://192.168.1.129:8080/viewImg?path=",
			// url_dicomImagePath:"/viewImg?path=",
			innerData: [],

			loadingMDisplayBooleanB: false,
			option: null,
			// precision准确率 recall召回率
			type: "precision",
			staticData: [],
			imgArr: [],
			//
			origin_size_arr: [],
			now_size_arr: [],
			img_arr: [],
			img_calc_count: 0,
			absImgOpaStyle: {opacity: '0'},
			//
		}
	},
	methods: {
		objectCopy(obj) {
			var newobj = obj.constructor === Array ? [] : {};
			if (typeof obj !== 'object') {
				return;
			}
			for (var i in obj) {
				newobj[i] = (typeof obj[i] === 'object' && !(obj[i] === null)) ?
					this.objectCopy(obj[i]) : obj[i];
			}
			return newobj
		},
		openDownPdfModalFunc() {
			// window.downPDFEnter = function () {
			//   alert("downPDFEnter")
			// }
			var _this = this
			// @click="downPDFFunc"
			var html = `<span class="icon down-pdf-icon" id="down_pdf" ></span><div class="down-pdf-modal">`
			var imgArr = this.imgArr
			for (var i in imgArr) {
				html += (`<div>` + `<img src="` + imgArr[i] + `" style="width:100%;margin:0 0 20px;display:block">` + `</div>`)
			}

			// console.log(html)
			// return
			this.$Modal.info({
				title: '测试结果',
				content: html,
				width: 632
			});

			// console.log(document.getElementById('down_pdf'))
			this.$nextTick(function (e) {
				// console.log(document.getElementById('down_pdf'))
				document.getElementById('down_pdf').onclick = function () {
					_this.downPDFFunc()
				}
			})

			// document.getElementById('down_pdf').onclick = function () {
			//   _this.downPDFFunc()
			// }
		},
		// 下载PDF
		downPDFFunc() {
			var imgArr = this.imgArr

			if (this.imgArr.length === 0) {
				var title = `请注意`
				var content = `没有数据，故不提供下载。`
				this.$Modal.warning({
					title: title,
					content: content
				});
				return
			}

			var string1 = (function (arr) {
				var s = ""
				arr.forEach(function (item, index) {
					s += item.split('=')[1]
					if (index !== (imgArr.length - 1)) {
						// 图片之间的分隔符
						s += ','
					}
				})
				return s
			})(imgArr)

			var result = {
				fileName: '猫猫狗狗',
				// fileName: this.row.modelName,
				// fileName:this.staticData[this.staticViewObject.categoriesIndex].typeName,
				// fileName:'测试结果',
				imgUrlString: string1
			}
			// alert("download;" + string1)
			alert("download;" + JSON.stringify(result))
		},
		// 点击图表时更新左边和右边
		changeLeftRightViewFunc() {
			var _this = this

			this.imgArr.length = 0
			this.absImgOpaStyle = {opacity: '0'}
			this.$nextTick(function (e) {
				_this.getImgArrFunc(
					_this.staticData[_this.staticViewObject.categoriesIndex].imgUrlList[_this.staticViewObject.setpIndex])
			})
		},
		// 点击 准确率 召回率 按钮时更新图表
		changeLineFunc(type) {
			if (type !== this.type) {
				this.type = type

				// alert(this.type)
				// $(".cl-item").removeClass("active")
				// $("#cl_" + type).addClass("active")
				// document.getElementById('cl_precision').className = "cl-item"
				// document.getElementById('cl_recall').className = "cl-item"

				// document.getElementById('cl_' + type).className = "cl-item active"

				this.parseDataFunc(this.option, this.objectCopy(this.staticData))

				// console.log(this.Charts)

				this.renderChartsFunc()
			}
		},
		getFromApiFunc() {
			var _this = this
			var arg = [
				'/ac/project/task/getClassificationDetailListByTaskId',
				Qs.stringify({taskId: this.row.taskId})
			]
			var $p = this.$parent.$parent.$parent
			$p.service.post(arg[0], arg[1]).then(function (res) {
				// console.log("api_getListModelStatistic")
				// console.log(res.data)
				if (res.data.flag === 1) {
					_this.staticData = res.data.data

					_this.getFromStoreFunc()
				}
			})


			// var _this = this
			// var re = {
			//   taskId: this.row.taskId
			// }
			// api_getClassificationDetailListByTaskIdFunc(this, qs.stringify(re)).then(function (res) {
			//   if (res[0] === 200) {
			//     // this.$store.dispatch('TopicReport/setDataAction', {
			//     //   index: this.index,
			//     //   res: res[1]
			//     // })
			//     _this.innerData[_this.index] = res[1]

			//     _this.getFromStoreFunc()
			//   }
			// })
		},
		getFromStoreFunc() {
			// var state = this.$store.state.TopicReport
			// var d = state.innerData[this.index]
			// this.staticData = d
			// console.log(d)

			this.parseDataFunc(this.option, this.objectCopy(this.staticData))

			this.renderChartsFunc()

			if (this.staticData.length > 0 && this.staticViewObject) {
				this.getImgArrFunc(
					this.staticData[this.staticViewObject.categoriesIndex].imgUrlList[this.staticViewObject.setpIndex])
			}

			// console.log(this.option)
			// console.log(this.staticData)
		},
		// highcharts 渲染
		renderChartsFunc() {
			// alert("render")
			if (this.Charts) {
				this.Charts.update(this.option)

			} else {
				this.Charts = new Highcharts.chart('container' + this.theTime, this.option);

				// console.log(this.Charts) this.Charts.container.id

				if (this.Charts.container.id) {
					console.log(this.Charts.container.id)
					console.log(_this.CHILD_VIEWMODEL[this.Charts.container.id])
					_this.CHILD_VIEWMODEL[this.Charts.container.id] = this
				}
			}
		},
		parseDataFunc(option, d) {

			var _this = this
			var xv = d[0].step
			var yv = (function (d) {
				var arr = []
				d.forEach(function (item) {
					var o = {}
					o.marker = {symbol: 'square'}
					o.name = item.typeName
					o.data = _this.type === "precision" ? item.precisionList : item.recallList
					arr.push(o)
				})
				return arr
			})(d)

			option.xAxis.categories = xv
			option.title.text = this.type === "precision" ? '分类准确率' : '分类召回率'

			option.series.length = 0
			yv.forEach(function (item) {
				option.series.push(item)
			})
		},
		updateDOMStyle(DOM, obj) {
			Object.keys(obj).forEach(function (key) {
				DOM["style"][key] = obj[key];
			});
		},
		getImgArrFunc(arr) {
			var url_dicomImagePath = this.url_dicomImagePath

			if (!arr) {
				return
			}
			var r = JSON.parse(arr)
			r = r.map(function (item) {
				item = (url_dicomImagePath + item)
				return item
			})
			this.imgArr = r
		},
		// 下载PDF
		downPDFFunc() {
			var imgArr = this.imgArr

			if (this.imgArr.length === 0) {
				var title = `请注意`
				var content = `没有数据，故不提供下载。`
				this.$Modal.warning({
					title: title,
					content: content
				});
				return
			}

			var string1 = (function (arr) {
				var s = ""
				arr.forEach(function (item, index) {
					s += item.split('=')[1]
					if (index !== (imgArr.length - 1)) {
						// 图片之间的分隔符
						s += ','
					}
				})
				return s
			})(imgArr)
			var result = {
				fileName: this.row.modelName,
				imgUrlString: string1
			}
			alert("download;" + JSON.stringify(result))
		},
		// 瀑布流
		waterFullBFunc() {
			var base_width = 75
			var base_margin = 15
			var origin_size_arr = this.origin_size_arr
			var now_size_arr = this.now_size_arr
			var img_arr = this.img_arr

			origin_size_arr.forEach(function (item, index) {
				now_size_arr[index] = {}
				now_size_arr[index].width = base_width
				now_size_arr[index].height = (function () {
					return parseFloat(((item.height * base_width) / item.width).toFixed(2))
				})()
				var length = 2
				now_size_arr[index].top = (function () {
					// var length = 2
					if (index < length) {
						return 0
					} else {
						var first_column_index = (function () {
							// row 从 0 开始数数
							var result = []
							var row = (function () {
								return (Math.ceil((index + 1) / length) - 1)
							})()
							// row 减到0时跳出
							while (row) {
								result.unshift(row)
								row--
							}
							// 前面加个0
							result.unshift(0)
							// 去掉最后一位
							result.length = result.length - 1
							return result
						})()
						// console.log("START")
						var top = 0
						first_column_index.forEach(function (item) {
							console.log(item * length + index % length)
							top += (now_size_arr[item * length + index % length].height + base_margin)
						})
						// console.log(index)
						// console.log(first_column_index)
						// console.log(top)
						// console.log("END")
						return top
						// console.log(now_size_arr)
						// return now_size_arr[index - length].height + base_margin
					}
				})()
				now_size_arr[index].left = (function () {
					// var length = 2
					if ((index % length) === 0) {
						return 0
					} else {
						return (base_width + base_margin) * (index % length)
					}
				})()
			})

			for (var i in img_arr) {
				var now = now_size_arr[i]
				this.updateDOMStyle(img_arr[i], {
					'width': "".concat(now.width, "px"),
					'height': "".concat(now.height, "px"),
					'top': "".concat(now.top, "px"),
					'left': "".concat(now.left, "px")
				});
			}

			this.absImgOpaStyle = {opacity: '1'}
		}
	},
	watch: {
		staticViewObject: {
			handler(n, o) {
				console.log("WATCH staticViewObject")
				return

				// console.log(n)
				// console.log(o)
				// alert('changed');
				// old_value 不是 undefined 才行
				// if (o) {
				//   if (this.staticViewObject) {
				//     this.imgArr.length = 0
				//     this.absImgOpaStyle = { opacity: '0' }
				//     this.$nextTick((e) => {
				//       this.getImgArrFunc(
				//         this.staticData[this.staticViewObject.categoriesIndex].imgUrlList[this.staticViewObject.setpIndex])
				//     })
				//   }
				// }
			},
			immediate: true,
			deep: true
		},
		row: {
			handler(n, o) {
				console.log("WATCH ROW")
				return

				// const state = this.$store.state.TopicReport
				// if (!state.innerData[this.index]) {
				//   this.getFromApiFunc()
				// } else {
				//   this.getFromStoreFunc()
				// }
			}
		},
		'imgArr': {
			handler(n, o) {
				if (n.length === 0) {
					return
				}

				// alert("?")
				var _this = this

				this.$nextTick(function (e) {
					console.log("nextTick")
					// console.log(_this)
					// var _this = this
					_this.img_arr = _this.$refs.onload_image
					var img_arr = _this.img_arr
					var origin_size_arr = _this.origin_size_arr
					var now_size_arr = _this.now_size_arr
					origin_size_arr.length = 0
					now_size_arr.length = 0
					_this.img_calc_count = 0

					// for (let i in img_arr) {
					//   img_arr[i].onload = function () {
					//     // console.log(this)
					//     // 这里的this是图片对象
					//     origin_size_arr[i] = {
					//       width: this.width,
					//       height: this.height,
					//     }

					//     // console.log(i)
					//     // console.log(img_arr.length - 1)
					//     // console.log(i === (img_arr.length - 1))
					//     if (_this.img_calc_count === (img_arr.length - 1)) {
					//       // alert(1)
					//       _this.waterFullBFunc()
					//     } else {
					//       _this.img_calc_count++
					//     }
					//   }
					// }

					var _loop = function _loop(i) {
						img_arr[i].onload = function () {
							// console.log(this)
							// 这里的this是图片对象
							origin_size_arr[i] = {
								width: this.width,
								height: this.height // console.log(i)
								// console.log(img_arr.length - 1)
								// console.log(i === (img_arr.length - 1))

							};

							if (_this.img_calc_count === img_arr.length - 1) {
								// alert(1)
								_this.waterFullBFunc();
							} else {
								_this.img_calc_count++;
							}
						};
					};

					for (var i in img_arr) {
						_loop(i);
					}
				})
			},
			immediate: true,
			deep: true
		}
	},
	created() {
		// _this 是父VUE实例，所以不能用

		// _this = this

		// console.log(_this)

		// _this.CHILD_VIEWMODEL_ARRAY[this.index] = this

		// SET option START
		this.option = {
			chart: {
				type: 'spline'
			},
			credits: {
				enabled: false
			},
			title: {
				text: '',
				style: {
					fontSize: '14px'
				}
			},
			xAxis: {
				categories: []
			},
			yAxis: {
				title: {
					text: ''
				},
				labels: {
					formatter: function () {
						return this.value;
					}
				}
			},
			tooltip: {
				crosshairs: false,
				shared: false
			},
			plotOptions: {
				series: {
					cursor: 'pointer',
					events: {
						click: function (e) {
							// var _this = _this.CHILD_VIEWMODEL_ARRAY[this.index]

							// console.log(_this)
							/*
								要向store传两个东西
								2 一个对象，这个对象里有3个要记的INDEX
								1 一个开关boolean，激活watch后就置回去

								有3个需要记的值
								1 这个HC实例的INDEX 2 这个分类的INDEX 3 这个STEP的INDEX
								这个HC实例的INDEX HCIndex
								这个分类的INDEX categoriesIndex
								这个STEP的INDEX setpIndex
							*/
							// console.log(this)
							// console.log(e)
							// var HCIndex
							var id = this.chart.container.id
							var categoriesIndex = e.point.series.index
							var setpIndex = e.point.index

							console.log(id)
							console.log(categoriesIndex)
							console.log(setpIndex)

							// return

							for (var key in _this.CHILD_VIEWMODEL) {
								if (key === id) {
									var self = _this.CHILD_VIEWMODEL[key]

									self.staticViewObject.categoriesIndex = categoriesIndex
									self.staticViewObject.setpIndex = setpIndex
									// 原项目的 watch staticViewObject 移植
									self.changeLeftRightViewFunc()

									console.log(self)

									return
								}
							}
							return

							// _this.staticViewObject.categoriesIndex = categoriesIndex
							// _this.staticViewObject.setpIndex = setpIndex

							// 原项目的 watch staticViewObject 移植
							// _this.changeLeftRightViewFunc()

							// console.log(id)
							// console.log(categoriesIndex)
							// console.log(setpIndex)

							// var self = window._this
							// var store = self.$store
							// console.log(1)
							// 通过id找到点击的HC实例的INDEX
							// store.state.TopicReport.innerHCLineIdMap.forEach((item, index) => {
							//   if (id === item) {
							//     HCIndex = index
							//   }
							// })
							// if (!HCIndex && HCIndex !== 0) {
							//   return
							// } else {
							//   console.log(HCIndex, categoriesIndex, setpIndex)
							//   store.dispatch('TopicReport/setInnerHCCEventIndexObjectAction', {
							//     HCIndex: HCIndex,
							//     categoriesIndex: categoriesIndex,
							//     setpIndex: setpIndex
							//   })
							//   store.dispatch('TopicReport/setInnerHCCEventSBooleanAction', {
							//     innerHCCEventSBoolean: true
							//   })
							// }
						}
					}
				}
			},
			// EDIT ===>>> 0610
			legend: {
				maxHeight: 39
			},
			// EDIT ===>>> END
			// series: [{
			//   name: 'Tokyo',
			//   marker: {
			//     symbol: 'square'
			//   },
			//   data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
			//     y: 26.5
			//   }, 23.3, 18.3, 13.9, 9.6]

			// }, {
			//   name: 'London',
			//   marker: {
			//     symbol: 'square'
			//   },
			//   data: [{
			//     y: 3.9}, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			// }]
			series: []
		}
		// END

		// 从这里到外面需要 3 个 $parent
		// console.log(this.$parent.$parent.$parent)

		if (!this.row.taskId) {
			// alert("return")
			return
		}

		// if (!state.innerData[this.index]) {
		this.getFromApiFunc()
		// } else {
		//   this.getFromStoreFunc()
		// }
	},
	mounted() {
		// console.log(_this)

		// _this.CHILD_VIEWMODEL_ARRAY[this.index] = this
	},
	beforeDestroy() {
		// window.$downPDFEnter = null
		// _this = null
	},
	template: `<div class="te-box">
    <div class="item a">
      <div class="type">
        <p class="t">训练样本</p>
        <p>样本总量&emsp;{{ staticData.length > 0 ? staticData[staticViewObject.categoriesIndex].trainSetImgNum : '' }}</p>
        <p>{{ staticData.length > 0 ? staticData[staticViewObject.categoriesIndex].typeName : '' }}&emsp;{{ staticData.length > 0 ? staticData[staticViewObject.categoriesIndex].trainSetImgNum : '' }}</p>
        <br>                
        <p class="t">测试样本</p>
        <p>样本总量&emsp;{{ staticData.length > 0 ? staticData[staticViewObject.categoriesIndex].testSetImgNum : '' }}</p>
        <p>{{ staticData.length > 0 ? staticData[staticViewObject.categoriesIndex].typeName : '' }}&emsp;{{ staticData.length > 0 ? staticData[staticViewObject.categoriesIndex].testSetImgNum : '' }}</p>
        <!-- display flex -->
        <br> 
        <p class="t">参数设置</p>
        <div class="box">
            <div class="column">
                <span class="item">亮度: 0.5</span>
                <span class="item">颜色均衡: 0.85</span>
            </div>
            <div class="column">
                <span class="item">对比度: 1.3</span>
                <span class="item">锐度增强: 1.85</span>
            </div>
        </div>
      </div>
    </div>
    <div class="item b">
    <div class="abs change-line">
      <div :class="'cl-item ' + (type === 'precision' ? 'active' : '')" @click="changeLineFunc('precision')">准确率</div>
      <div :class="'cl-item ' + (type === 'recall' ? 'active' : '')" @click="changeLineFunc('recall')">召回率</div>
    </div>
    <div :id="'container' + theTime" style="width: 650px;height:400px;"></div>
    </div>
    <div class="item c">
      <div class="type">
          <p class="t">测试结果<span class="span" @click="openDownPdfModalFunc"></span></p>
          <div class="abs-zone" v-if="imgArr.length > 0" :style="absImgOpaStyle">
              <div class="abs-item"  >
                  <img :src="item" alt="" ref="onload_image" v-for="(item, index) in imgArr" :key="index">
              </div>
          </div>
      </div>
    </div>
  </div>`
};