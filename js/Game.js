import {SpaceShip} from './Spaceship.js'

class Game {
    #htmlElemnts ={
        SpaceShip: this.#bindElement('[data-spaceship]')
    }
    #ship = new SpaceShip(this.#htmlElemnts.SpaceShip);

    init(){
        this.#ship.init();
    }

    #bindElement(element){
        return document.querySelector(element)
    }

    #bindElements(elements){
        return document.querySelectorAll(elements)
    }
}


window.document.addEventListener('DOMContentLoaded', () =>{
    const game = new Game();
    game.init()
})