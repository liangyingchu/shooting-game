
function GameLayer(_parent) {
	this.parent = _parent
	this.scene = new MONKEY.Scene()

	this.step = 0 // 当前题目的索引
	this.rightAns = null // 当前题目的正确答案
	this.subing = false // 当 true 时为射击中，此时无法触发新的射击
	this.option = [] // 答题选项
	this.queData = [] // 题库数据
	// 答题选项位置坐标
	this.optionPos = [
		{ p1: [218,110], p2: [172,490], p3: [580,125], p4: [410,380] },
		{ p1: [128,122], p2: [495,122], p3: [670,280], p4: [288,370] },
		{ p1: [104,500], p2: [272,375], p3: [450,225], p4: [630,110] }
	]

	this.init()
}

GameLayer.prototype.init = function () {
	var self = this

	// 创建动画帧
	var gameBgArr = []
	var maskArr = []
	var blastArr = []
	MONKEY.Loader.loadAniImg(gameBgArr, 'images/animation/gameBg/gameBg_', 4, 1)
	MONKEY.Loader.loadAniImg(maskArr, 'images/animation/mask/mask_', 2, 1)
	MONKEY.Loader.loadAniImg(blastArr, 'images/animation/blast/blast_', 5, 1)
	// 背景动画
	var gameBg = new MONKEY.IntervalAnimation({ frameArray: gameBgArr, autoPlay: true, intervalStatus: true, cycle: 3000 })
	// 底部操作背景动画
	var mask = new MONKEY.IntervalAnimation({ frameArray: maskArr, autoPlay: true, intervalStatus: true, cycle: 3500, zIndex: 100, y: 620 })
	// 火花动画 - 幽灵状态：渲染正常，但监听忽略。即看得见摸不着
	this.blast = new MONKEY.IntervalAnimation({ frameArray: blastArr, x: 0, y: 0, ghost: true, zIndex: 80, visible: false })
	this.blast.addListener('ended', function () {
		self.showTips(2, function () {
			self.score.setText(parseInt(self.score.getText()) + 10)
			self.shipFire.visible = false
			self.blast.visible = false
			self.step++
			self.loadQue()
		})
	})

	// 得分
	var scoreBg = new MONKEY.Animal({ background: 'images/sth/scoreBg.png', x: 10, y: 30, zIndex: 100 })
	this.score = new MONKEY.Text({ txt: '0',font: 'bold 24px 華康海報體W9', x: 110, y: 12, fillStyle: '#fff', textAlign: 'center' })
	scoreBg.add(this.score)

	// 答题选项
	for (var i = 0; i < 4; i++) {
		var op = new MONKEY.Animal({ 
			background: 'images/option/option_1_' + (i + 1) + '.png',
			x: 100 + i * 200,
			y: 100,
			zIndex: 70,
			listenerStatus: true
		})
		var que = new MONKEY.Text({
			name: 'que',
			txt: '14',
			font: 'bold 85px 華康海報體W9',
			textAlign: 'center',
			x: 60,
			y: 10,
			fillStyle: '#4822C3',
			shadow: true,
			shadowColor: '#000',
			shadowOffsetX: 1,
			shadowOffsetY: 1,
			ghost: true
		})
		op.add(que)
		op.addListener('mousedown', function () {
			self.parent.playMusic('btn')
			var ans = this.getChildren('que').getText()
			self.submitFunc(ans,this)
		})
		
		this.scene.add(op)
		this.option.push(op)
	}

	// 题目内容
	this.queItem = new MONKEY.Text({
		txt: '光速是10的?次方',
		textAlign: 'center',
		font: 'bold 40px 華康海報體W9',
		x: 510,
		y: 700,
		zIndex: 110,
		fillStyle: '#fabd14',
		shadow: true,
		shadowColor: '#fff',
		shadowOffsetX: 2,
		shadowOffsetY: 2,
		ghost: true
	})

	// 答题反馈模型
	this.wrongTips = new MONKEY.Animal({ background: 'images/sth/wrong.png', x: 300, y: 50, zIndex: 200, visible: false })
	this.rightTips = new MONKEY.Animal({ background: 'images/sth/right.png', x: 300, y: 50, zIndex: 200, visible: false })

	// 时间漏斗
	var timeMask = new MONKEY.Animal({ background: 'images/sth/timeMask.png', x: 964, y: 92, zIndex: 100 })
	var timeBg = new MONKEY.RectangleRoundGraphics({ x: 972, y: 106, width: 28, height: 554, fillStatus: true, strokeStatus: false, fillStyle: '#000',zIndex: 90 })
	this.timeBar = new MONKEY.RectangleRoundGraphics({ x: 972, y: 106, width: 28, height: 554, fillStatus: true, strokeStatus: false, fillStyle: '#0492FF', zIndex: 95 })
	this.timer = new MONKEY.TimeText({
		x: 800,
		y: 720,
		startTime: 300,
		endTime: 0,
		timeDirection: false,
		updataFunc: function (time) {
			// 每当计时更新即调用
			var len = parseInt(time / 300 * 554)
			self.timeBar.special.height = len
			self.timeBar.position.y = 106 + 554 - len
		},
		callBack: function () {
			// 计时结束时调用
			console.log('timeOver')
			self.parent.gotoLayer('score')
		}
	})

	// 飞船
	this.ship = new MONKEY.Animal({ background: 'images/sth/ship.png', x: 716, y: 533, zIndex: 50 })
	this.shipFire = new MONKEY.Graphics({
		graphVertexs: [[650,350],[900,350],[950,370]], // 顶点坐标集合
		closeStatus: false, // 顶点连线的路径是否闭合
		visible: false,
		strokeStyle: '#D7B80B',
		shadow: true,
		shadowColor: '#881221',
		shadowOffsetY: 2,
		shadowOffsetX: 2,
		shadowBlur: 2,
		zIndex: 55
	})

	this.scene.add(
		gameBg,
		mask,
		this.blast,
		scoreBg,
		this.queItem,
		this.wrongTips,
		this.rightTips,
		timeMask,
		timeBg,
		this.timeBar,
		this.timer,
		this.ship,
		this.shipFire
	)
}

