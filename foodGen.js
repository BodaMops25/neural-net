const foodObj = randomCell()

function checkFood() {
  const {x: pX, y: pY} = cellTypes.player

  if(pX === foodObj.x && pY === foodObj.y) {
    const tmpCell = randomCell()
    foodObj.x = tmpCell.x
    foodObj.y = tmpCell.y
  }

  field[foodObj.x][foodObj.y] = cellTypes.food.value
}