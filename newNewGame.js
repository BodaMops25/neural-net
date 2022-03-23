const field = [],
      fieldObjects = [],
      resolution = 19,
      cellPadding = 2,
      cntr = Math.floor(resolution / 2)

function getFieldCell({x, y} = {}) {
  return field[x][y]
}

function randomCell() {
  return {
    x: Math.round(Math.random() * resolution),
    y: Math.round(Math.random() * resolution)
  }
}

class FieldCell {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class EmptyCell extends FieldCell {
  constructor(x, y) {
    super(x, y)
    this.type = 'empty'
    this.color = '#e4e4e4'
    this.isSolid = 0
  }
}

class WallCell extends FieldCell {
  constructor(x, y) {
    super(x, y)
    this.type = 'wall'
    this.color = '#000'
    this.isSolid = 1
  }
}

class FoodGen extends FieldCell {
  constructor(x, y) {
    super(x, y)
    this.type = 'food'
    this.color = '#d9ff01'
    this.isSolid = 0
  }

  eaten(player) {
    player.food++
    this.newPos()
  }

  newPos() {
    let rndCell = randomCell()

    while(getFieldCell(rndCell).type !== 'empty') rndCell = randomCell()

    this.x = rndCell.x
    this.y = rndCell.y
  }
}

class Player extends FieldCell {
  constructor(x, y) {
    super(x, y)
    this.type = 'player'
    this.color = '#faa'
    this.food = 0
    this.isSolid = 1
  }

  movement(dir) {
    const nextPos = {x: this.x, y: this.y}

    if(dir === 0 && this.x + 1 < resolution) nextPos.x++
    else if(dir === 1 && this.y + 1 < resolution) nextPos.y++
    else if(dir === 2 && this.x - 1 >= 0) nextPos.x--
    else if(dir === 3 && this.y - 1 >= 0) nextPos.y--

    if(getFieldCell(newPos).type === 'food') getFieldCell(newPos).eaten(this)
    if(!getFieldCell(newPos).isSolid) {
      this.x = nextPos.x
      this.y = nextPos.y
    }
  }
}

// SET FIELD 

for(let i = 0; i < resolution; i++) {

  field[i] = []

  for(let j = 0; j < resolution; j++) {
    field[i][j] = new EmptyCell(i, j)
  }
}

function displaySomething(x, y, cellColor) {
  const sz = cSz / resolution - cellPadding * (1 + 1 / resolution),
        cX = (sz + cellPadding) * x + cellPadding,
        cY = (sz + cellPadding) * y + cellPadding

  gctx.beginPath()
  gctx.rect(cX, cY, sz, sz)
  gctx.fillStyle = cellColor

  gctx.fill()
}

function displayField() {

  field.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      displaySomething(rowIndex, columnIndex, cell.color)
    })
  })
}