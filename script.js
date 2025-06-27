class Game {
    mapWidth = 40;
    mapHeight = 24;
    mapOfGame = Array(this.mapHeight).fill().map(() => Array(this.mapWidth).fill().map(() => ({
        structure: "Wall"
    })
    ));

    countOfEnemy = 10;

    SizeOfRoom = [3, 8];

    countOfRooms = [5, 10];
    countOfHallways = [3, 5];

    arrOfHallways = [];
    arrOfRooms = [];

    countSword = 2;
    countPotion = 10;

    CELL_SIZE_X = 1024/40;
    CELL_SIZE_Y = 640/24;


    init() {
        this.generateRandomMap();

        //дальше нужно рандомно расположить врагов, мечи, зелья и главного героя

    }


    generateRandomMap() {
        //Добавление коридоров
        this.generateHallways();

        //Добавление комнат
        this.generateRooms();
        console.log(this.mapOfGame);

    }

    generateRooms() {
        let randomCountOfRooms =
            Math.floor(Math.random() * (this.countOfRooms[1] - this.countOfRooms[0] + 1)) + 5;


        for (let i = 0; i < randomCountOfRooms; i++) {
            let startX = Math.floor(Math.random() * this.mapWidth + 1);
            let startY = Math.floor(Math.random() * this.mapHeight + 1);

            let randomSizeWidthOfRooms =
                Math.floor(Math.random() * (this.SizeOfRoom[1] - this.SizeOfRoom[0] + 1)) + 3;
            let randomSizeHeightOfRooms =
                Math.floor(Math.random() * (this.SizeOfRoom[1] - this.SizeOfRoom[0] + 1)) + 3;

            //Проверка что комната при создании не выйдет за карту
            while (startX + randomSizeWidthOfRooms > this.mapOfGame[0].length) {
                startX--;
            }
            while (startY + randomSizeHeightOfRooms > this.mapOfGame.length) {
                startY--;
            }

            //Сделать проверку что комната будет достяжимой

            let roomReachability = false;

            // console.log(startX, startY, randomSizeWidthOfRooms);

            exitLoopPoint: for (let y = startY; y < (startY + randomSizeHeightOfRooms); y++) {
                for (let x = startX; x < (startX + randomSizeWidthOfRooms); x++) {
                    if (
                        (y+1 >= this.mapOfGame.length || this.mapOfGame[y+1][x].structure !== "Wall") ||
                        (x+1 >= this.mapOfGame[y].length || this.mapOfGame[y][x+1].structure !== "Wall")
                    ) {
                        roomReachability = true;
                        break exitLoopPoint;
                    }
                }
            }


            //Если комната не прошла проверку
            if(!roomReachability){
                i--;
                continue;
            }

            //Создание комнаты
            for (let y = startY; y < (startY + randomSizeHeightOfRooms); y++) {
                for (let x = startX; x < (startX + randomSizeWidthOfRooms); x++) {
                    this.mapOfGame[y][x].structure = "floorOfRoom";
                }
            }
        }

    }

    generateHallways() {
        let randomCountOfHallwaysHorizontally =
            Math.floor(Math.random() * (this.countOfHallways[1] - this.countOfHallways[0] + 1)) + 3;
        let randomCountOfHallwaysVertically =
            Math.floor(Math.random() * (this.countOfHallways[1] - this.countOfHallways[0] + 1)) + 3;

        //Добавление горизонтальных коридоров
        for (let i = 0; i < randomCountOfHallwaysHorizontally; i++) {
            let y = Math.floor(Math.random() * (this.mapHeight-1) + 1);
            // console.log(`y: ${y}`)
            if (this.mapOfGame[y][0].structure === "floorOfHallwaysHorizontally") {
                i--;
            } else if (y < this.mapOfGame.length) {
                this.mapOfGame[y].fill(
                    {
                        structure: "floorOfHallwaysHorizontally"
                    });
            } else {
                i--;
            }
        }

        //Добавление вертикальных коридоров
        for (let i = 0; i < randomCountOfHallwaysVertically; i++) {
            let x = Math.floor(Math.random() * (this.mapWidth-1) + 1);
            let structure = this.mapOfGame[0][x];
            // console.log(structure.structure)
            // console.log(structure)
            if (structure.structure === "floorOfHallwaysVertically") {
                i--;
            } else if (x < this.mapOfGame[0].length) {
                this.mapOfGame.map((row) => row[x].structure = "floorOfHallwaysVertically")
            } else {
                i--;
            }


        }
    }

}

function renderMap(matrix){
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    // const cellSizeX = 1024/40;
    // const cellSizeY = 640/24;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    matrix.forEach((row, y) => {
        row.forEach((cell, x) => {
            let img;
            if(cell.structure === "Wall"){
                img = textures.wall;
            }else{
                img = textures.floor;
            }
            //клетка
            ctx.drawImage(
                img,
                x * game.CELL_SIZE_X,
                y * game.CELL_SIZE_Y,
                game.CELL_SIZE_X,
                game.CELL_SIZE_Y
            );

            //границы
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.strokeRect(
                x * game.CELL_SIZE_X,
                y * game.CELL_SIZE_Y,
                game.CELL_SIZE_X,
                game.CELL_SIZE_Y
            );

        });
    });
}

let game = new Game();
game.init();
// Объект для хранения загруженных изображений
const textures = {
    floor: new Image(),
    wall: new Image()
};

textures.wall.src = 'images/tile-W.png';
textures.floor.src = 'images/tile-.png';
Promise.all([
    new Promise(resolve => {textures.wall.onload = resolve;}),
    new Promise(resolve => {textures.floor.onload = resolve;}),
]).then(() => {
    renderMap(game.mapOfGame);
})

// console.log(game.mapOfGame);