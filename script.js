const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");

const mapWidth = 40;
const mapHeight = 24;

const cellSize = 20;

const countOfRooms = [5, 10];
const SizeOfRoom = [3, 8];

const countOfHallways = [3, 5];

const countOfEnemy = 10;
const countOfPotion = 10;
const countOfSword = 2;
let enemys = [];
let potions = [];
let swords = [];

let person;

let map = Array(mapHeight).fill().map(() => Array(mapWidth).fill().map(() => 1));

generateHallways()
generateRooms()
generatePerson()
generateItem()
generateEnemy()

// console.log(map)

function generateItem() {

    for (let i = 0; i < countOfPotion; i++) {
        let position = randomPosition();
        potions.push({
            x: position.x,
            y: position.y,
            type: "health"
        });
    }

    for (let i = 0; i < countOfSword; i++) {
        let position = randomPosition();
        swords.push({
            x: position.x,
            y: position.y,
            type: "attach"
        });
    }


    // console.log(person);

}


function generatePerson() {

    let x, y;
    do {
        x = Math.floor(Math.random() * (mapWidth - 2)) + 1;
        y = Math.floor(Math.random() * (mapHeight - 2)) + 1;
    } while (map[y][x] !== 0);

        person = {
            x: x,
            y: y,
            health: 100,
            attack: 10
        };

    console.log(person);

}

function randomPosition(){
    let x, y;
    do {
        x = Math.floor(Math.random() * (mapWidth - 2)) + 1;
        y = Math.floor(Math.random() * (mapHeight - 2)) + 1;
    } while (map[y][x] !== 0 || (x === person.x && y === person.y));

    return {x, y};
}

function generateEnemy() {

    for (let i = 0; i < countOfEnemy; i++) {

        let position = randomPosition();
        enemys.push({
            x: position.x,
            y: position.y,
            health: 30,
            attack: 5,
        });


    }
    console.log(enemys);

}

function isCellFree(x, y) {
    if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return false;
    if (map[y][x] === 1) return false;

    // Проверка на монстров
    for (let enemy of enemys) {
        if (enemy.x === x && enemy.y === y) {
            return false;
        }
    }

    return true;
}


function generateHallways() {
    let randomCountOfHallwaysHorizontally =
        Math.floor(Math.random() * (countOfHallways[1] - countOfHallways[0] + 1)) + 3;
    let randomCountOfHallwaysVertically =
        Math.floor(Math.random() * (countOfHallways[1] - countOfHallways[0] + 1)) + 3;

    //Добавление горизонтальных коридоров
    for (let i = 0; i < randomCountOfHallwaysHorizontally; i++) {
        let y = Math.floor(Math.random() * (mapHeight - 1) + 1);
        // console.log(`y: ${y}`)
        if (map[y][0] === 0) {
            i--;
        } else if (y < map.length) {
            map[y].fill(0);
        } else {
            i--;
        }
    }

    //Добавление вертикальных коридоров
    for (let i = 0; i < randomCountOfHallwaysVertically; i++) {
        let x = Math.floor(Math.random() * (mapWidth - 1) + 1);
        let structure = map[0][x];
        // console.log(structure.structure)
        // console.log(structure)
        if (structure === 0) {
            i--;
        } else if (x < map[0].length) {
            map.map((row) => row[x] = 0)
        } else {
            i--;
        }


    }
}


function generateRooms() {
    let randomCountOfRooms =
        Math.floor(Math.random() * (countOfRooms[1] - countOfRooms[0] + 1)) + 5;


    for (let i = 0; i < randomCountOfRooms; i++) {
        let startX = Math.floor(Math.random() * mapWidth + 1);
        let startY = Math.floor(Math.random() * mapHeight + 1);

        let randomSizeWidthOfRooms =
            Math.floor(Math.random() * (SizeOfRoom[1] - SizeOfRoom[0] + 1)) + 3;
        let randomSizeHeightOfRooms =
            Math.floor(Math.random() * (SizeOfRoom[1] - SizeOfRoom[0] + 1)) + 3;

        //Проверка что комната при создании не выйдет за карту
        while (startX + randomSizeWidthOfRooms > map[0].length) {
            startX--;
        }
        while (startY + randomSizeHeightOfRooms > map.length) {
            startY--;
        }

        //Сделать проверку что комната будет достяжимой
        let roomReachability = false;

        exitLoopPoint: for (let y = startY; y < (startY + randomSizeHeightOfRooms); y++) {
            for (let x = startX; x < (startX + randomSizeWidthOfRooms); x++) {
                if (
                    (y + 1 >= map.length || map[y + 1][x] !== 1) ||
                    (x + 1 >= map[y].length || map[y][x + 1] !== 1)
                ) {
                    roomReachability = true;
                    break exitLoopPoint;
                }
            }
        }

        //Если комната не прошла проверку
        if (!roomReachability) {
            i--;
            continue;
        }

        //Создание комнаты
        for (let y = startY; y < (startY + randomSizeHeightOfRooms); y++) {
            for (let x = startX; x < (startX + randomSizeWidthOfRooms); x++) {
                map[y][x] = 0;
            }
        }
    }

}



