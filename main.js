
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 575

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 650,
    y: 222
  },
  imageSrc: './img/shop.png',
  scale: 2,
  framesMax: 6
})


const player = new Fighter({
  
  position: {
    x: 200,
    y: 0
  },
  
  velocity: {
    x: 0,
    y: 0
  },
  
  imageSrc: './img/samurai/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  
  sprites: {
    
    idle: {
      imageSrc: './img/samurai/Idle.png',
      framesMax: 8
    },
    
    run: {
      imageSrc: './img/samurai/Run.png',
      framesMax: 8
    },
    
    jump: {
      imageSrc: './img/samurai/Jump.png',
      framesMax: 2
    },
    
    fall: {
      imageSrc: './img/samurai/Fall.png',
      framesMax: 2
    },
    
    attack1: {
      imageSrc: './img/samurai/Attack1.png',
      framesMax: 6
    },
    
    takeHit: {
      imageSrc: './img/samurai/Take Hit - white silhouette.png',
      framesMax: 4
    },
    
    death: {
      imageSrc: './img/samurai/Death.png',
      framesMax: 6
    }
    
  },
  
  attackBox: {
    offset: {
      x: 85,
      y: 40
    },
    width: 170,
    height: 50
  }
  
})

const enemy = new Fighter({
  
  position: {
    x: 600,
    y: 100
  },
  
  velocity: {
    x: 0,
    y: 0
  },
  
  imageSrc: './img/warrior/Idle.png',
  framesMax: 4,
  scale: 2.5,
  
  offset: {
    x: 215,
    y: 167
  }, 
  
  sprites: {
    
    idle: {
      imageSrc: './img/warrior/Idle.png',
      framesMax: 4
    },
    
    run: {
      imageSrc: './img/warrior/Run.png',
      framesMax: 8
    },
    
    jump: {
      imageSrc: './img/warrior/Jump.png',
      framesMax: 2
    },
    
    fall: {
      imageSrc: './img/warrior/Fall.png',
      framesMax: 2
    },
    
    attack1: {
      imageSrc: './img/warrior/Attack1.png',
      framesMax: 4
    },
    
    takeHit: {
      imageSrc: './img/warrior/Take hit.png',
      framesMax: 3
    },
    
    death: {
      imageSrc: './img/warrior/Death.png',
      framesMax: 7
    }
    
  },
  
  attackBox: {
    offset: {
      x: -165,
      y: 50
    },
    width: 145,
    height: 50
  }
  
})

const keys = {
  
  a: {
    pressed: false
  },
  
  d: {
    pressed: false
  },
  
  w: {
    pressed: false
  },
  
  ArrowLeft: {
    pressed: false
  },
  
  ArrowRight: {
    pressed: false
  },
  
  ArrowUp: {
    pressed: false
  }
  
}

decreaseTimer()

function animate() {
  
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  background.update()
  shop.update()
  
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  enemy.update()
  player.update()
  
  enemy.velocity.x = 0
  player.velocity.x = 0
  
  //player movement
  
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }
  
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }
  
  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }
  
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }
  
  if (rectangularCollision({ one: enemy, other: player }) && enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
    player.takeHit()
    
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
    
  }
  
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }
  
  if (rectangularCollision({ one: player, other: enemy }) && player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
    enemy.takeHit()
    
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
    
  }
  
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }
  
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
  
  window.requestAnimationFrame(animate)
  
}

animate()

window.addEventListener('keydown', (info) => {
  
  if (!player.dead) {
  
    switch (info.key) {
    
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
    
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      
      case 'w':
        player.velocity.y = -20
        break
      
      case ' ':
        player.attack()
        break
      
    }
    
  }
  
  if (!enemy.dead) {
  
    switch (info.key) {
    
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
    
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
    
      case 'ArrowDown':
        enemy.attack()
        break
    }
  
  }
  
})

window.addEventListener('keyup', (info) => {
  
  switch (info.key) {
    
    case 'd':
      keys.d.pressed = false
      break
    
    case 'a':
      keys.a.pressed = false
      break
      
  }
  
  switch (info.key) {
    
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
      
  }
  
})

// 1:51:00