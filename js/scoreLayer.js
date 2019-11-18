
function ScoreLayer(_parent) {
	this.parent = _parent
	this.scene = new MONKEY.Scene({ background: 'images/reportBg.png' })
	this.init()
}

ScoreLayer.prototype.init = function () {
	var self = this

	var againArr = MONKEY.Labeler.createImage('images/btn/againBtn.png', 'images/btn/againBtn_mo.png')
	var againBtn = new MONKEY.Button({ upImg: againArr[0], moveImg: againArr[1], x: 671, y: 494 })
	againBtn.addListener('mousedown', function () {
		self.parent.gotoLayer('begin')
	})

	this.score = new MONKEY.Text({
		name: 'que',
		txt: '300',
		font: 'bold 185px 華康海報體W9',
		textAlign: 'center',
		x: 460,
		y: 160,
		fillStyle: '#FFFF52',
		shadow: true,
		shadowColor: '#F6B800',
		shadowOffsetX: 5,
		shadowOffsetY: 5,
		ghost: true
	})

	this.scene.add(againBtn, this.score)
}

ScoreLayer.prototype.initLayer = function () {
	var score = this.parent.gameLayer.getScore()
	this.score.setText(score)
}