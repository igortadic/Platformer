import platform from '../img/platform.png'
import background from '../img/background.png'
import hills from '../img/hills.png'
import platformSmallTall from '../img/platformSmallTall.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = .5

class Player {
  constructor() {
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    },
    this.velocity = {
      x: 0,
      y: 1
    }
    this.width = 66
    this.height = 150

    this.image = createImage(spriteStandRight)
    this.frames = 0
  }

  draw() {
    c.drawImage(
      this.image,
      177 * this.frames,
      0,
      177,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.frames++
    if(this.frames > 28) {
      this.frames = 0;
    }
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}


class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image,
      this.position.x,
      this.position.y)
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image,
      this.position.x,
      this.position.y)
  }
}

const genericObjects = [
  new GenericObject({
    x: 0,
    y: 0,
    image: createImage(background)
  }),
  new GenericObject({
    x: 0,
    y: 0,
    image: createImage(hills)
  })
]

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

const platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)

const player = new Player();
const platforms = [
  new Platform({
    x: platformImage.width * 4 + 100 - 2 + platformImage.width - platformSmallTallImage.width,
    y: 280,
    image: createImage(platformSmallTall)
  }),
  new Platform({
    x: -1,
    y: 480,
    image: platformImage
  }),
  new Platform({
    x: platformImage.width - 2.9,
    y: 480,
    image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 480,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3 + 200,
      y: 480,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 4 + 100,
      y: 480,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 5 + 600,
      y: 480,
      image: platformImage
    })
]

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrollOffset = 0;

player.update();

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height)

  genericObjects.forEach(GenericObject => {
    GenericObject.draw()
  })

  platforms.forEach(platform => {
    platform.draw();
  })

  player.update();


  if (keys.right.pressed && player.position.x < 500) {
    player.velocity.x = player.speed
  } else if ((keys.left.pressed && player.position.x > 100)
  || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0

    if (keys.right.pressed) {
      platforms.forEach(platform => {
        scrollOffset = scrollOffset + player.speed
        platform.position.x = platform.position.x - player.speed;
      })
      genericObjects.forEach(GenericObject => {
        GenericObject.position.x -= player.speed * .66
      })
    } else if (keys.left.pressed && scrollOffset > 0) {
      platforms.forEach(platform => {
        scrollOffset = scrollOffset - player.speed
        platform.position.x = platform.position.x + player.speed
      })
      genericObjects.forEach(GenericObject => {
        GenericObject.position.x += player.speed * .66
      })
    }
  }

console.log(scrollOffset);

  // platform collision detection
  platforms.forEach(platform => {
    if (player.position.y + player.height <=
      platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
      platform.position.y &&
      player.position.x + player.width >=
      platform.position.x &&
      player.position.x <=
      platform.position.x + platform.width) {

      player.velocity.y = 0;

    }
  })

  // Win condition
  if (scrollOffset > 2000) {
    console.log("you win!")
  }

  // Lose condition
  if(player.position.y > 800) {
    location.reload()
  }

}

animate()

window.addEventListener('keydown', ({keyCode}) => {
  console.log(keyCode);

  switch (keyCode) {
    case 65:
      console.log('left')
      keys.left.pressed = true;
      break;

    case 83:
      console.log('down')
      break;

    case 68:
      console.log('right')
      keys.right.pressed = true;
      break;

    case 87:
      console.log('up')
      player.velocity.y = player.velocity.y - 10;
      break;
  }
})

window.addEventListener('keyup', ({keyCode}) => {
  console.log(keyCode);

  switch (keyCode) {
    case 65:
      console.log('left')
      keys.left.pressed = false;
      break;

    case 83:
      console.log('down')
      break;

    case 68:
      console.log('right')
      keys.right.pressed = false;
      break;

    case 87:
      console.log('up')
      break;
  }
})
