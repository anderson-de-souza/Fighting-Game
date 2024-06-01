function determineWinner({ player, enemy, timerId }) {
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = getMessageFormat('Tie')
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = getMessageFormat('Player 1 Wins')
  } else if (enemy.health > player.health) {
    document.querySelector('#displayText').innerHTML = getMessageFormat('Player 2 Wins')
  }
  document.querySelector('#displayText').style.display = 'flex'
  clearTimeout(timerId)
}

function getMessageFormat(value) {
  return `<h1 style="background-color: black; padding: 20px; border-radius: 10px;">${ value }</h1>`
}

let timer = 60
let timerId

function decreaseTimer() {
  
  if (timer > 0) {
    timer--
    document.querySelector('#timer').innerHTML = timer
    timerId = setTimeout(decreaseTimer, 1000)
  } else {
    
    determineWinner({ player, enemy, timerId });
    
  }
  
}

function rectangularCollision({ one, other}) {
  
  return (
    one.attackBox.position.x + one.attackBox.width >= other.position.x 
    && one.attackBox.position.x <= other.position.x + other.width &&
    one.attackBox.position.y + one.attackBox.height >= other.position.y
    && one.attackBox.position.y <= other.position.y + other.height
  )
  
}