// 场景逻辑数据初始化
GameLayer.prototype.initLayer = function () {
	this.timer.reset()
	this.timer.play()
	this.queData = MONKEY.Math.randomArray(MONKEY.Common.arrayCopy(queData)) // 深度复制数组
	this.score.setText('0')
	this.step = 0
	this.loadQue()
}

// 获取题目资源
GameLayer.prototype.loadQue = function () {
	if(this.step >= this.queData.length) {
		this.step = 0
	}

	var nowData = this.queData[this.step]
	this.rightAns = nowData[nowData[1] + 2]
	this.queItem.setText(nowData[0])
	this.subing = false
	var posIndex = parseInt(Math.random() * this.optionPos.length)
	var pos = this.optionPos[posIndex]
	for (var i = 0; i < 4; i++) {
		var pt = pos['p' + (i + 1)]
		this.option[i].position.x = pt[0]
		this.option[i].position.y = pt[1]
		this.option[i].getChildren('que').setText(nowData[i + 2])
		this.option[i].visible = true
	}
}

// 射击选项
GameLayer.prototype.submitFunc = function (ans, ele) {
	var self = this
	if(this.subing) return
	this.subing = true
	if(this.rightAns == ans) {
		var x = ele.position.x + 65
		var y = ele.position.y + 65
		var result = this.fireLine(795, 568, x, y)
		this.shipFire.setGraphVertexs(result) // 设置路径顶点坐标
		this.shipFire.visible = true
		// 爆炸效果
		setTimeout(function () {
			self.blast.position.x = x - 100
			self.blast.position.y = y - 100
			self.blast.visible = true
			ele.visible = false
			self.blast.gotoAndPlay(0) // 去到动画的第0帧，并播放动画
		}, 500)
	} else {
		// 回答错误处理
		this.showTips(1, function () {
			self.shipFire.visible = false
			self.timer.currentTime > 15 ? self.timer.currentTime -= 15 : self.timer.currentTime = 2
			self.step++
			self.loadQue()
		})
	}
}

// 计算射击火线路径顶点坐标
GameLayer.prototype.fireLine = function (x1, y1, x2, y2) {
	var ang = MONKEY.Math.setCallAngle(x1, y1, x2, y2) // 俩点所成直线与水平线所形成的夹角
	var matrix = new MONKEY.Matrix2() // 实例化二维矩阵类
	matrix.set(x2, y2) // 设置矩阵坐标
	matrix.rotate(ang, x1, y1) // 矩阵坐标绕点(x1, y1)旋转 ang 度
	var nx2 = matrix.elements[0]
	var	ny2 = matrix.elements[1]

	var len = Math.abs(x1 - nx2)
	var maxN = len > 300 ? 2 : 1
	var ptArr = [[x1, y1]]

	// 绘制电波
	for (var i = 0; i < maxN; i++) {
		var l = len / Math.pow(2, maxN) + i * len / 2
		var px = x1 - l
		var m1 = parseInt(Math.random() * 50) + 30
		var m2 = parseInt(Math.random() * 50) + 30
		var p1 = [px + 30, ny2]
		var p2 = [px + 15, ny2 - m1]
		var p3 = [px - 15, ny2 + m2]
		var p4 = [px - 30, ny2]
		ptArr.push(p1, p2, p3, p4)
	}
	ptArr.push([nx2, ny2])

	var resultArr = []
	for (var i = 0; i < ptArr.length; i++) {
		matrix.set(ptArr[i][0], ptArr[i][1])
		matrix.rotate(-ang, x1, y1)
		resultArr.push([matrix.elements[0], matrix.elements[1]])
	}
	return resultArr
}

// 答题反馈
GameLayer.prototype.showTips = function (type, callback) {
	var self = this
	switch (type) {
		// 清除反馈
		case 0:
			this.wrongTips.visible = false
			this.rightTips.visible = false
			break
		// 答题错误
		case 1:
			this.wrongTips.visible = true
			this.rightTips.visible = false
			break
		// 答题正确
		case 2:
			this.wrongTips.visible = false
			this.rightTips.visible = true
			break
	}
	if(type > 0) {
		setTimeout(function () {
			self.showTips(0)
			callback()
		}, 1500)
	}
}

// 获取分数
GameLayer.prototype.getScore = function () {
	return this.score.getText()
}