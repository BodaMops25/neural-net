'use strict'

function getNode(node) {
	return document.querySelector(node)
}

const game = getNode('#game'),
		gctx = game.getContext('2d'),
		cSz = 500

game.width = cSz
game.height = cSz

game.style.width = cSz + 'px'
game.style.height = cSz + 'px'

// GAME FIELD

const field = [], resolution = 19, cellPadding = 2, cntr = Math.floor(resolution / 2),

types = {
	null: 0,
	empty: {value: 1, color: '#e4e4e4'},
	wall: {value: 2, color: '#000'},
	food: {value: 3, color: '#d9ff01'},

	player: {value: 9, color: '#faa', x: cntr, y: cntr, stomach: 0}
}

for(let i = 0; i < resolution; i++) {

	field[i] = []

	for(let j = 0; j < resolution; j++) {
		field[i][j] = types.empty.value
	}
}

// PLAYER CONTROLS

function playerMovement(dir) {

	const t = types,
			e = t.empty.value,
			p = t.player,
			w = t.wall.value,
			f = t.food.value
	
	if(dir === 0 && p.x + 1 < resolution) {
		if(field[p.x + 1][p.y] === f) p.stomach++
		if(field[p.x + 1][p.y] !== w) field[p.x++][p.y] = e
	}
	else if(dir === 2 && p.x - 1 >= 0) {
		if(field[p.x - 1][p.y] === f) p.stomach++
		if(field[p.x - 1][p.y] !== w) field[p.x--][p.y] = e
	}
	else if(dir === 1 && field[p.x][p.y + 1] !== w && p.y + 1 < resolution) {
		if(field[p.x][p.y + 1] === f) p.stomach++
		field[p.x][p.y++] = e
	}
	else if(dir === 3 && field[p.x][p.y - 1] !== w && p.y - 1 >= 0) {
		if(field[p.x][p.y - 1] === f) p.stomach++
		field[p.x][p.y--] = e
	}
	else if(dir < 0 || dir > 3) {
		throw 'unknown direction movement'
	}

	getNode('#food span').innerHTML = p.stomach
}

// CREATING MAP TOOL

function createWall(e) {

	function mouseClick(e, fieldCellType) {
		const [eX, eY] = [e.offsetX, e.offsetY],
			x = parseInt(eX / (cSz / resolution)),
			y = parseInt(eY / (cSz / resolution))

		if(field[x][y] !== types.player.value) field[x][y] = fieldCellType
	}


	if(!e.ctrlKey) {

		if(e.buttons === 1) {

			mouseClick(e, types.wall.value)

			function f1(e) {

				mouseClick(e, types.wall.value)
			}

			game.addEventListener('mousemove', f1)
			game.addEventListener('mouseup', () => {
				game.removeEventListener('mousemove', f1)
			})
		}

		else if(e.buttons === 4) {

			mouseClick(e, types.food.value)

			function f1(e) {

				mouseClick(e, types.food.value)
			}

			game.addEventListener('mousemove', f1)
			game.addEventListener('mouseup', () => {
				game.removeEventListener('mousemove', f1)
			})
		}
	}

	else if(e.ctrlKey) {
		
		mouseClick(e, types.empty.value)

		function f1(e) {

			mouseClick(e, types.empty.value)
		}

		game.addEventListener('mousemove', f1)
		game.addEventListener('mouseup', () => {
			game.removeEventListener('mousemove', f1)
		})
	}
}

game.addEventListener('mousedown', createWall)

// FUNCTIONS

function displaySomething(x, y, type) {
	const sz = cSz / resolution - cellPadding * (1 + 1/resolution),
			cX = (sz + cellPadding) * x + cellPadding,
			cY = (sz + cellPadding) * y + cellPadding

	gctx.beginPath()
	gctx.rect(cX, cY, sz, sz)

	switch (type) {
		case types.wall.value:
			gctx.fillStyle =  types.wall.color
			break;
		case types.empty.value:
			gctx.fillStyle = types.empty.color
			break;
		case types.food.value:
			gctx.fillStyle = types.food.color
			break;
		case types.player.value:
			gctx.fillStyle = types.player.color
			break;
	}

	gctx.fill()
}

function displayField() {

	for(let i = 0; i < resolution; i++) {
		for(let j = 0; j < resolution; j++) {

			displaySomething(i, j, field[i][j])
		}
	}

	{
		const c = types.player
		field[c.x][c.y] = types.player.value
	}
}

// RENDER

const fps = 60,
getUpdate = setInterval(() => {
		
	requestAnimationFrame(() => {

		gctx.clearRect(0, 0, cSz, cSz)


		
		displayField()
	})
}, 1000 / fps)

// HOT KEYS

document.addEventListener('keydown', (e) => {

	const key = e.keyCode
	// console.log(key)

	if(key === 77) {
		let fieldStr = ''
		
		for(let i = 0; i < field.length; i++) {
			fieldStr += `[${field[i].toString()}],\n`
		}

		console.log(fieldStr)
	}

	// PLAYER MOVING

	else if(key === 68) playerMovement(0)
	else if(key === 83) playerMovement(1)
	else if(key === 65) playerMovement(2)
	else if(key === 87) playerMovement(3)
})