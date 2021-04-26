import {SpaceShip} from './Spaceship.js'
import {Enemy} from './Enemy.js'

class Game {
    #htmlElemnts ={
        spaceShip: this.#bindElement('[data-spaceship]'),
        container: this.#bindElement('[data-container]'),
        score: this.#bindElement('[data-score]'),
        lives: this.#bindElement('[data-lives]'),
        modal: this.#bindElement('[data-modal]'),
        scoreInfo: this.#bindElement('[data-score-info]'),
        button: this.#bindElement('[data-button]'),
    }

    #ship = new SpaceShip(this.#htmlElemnts.spaceShip, this.#htmlElemnts.container);
    #checkPositionInterval = null;
    #createNewEnemyInterval = null;

    #enemies = []
    #enemiesTime = null;

    #lives = null;
    #score = null;

    init(){
        this.#ship.init();
        this.#newGame();
        this.#htmlElemnts.button.addEventListener('click', () => this.#newGame())
    }

    #endGame(){
        this.#htmlElemnts.modal.classList.remove('hide');
        this.#htmlElemnts.scoreInfo.textContent = `You lose! Your score is ${this.#score}`
        this.#enemies.forEach(enemy => enemy.explode())
        this.#enemies.length = 0;
        clearInterval(this.#checkPositionInterval)
        clearInterval(this.#createNewEnemyInterval)
    }

    #updateScoreText(){
        this.#htmlElemnts.score.innerHTML = this.#score;
    }

    #updateLivesText(){
        this.#htmlElemnts.lives.innerHTML = this.#lives;
    }

    #updateLives(){
        this.#lives--;
        this.#htmlElemnts.container.classList.add('hit');

        setTimeout(()=>{
            this.#htmlElemnts.container.classList.remove('hit');
        },100)

        this.#updateLivesText() 

        if(!this.#lives){
            this.#endGame();
        }
    }

    #updateScore(){
        this.#score++;
        if(!(this.#score % 5)){
            this.#enemiesTime--;
        }
        this.#updateScoreText()
    }

    #checkPosition(){
        this.#enemies.forEach((enemy, enemyIndex, enemiesArr) => {
            const enemyPosition = {
                top: enemy.element.offsetTop,
                right: enemy.element.offsetLeft + enemy.element.offsetWidth,
                bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
                left: enemy.element.offsetLeft,
            };

            if (enemyPosition.top > window.innerHeight) {
                enemy.explode();
                enemiesArr.splice(enemyIndex, 1);
                this.#updateLives();
            }

            this.#ship.missiles.forEach((missile, missileIndex, missileArr) => {
                const missilePosition = {
                    top: missile.element.offsetTop,
                    right: missile.element.offsetLeft + missile.element.offsetWidth,
                    bottom: missile.element.offsetTop + missile.element.offsetHeight,
                    left: missile.element.offsetLeft,
                };
                if (
                    missilePosition.bottom >= enemyPosition.top &&
                    missilePosition.top <= enemyPosition.bottom &&
                    missilePosition.right >= enemyPosition.left &&
                    missilePosition.left <= enemyPosition.right
                ) {
                    enemy.hit();
                    if (!enemy.lives) {
                    enemiesArr.splice(enemyIndex, 1);
                    }
                    missile.remove();
                    missileArr.splice(missileIndex, 1);
                    this.#updateScore();
                }
                if (missilePosition.bottom < 0) {
                    missile.remove();
                    missileArr.splice(missileIndex, 1);
                }
            });
        });
    }

    #createNewEnemy(...params) {
        const enemy = new Enemy(...params);
        enemy.init();
        this.#enemies.push(enemy);
    }

    #randomNewEnemy(){
        const randomNumber = Math.floor(Math.random() * 5 + 1)
        randomNumber % 5 ? this.#createNewEnemy(
            this.#htmlElemnts.container,
            this.#enemiesTime,
            'enemy',
            'explosion'
        ) : 
        this.#createNewEnemy(
            this.#htmlElemnts.container,
            this.#enemiesTime * 2,
            'enemy--big',
            'explosion--big',
            3
        ) 
    }

    #bindElement(element){
        return document.querySelector(element)
    }

    #newGame(){
        this.#enemiesTime = 30;
        this.#lives = 3;
        this.#score = 0; 
        this.#updateLivesText();
        this.#updateScoreText();
        this.#ship.element.style.left = `0px`;
        this.#ship.setPosition();
        this.#htmlElemnts.modal.classList.add('hide');
        this.#createNewEnemyInterval = setInterval(() => this.#randomNewEnemy(), 1000)
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
    }
}


window.document.addEventListener('DOMContentLoaded', () =>{
    const game = new Game();
    game.init();
})