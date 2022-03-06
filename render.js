// RENDER

const fps = 60,
getUpdate = setInterval(() => {
    
  requestAnimationFrame(() => {

    gctx.clearRect(0, 0, cSz, cSz)
    checkFood()
    displayField()
  })
}, 1000 / fps)