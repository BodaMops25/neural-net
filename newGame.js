const field = [],
      resolution = 19,
      cellPadding = 2,
      cntr = Math.floor(resolution / 2),
      cellTypes = {
        null: {id: 'null'},
        empty: {id: 'empty', class: 'empty', color: '#e4e4e4'},
        wall: {id: 'wall', class: 'wall', color: '#000'},
        food: {id: 'food', class: 'food', color: '#d9ff01'},
      }        player: {id: 'player', class: 'player', color: '#faa', x: cntr, y: cntr, stomach: 0}

for(let i = 0; i < resolution; i++) {

  field[i] = []

  for(let j = 0; j < resolution; j++) {
    field[i][j] = {id: cellTypes.empty.id, class: cellTypes.empty.class}
  }
}

// FUNCTIONS

function degToRad(deg) {
  return deg * Math.PI / 180
}

function radToDeg(rad) {
  return rad * 180 / Math.PI
}

function randomCellConstDistanceAngle(distance) {
  const rndAngle = Math.random() * 360

  let cos = Math.cos(degToRad(rndAngle)),
      sin = Math.sin(degToRad(rndAngle))

  return {x: Math.round(cos * distance), y: Math.round(sin * distance)}
}

// PLAYERS

function Player(id) {
  this.id = 'Player_' + id
  this.class = 'player'
  this.color = '#faa'
  this.x = cntr
  this.y = cntr
  this.stomach = 0
  this.movement = dir => {

    const nextPos = {x: this.x, y: this.y}
    
    if(dir === 0 && this.x + 1 < resolution) nextPos.x++
    else if(dir === 1 && this.y + 1 < resolution) nextPos.y++
    else if(dir === 2 && this.x - 1 >= 0) nextPos.x--
    else if(dir === 3 && this.y - 1 >= 0) nextPos.y--

    if(field[nextPos.x][nextPos.y].class !== 'wall') {

      field[this.x][this.y].id = cellTypes.empty.id
      field[this.x][this.y].class = cellTypes.empty.class

      if(field[nextPos.x][nextPos.y].class === 'food') {

        if(field[nextPos.x][nextPos.y].id.match('RandomFoodConstDistance_')) {
          const cell = cellTypes[field[nextPos.x][nextPos.y].id]

          let rndPos = randomCellConstDistanceAngle(10)

          while((rndPos.x < 0 || resolution <= rndPos.x) || (rndPos.y < 0 || resolution <= rndPos.y)) rndPos = randomCellConstDistanceAngle(10)

          cell.x = rndPos.x
          cell.y = rndPos.y

          field[cell.x][cell.y] = {id: cell.id, class: cell.class}
        }

        this.stomach++
        document.querySelector('#food span').innerHTML = p.stomach
      }

      this.x = nextPos.x
      this.y = nextPos.y
      field[this.x][this.y].id = this.id
      field[this.x][this.y].class = this.class
    }
  }

  field[this.x][this.y] = {id: this.id, class: this.class}
}

// food gen

function RandomFoodConstDistance(id) {
  this.id = 'RandomFoodConstDistance_' + id
  this.class = 'food'
  this.color = '#d9ff01'

  const rndStartPos = randomCellConstDistanceAngle(10)

  this.x = cntr + rndStartPos.x
  this.y = cntr + rndStartPos.y

  field[this.x][this.y] = {id: this.id, class: this.class}
}

// render 

function displaySomething(x, y, cell) {
  const sz = cSz / resolution - cellPadding * (1 + 1 / resolution),
        cX = (sz + cellPadding) * x + cellPadding,
        cY = (sz + cellPadding) * y + cellPadding

  gctx.beginPath()
  gctx.rect(cX, cY, sz, sz)
  gctx.fillStyle = cellTypes[cell].color

  gctx.fill()
}

function displayField() {

  field.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      displaySomething(rowIndex, columnIndex, cell.id)
    })
  })
}