// Отрисовка карты
function drawMap() {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            let img;
            if (map[y][x] === 1) {
                img = textures.wall;
            } else {
                img = textures.floor;
            }
            ctx.drawImage(
                img,
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
            )
            // ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawSwords() {
    let img = textures.sword;
    swords.forEach(sword => {
        ctx.drawImage(
            img,
            sword.x * cellSize,
            sword.y * cellSize,
            cellSize,
            cellSize
        )
    })
}

function drawPotions() {
    let img = textures.potion;
    potions.forEach(potion => {
        ctx.drawImage(
            img,
            potion.x * cellSize,
            potion.y * cellSize,
            cellSize,
            cellSize
        )
    })
}

function drawPerson() {
    let img = textures.person;
    ctx.drawImage(
        img,
        person.x * cellSize,
        person.y * cellSize,
        cellSize,
        cellSize
    )
}

//Отрисовка монстров
function drawEnemys() {
    let img = textures.enemy;
    enemys.forEach(enemy => {
        ctx.drawImage(
            img,
            enemy.x * cellSize,
            enemy.y * cellSize,
            cellSize,
            cellSize
        )
    })
}


function  moveEnemys() {
    enemys.forEach(enemy => {
        const directions = [
            { dx: 0, dy: -1 }, // вверх
            { dx: 1, dy: 0 },  // вправо
            { dx: 0, dy: 1 },  // вниз
            { dx: -1, dy: 0 }  // влево
        ];


        //Движение противников
        let bestDirections = null;
        let bestDistance = Infinity;

        for(let dir of directions) {
            const newX = enemy.x + dir.dx;
            const newY = enemy.y + dir.dy;

            if(isCellFree(newX, newY) || (newX === person.x && newY === person.y)) {
                const dist = Math.pow(newX - person.x, 2) + Math.pow(newY - person.y, 2)
                if(dist < bestDistance) {
                    bestDistance = dist
                    bestDirections = dir
                }
            }

            if(bestDirections){
                const nx = enemy.x + bestDirections.dx;
                const ny = enemy.y + bestDirections.dy;

                if (nx === person.x && ny === person.y) {
                    // player.health -= monster.attack;
                    // console.log(`Игрок атакован! Здоровье: ${player.health}`);
                } else if (isCellFree(nx, ny)) {
                    enemy.x = nx;
                    enemy.y = ny;
                }

            }

        }
    })

    enemys.filter(e => e.health > 0);
}

function gameLoop() {
    // Очистка экрана
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка
    drawMap();
    drawSwords();
    drawPotions();
    drawPerson()
    drawEnemys();
    // drawPlayer();

    // Информация о здоровье
    // ctx.fillStyle = '#FFF';
    // ctx.font = '20px Arial';
    // ctx.fillText(`Здоровье: ${player.health}`, 20, 30);

    requestAnimationFrame(gameLoop);
}

const textures = {
    floor: new Image(),
    enemy: new Image(),
    wall: new Image(),
    sword: new Image(),
    potion: new Image(),
    person: new Image(),
};

textures.floor.src = 'images/tile-.png';
textures.enemy.src = 'images/tile-E.png';
textures.wall.src = 'images/tile-W.png';
textures.sword.src = 'images/tile-SW.png';
textures.potion.src = 'images/tile-HP.png';
textures.person.src = 'images/tile-P.png';
Promise.all([
    new Promise(resolve => {
        textures.floor.onload = resolve;
    }),
    new Promise(resolve => {
        textures.enemy.onload = resolve;
    }),
    new Promise(resolve => {
        textures.wall.onload = resolve;
    }),
    new Promise(resolve => {
        textures.sword.onload = resolve;
    }),
    new Promise(resolve => {
        textures.potion.onload = resolve;
    }),
    new Promise(resolve => {
        textures.person.onload = resolve;
    }),
]).then(() => {
    // renderMap(game.mapOfGame);
    gameLoop();


})


document.addEventListener('keydown', (e) => {
    let newX = person.x;
    let newY = person.y;

    switch (e.key){
        case "w":
            newY--;
            break;
        case "s":
            newY++;
            break;
        case "a":
            newX--;
            break;
        case "d":
            newX++;
            break;
    }



    let enemyIndex = -1;
    for (let i = 0; i < enemys; i++) {
        if(enemys[i].x === newX && enemys[i].y === newY) {
            enemyIndex = i;
            break;
        }
    }

    if(enemyIndex !== -1){
        enemys[enemyIndex].health -= person.attack;

    }else if(isCellFree(newX,newY)){
        person.x = newX;
        person.y = newY;

        moveEnemys()
    }




})
