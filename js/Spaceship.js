export class SpaceShip{
    constructor(element){
        this.element = element
    }

    #modifire = 5;
    #leftArrow = false;
    #rightArrow = false;


    #getPosition(){
        return this.element.offsetLeft + this.element.offsetWidth / 2
    }

    #setPosition(){
        this.element.style.bottom = '0px';
        this.element.style.left = `${window.innerWidth / 2  - this.#getPosition()}px`
    }

    #eventListeners(){
        window.addEventListener('keydown', ({ keyCode }) => {
            switch(keyCode){
                case 37:
                   this.#leftArrow = true
                    break;
                case 39:
                    this.#rightArrow = true
                    break;
            }
        });

        window.addEventListener('keyup', ({ keyCode }) => {
            switch(keyCode){
                case 37:
                   this.#leftArrow = false
                    break;
                case 39:
                    this.#rightArrow = false
                    break;
            }
        })
    }

    #whatKey(){
        if(this.#leftArrow && this.#getPosition() > 0){
            this.element.style.left =`${parseInt(this.element.style.left, 10) - this.#modifire}px`
        }
        if(this.#rightArrow && this.#getPosition() < window.innerWidth){
            this.element.style.left =`${parseInt(this.element.style.left, 10) + this.#modifire}px`
        }
    }

    #gameLoop = () => {
        this.#whatKey()
        requestAnimationFrame(this.#gameLoop)
    }

    init(){
        this.#setPosition();
        this.#eventListeners()
        this.#gameLoop();
    }
}