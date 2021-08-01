<template>
  <div>
    <div class="dialogue">
      <div class="dialogue__content">
        <h1>Space Shooter</h1>
        <ul>
          <li>
            Use the <span class="key key--arrow">&larr;</span> and
            <span class="key key--arrow">&rarr;</span> keys to move.
          </li>
          <li>Use <span class="key">spacebar</span> to fire lasers.</li>
        </ul>
        <button>Start</button>
      </div>
    </div>
    <ul class="hud hud--hidden">
      <li class="hud__score">Score: <span>0</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ComingSoon",
  mounted() {
    const DEV_MODE = false;

    const stage = document.createElement("canvas"),
      ctx = stage.getContext("2d"),
      dialogue = document.querySelector(".dialogue"),
      startBtn = dialogue.querySelector("button"),
      hud = document.querySelector(".hud"),
      scoreNode = hud.querySelector(".hud__score span");

    let ship,
      lasers = [],
      enemies = [],
      playing = false,
      gameStarted = false,
      speedMultiplier,
      enemySeedFrameInterval,
      score = 0,
      tick = 0,
      laserTick = 0;

    function randomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function calcScore(x) {
      return Math.floor((1 / x) * 500);
    }

    function Ship(options) {
      this.radius = 15;
      this.x = options.x || stage.width * 0.5 - this.radius - 0.5;
      this.y = options.y || stage.height - this.radius - 30;
      this.width = this.radius * 2;
      this.height = this.width;
      this.color = options.color || "red";
      this.left = false;
      this.right = false;
      this.speed = 10;
      this.active = true;

      document.addEventListener("keydown", this.onKeyDown.bind(this));
      document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    Ship.prototype.update = function(x) {
      this.x = x;
      this.y = stage.height - this.radius - 30;
    };

    Ship.prototype.draw = function() {
      ctx.save();

      if (DEV_MODE) {
        ctx.fillStyle = "skyblue";
        ctx.fillRect(this.x, this.y, this.width, this.width);
      }

      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + this.radius - 5, this.y, 10, this.radius);
      ctx.fillRect(this.x, this.y + this.radius, this.width, 10);
      ctx.fillRect(this.x, this.y + this.radius + 10, 10, 5);
      ctx.fillRect(this.x + this.width - 10, this.y + this.radius + 10, 10, 5);

      ctx.restore();
    };

    Ship.prototype.onKeyDown = function(e) {
      if (ship.active) {
        if (e.keyCode === 39) this.right = true;
        else if (e.keyCode === 37) this.left = true;

        if (e.keyCode == 32 && !this.shooting) {
          this.shooting = true;
          laserTick = 0;
        }
      }
    };

    Ship.prototype.onKeyUp = function(e) {
      if (e.key === "ArrowRight") this.right = false;
      else if (e.key === "ArrowLeft") this.left = false;
      else if (e.keyCode == 32) this.shooting = false;
    };

    function Laser(options) {
      this.x = options.x - 0.5;
      this.y = options.y || stage.height - 50;
      this.width = 6;
      this.height = 20;
      this.speed = 15;
      this.color = options.color || "white";
      this.active = true;
    }

    Laser.prototype.update = function(y) {
      this.y = y;
    };

    Laser.prototype.draw = function() {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    function Enemy(options) {
      this.radius = randomBetween(10, 40);
      this.width = this.radius * 2;
      this.height = this.width;
      this.x = randomBetween(0, stage.width - this.width);
      this.y = -this.radius * 2;
      this.color =
        options != undefined && options.color ? options.color : "white";
      this.speed = 2;
      this.active = true;
    }

    Enemy.prototype.update = function(x, y) {
      this.x = x;
      this.y = y;
    };

    Enemy.prototype.draw = function() {
      if (DEV_MODE) {
        ctx.fillStyle = "skyblue";
        ctx.fillRect(this.x, this.y, this.width, this.width);
      }

      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(
        this.x + this.radius,
        this.y + this.radius,
        this.radius,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    function hitTest(item1, item2) {
      let collision = true;
      if (
        item1.x > item2.x + item2.width ||
        item1.y > item2.y + item2.height ||
        item2.x > item1.x + item1.width ||
        item2.y > item1.y + item1.height
      ) {
        collision = false;
      }
      return collision;
    }

    function handleLaserCollision() {
      for (let enemy of enemies) {
        for (let laser of lasers) {
          let collision = hitTest(laser, enemy);
          if (collision && laser.active) {
            console.log("you destroyed an enemy");
            enemy.active = false;
            laser.active = false;

            // increase enemy speed and frequency of enemy spawns
            speedMultiplier += 0.025;
            if (enemySeedFrameInterval > 20) {
              enemySeedFrameInterval -= 2;
            }

            // increase score
            score += calcScore(enemy.radius);
            scoreNode.textContent = score;
          }
        }
      }
    }

    function handleShipCollision() {
      // check for collisions between ship and enemies
      if (enemies.length) {
        for (let enemy of enemies) {
          let collision = hitTest(ship, enemy);
          if (collision) {
            console.log("your ship was destroyed");
            ship.active = false;
            setTimeout(() => {
              ship.active = true;
              speedMultiplier = 1;
              enemySeedFrameInterval = 100;
              score = 0;
              scoreNode.textContent = score;
            }, 2000);
          }
        }
      }
    }

    function drawShip(xPosition) {
      if (ship.active) {
        ship.update(xPosition);
        ship.draw();
      }
    }

    function drawEnemies() {
      if (enemies.length) {
        for (let enemy of enemies) {
          // draw an enemy if it's active
          if (enemy.active) {
            enemy.update(enemy.x, (enemy.y += enemy.speed * speedMultiplier));
            enemy.draw();
          }
        }
      }
    }

    function enemyCleanup() {
      if (enemies.length) {
        enemies = enemies.filter((enemy) => {
          let visible = enemy.y < stage.height + enemy.width;
          let active = enemy.active === true;
          return visible && active;
        });
      }
    }

    function drawLasers() {
      if (lasers.length) {
        for (let laser of lasers) {
          if (laser.active) {
            laser.update((laser.y -= laser.speed));
            laser.draw();
          }
        }
      }
    }

    function laserCleanup() {
      lasers = lasers.filter((laser) => {
        let visible = laser.y > -laser.height;
        let active = laser.active === true;
        return visible && active;
      });
    }

    function render() {
      if (playing) {
        let xPos = ship.x;

        // seed new enemies
        if (tick % enemySeedFrameInterval === 0 && ship.active) {
          const enemy = new Enemy();
          enemies.push(enemy);
          console.log({ enemySeedFrameInterval, speedMultiplier });
        }

        // background
        ctx.save();
        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, stage.width, stage.height);
        ctx.restore();

        // ship movement
        if (ship.left) xPos = ship.x -= ship.speed;
        else if (ship.right) xPos = ship.x += ship.speed;

        // stage boundaries
        if (gameStarted) {
          if (xPos < 0) xPos = 0;
          else if (xPos > stage.width - ship.width)
            xPos = stage.width - ship.width;
        }

        // create lasers, if shooting
        if (ship.active && ship.shooting) {
          if (laserTick === 0 || laserTick % 10 === 0) {
            let laser = new Laser({
              color: "skyblue",
              x: ship.x + ship.radius - 3,
            });
            lasers.push(laser);
          }
        }

        drawShip(xPos);

        handleShipCollision();
        handleLaserCollision();

        drawLasers();
        drawEnemies();

        enemyCleanup();
        laserCleanup();

        if (ship.shooting) laserTick++;
        tick++;
      }

      requestAnimationFrame(render);
    }

    function startGame(e) {
      console.log("starting game");
      dialogue.classList.add("dialogue--hidden");
      hud.classList.remove("hud--hidden");
      e.currentTarget.blur();

      // reset the demo/intro to the actual game settings:
      speedMultiplier = 1;
      enemySeedFrameInterval = 100;
      ship.x = stage.width * 0.5 - ship.radius - 0.5;
      ship.y = stage.height - ship.radius - 30;
      enemies = [];
      gameStarted = true;
    }

    function onResize() {
      stage.width = window.innerWidth;
      stage.height = window.innerHeight;
    }

    startBtn.addEventListener("click", startGame);
    window.addEventListener("resize", onResize);

    document.body.appendChild(stage);
    onResize();

    // start the ship off-screen:
    ship = new Ship({ color: "#ff9d00", x: -100, y: -100 });

    // set up some ridiculous enemy speeds for the intro:
    (speedMultiplier = 6), (enemySeedFrameInterval = 20);

    playing = true;
    render();
  },
};
</script>

<style>
button,
.key {
  border: 1px solid currentColor;
  border-radius: 5px;
  display: inline-block;
  padding: 0.8em;
}
body {
  color: #fff;
  font-family: "Press Start 2P", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
canvas {
  display: block;
}
h1 {
  font-size: 3rem;
  margin-bottom: 0.5em;
}
ul {
  margin-bottom: 2rem;
}
li {
  color: #ff9d00;
  font-size: 0.8rem;
  margin-bottom: 1em;
  text-transform: uppercase;
}
button {
  appearance: none;
  background-color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  padding: 0.7em 0.85em 0.6em 1em;
  text-transform: uppercase;
  transition: color 0.2s linear, background-color 0.2s linear;
}
button:focus,
button:hover {
  background-color: black;
  color: #ff9d00;
  transition-duration: 0.07s;
}
.dialogue {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  opacity: 1;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
  transform: translateX(0);
}
.dialogue--hidden {
  opacity: 0;
  transform: translateX(-100vw);
  transition: opacity 0.3s linear 0s, transform 0s linear 0.3s;
}
.dialogue__content {
  max-width: 31.25rem;
  padding: 18px;
}
.key {
  border-color: white;
  color: white;
}
.key--arrow {
  font-size: 1.8rem;
  padding: 0.35em 0.1em 0.6em;
  position: relative;
  line-height: 0.3;
  top: 0.05em;
}
.hud {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  left: 0;
  opacity: 1;
  padding: 1rem;
  position: fixed;
  top: 0;
  transition: opacity 0.07s linear 0.5s;
  width: 100%;
}
.hud--hidden {
  opacity: 0;
}
.hud__score {
  margin: 0;
}
</style>
