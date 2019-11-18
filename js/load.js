var gameLayer

function isVulgarInternetExplorerVersion() {
	var version = navigator.appVersion.split(';')
	if(version.length > 1) {
		var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""))
		return trim_Version < 9
	}
	return false
}


function onloadFunc() {
	if(isVulgarInternetExplorerVersion()) {
		document.getElementById('disableTip').style.display = 'block'
		document.getElementById('superContainer').style.display = 'none'
		return
	}

	gameLayer = new Main()

	var musicData = [
		{ name: 'bgm', url: 'sound/bgm.mp3', loops: 1000, autoPlay: true },
		{ name: 'btn', url: 'sound/btn.mp3' }
	]
	MONKEY.Audio.createAudio(musicData)

	MONKEY.Resizer.add(document.getElementById('superContainer'), true)

	// 预加载
	MONKEY.Preload.addShowType('myProgress', function (ctx, percent) {
		console.log(percent)
		document.getElementById('loadingBar').style.width = parseInt(percent) * 3 + 'px'
		document.getElementById('loadingPre').innerHTML = parseInt(percent) + '%'
		if(percent >= 100) {
			document.getElementById('loadingPage').style.display = 'none'
			document.getElementById('gamePage').style.display = 'block'
			gameLayer.init()
			gameLayer.gotoLayer('begin')
		}
	})

	var loadImgData = [
		{ type: 'img', name: 'beginBg', path: 'images/beginBg.png' }
	]

	MONKEY.Preload.loadingFile(loadImgData, 'myProgress')
}