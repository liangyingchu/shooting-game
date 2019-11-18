
function BeginLayer(_parent) {
	this.parent = _parent
	this.scene = new MONKEY.Scene({ background: 'images/beginBg.png' })
	this.init()
}

BeginLayer.prototype.init = function () {
	var self = this
	// 创建按钮
	var playBtnArr = MONKEY.Labeler.createImage('images/btn/playBtn.png', 'images/btn/playBtn_mo.png')
	var playBtn = new MONKEY.Button({
		upImg: playBtnArr[0],
		moveImg: playBtnArr[1],
		x: 433,
		y: 678,
		zIndex: 10
	})
	playBtn.addListener('mousedown', function () {
		// 跳转
		// self.parent.playMusic('bgm')
		self.parent.gotoLayer('game')
	}, true)
	this.scene.add(playBtn)
}

BeginLayer.prototype.initLayer = function () {
	console.log('BeginLayer init')
}