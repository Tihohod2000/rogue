class Game {
    mapWidth = 40;
    mapHeight = 24;
    mapOfGame = Array(this.mapHeight).fill().map(() => Array(this.mapWidth).fill(null));

    countOfEnemy = 10;

    countOfRooms = [5, 10];
    countOfHallways = [3, 5];
    arrOfHallways = [];
    arrOfRooms = [];

    countSword = 2;
    countPotion = 10;


    init(){
        this.generateRandomMap();

    }


    generateRandomMap(){
        //Добавление горизонтальных коридоров

        let randomCountOfHallwaysHorizontally =
            Math.floor(Math.random() * (this.countOfHallways[1] - this.countOfHallways[0] + 1))+3;
        let randomCountOfHallwaysVertically =
            Math.floor(Math.random() * (this.countOfHallways[1] - this.countOfHallways[0] + 1))+3;

        for (let i = 0; i < randomCountOfHallwaysHorizontally; i++) {
            let y = Math.floor(Math.random() * (this.mapHeight)+1);
            if(this.mapOfGame[y][0] === "floorOfHallwaysHorizontally"){
                y += 2;
                i--;
            }else{
                this.mapOfGame[y].fill("floorOfHallwaysHorizontally");
            }
        }

        //Добавление вертикальных коридоров
        for (let i = 0; i < randomCountOfHallwaysVertically; i++) {
            let x = Math.floor(Math.random() * (this.mapWidth)+1);
            while (true){
                if(this.mapOfGame[0][x] === "floorOfHallwaysVertically"){
                    x += 2;
                    i--;
                }else{
                    this.mapOfGame.map((row) => row[x] = "floorOfHallwaysVertically")
                    break;
                }
            }

        }

        //Добавление комнат

    }

}

let game = new Game();
game.init();
console.log(game.mapOfGame);