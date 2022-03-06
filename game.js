'use strict'

function getNode(node) {
  return document.querySelector(node)
}

const game = getNode('#game'),
      gctx = game.getContext('2d'),
      cSz = 500,
      isGameControl = false

game.width = cSz
game.height = cSz

game.style.width = cSz + 'px'
game.style.height = cSz + 'px'

// GAME FIELD

const field = [],
      resolution = 19,
      cellPadding = 2,
      cntr = Math.floor(resolution / 2),
      cellTypes = {
        null: 0,
        empty: {value: 1, color: '#e4e4e4'},
        wall: {value: 2, color: '#000'},
        food: {value: 3, color: '#d9ff01'},
        player: {value: 9, color: '#faa', x: cntr, y: cntr, stomach: 0}
      }

for(let i = 0; i < resolution; i++) {

  field[i] = []

  for(let j = 0; j < resolution; j++) {
    field[i][j] = cellTypes.empty.value
  }
}

// PLAYER CONTROLS

function playerMovement(dir) {

  const t = cellTypes,
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

    if(field[x][y] !== cellTypes.player.value) field[x][y] = fieldCellType
  }


  if(!e.ctrlKey) {

    if(e.buttons === 1) {

      mouseClick(e, cellTypes.wall.value)

      function f1(e) {

        mouseClick(e, cellTypes.wall.value)
      }

      game.addEventListener('mousemove', f1)
      game.addEventListener('mouseup', () => {
        game.removeEventListener('mousemove', f1)
      })
    }

    else if(e.buttons === 4) {

      mouseClick(e, cellTypes.food.value)

      function f1(e) {

        mouseClick(e, cellTypes.food.value)
      }

      game.addEventListener('mousemove', f1)
      game.addEventListener('mouseup', () => {
        game.removeEventListener('mousemove', f1)
      })
    }
  }

  else if(e.ctrlKey) {
    
    mouseClick(e, cellTypes.empty.value)

    function f1(e) {

      mouseClick(e, cellTypes.empty.value)
    }

    game.addEventListener('mousemove', f1)
    game.addEventListener('mouseup', () => {
      game.removeEventListener('mousemove', f1)
    })
  }
}

game.addEventListener('mousedown', createWall)

// FUNCTIONS

function randomCell() {
  return {x: Math.floor(Math.random() * resolution), y: Math.floor(Math.random() * resolution)}
}

function displaySomething(x, y, type) {
  const sz = cSz / resolution - cellPadding * (1 + 1/resolution),
        cX = (sz + cellPadding) * x + cellPadding,
        cY = (sz + cellPadding) * y + cellPadding

  gctx.beginPath()
  gctx.rect(cX, cY, sz, sz)

  switch (type) {
    case cellTypes.wall.value:
      gctx.fillStyle =  cellTypes.wall.color
      break;
    case cellTypes.empty.value:
      gctx.fillStyle = cellTypes.empty.color
      break;
    case cellTypes.food.value:
      gctx.fillStyle = cellTypes.food.color
      break;
    case cellTypes.player.value:
      gctx.fillStyle = cellTypes.player.color
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
    const c = cellTypes.player
    field[c.x][c.y] = cellTypes.player.value
  }
}

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

  if(isGameControl) {

    if(key === 68) playerMovement(0)
    else if(key === 83) playerMovement(1)
    else if(key === 65) playerMovement(2)
    else if(key === 87) playerMovement(3)
  }
})