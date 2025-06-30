const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");

const mapWidth = 40;
const mapHeight = 24;

const cellSize = 20;
const cellWidth = canvas.width / 40;
const cellHeight = canvas.height / 24;

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

function randomPosition() {
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
            health: 100,
            attack: 3,
        });


    }
    console.log(enemys);

}

function isCellFree(x, y) {
    if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return false;
    if (map[y][x] === 1) return false;

    // Проверка
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
        while (startX + randomSizeWidthOfRooms > map[0].length - 1) {
            startX--;
        }
        while (startY + randomSizeHeightOfRooms > map.length - 1) {
            startY--;
        }

        //Сделать проверку что комната будет доступной
        let roomReachability = false;

        let border;

        exitLoopPoint: for (let y = startY; y < (startY + randomSizeHeightOfRooms); y++) {
            if (y === startY || y === startY + randomSizeHeightOfRooms - 1) {
                border = 1;
            } else {
                border = startX + randomSizeWidthOfRooms - 1;
            }

            for (let x = startX; x < (startX + randomSizeWidthOfRooms - 1); x += border) {

                if (
                    map[y + 1][x] !== 1 ||
                    map[y][x + 1] !== 1 ||
                    map[y - 1][x] !== 1 ||
                    map[y][x - 1] !== 1
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
                x * cellWidth,
                y * cellHeight,
                cellWidth,
                cellHeight
            )
        }
    }
}

function drawSwords() {
    let img = textures.sword;
    swords.forEach(sword => {
        ctx.drawImage(
            img,
            sword.x * cellWidth,
            sword.y * cellHeight,
            cellWidth,
            cellHeight
        )
    })
}

function drawPotions() {
    let img = textures.potion;
    potions.forEach(potion => {
        ctx.drawImage(
            img,
            potion.x * cellWidth,
            potion.y * cellHeight,
            cellWidth,
            cellHeight
        )
    })
}

function drawPerson() {
    let img = textures.person;

    ctx.drawImage(
        img,
        person.x * cellWidth,
        person.y * cellHeight,
        cellWidth,
        cellHeight
    );

    ctx.strokeStyle = 'rgb(27,248,27)';
    ctx.beginPath();
    ctx.moveTo(person.x * cellWidth, person.y * cellHeight);
    ctx.lineTo(person.x * cellWidth + ((cellWidth * person.health) / 100), person.y * cellHeight)
    ctx.lineWidth = 3;
    ctx.stroke();
}

//Отрисовка монстров
function drawEnemys() {
    let img = textures.enemy;
    enemys.forEach(enemy => {
        ctx.drawImage(
            img,
            enemy.x * cellWidth,
            enemy.y * cellHeight,
            cellWidth,
            cellHeight
        );

        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(enemy.x * cellWidth, enemy.y * cellHeight);
        ctx.lineTo(enemy.x * cellWidth + ((cellWidth * enemy.health) / 100), enemy.y * cellHeight)
        ctx.lineWidth = 3;
        ctx.stroke();


    })
}

function chekAttakRadiuse(from, to) {
    const radiuse = [
        {dx: 0, dy: -1}, // вверх
        {dx: 1, dy: 0},  // вправо
        {dx: 0, dy: 1},  // вниз
        {dx: -1, dy: 0},  // влево
        // { dx: 1, dy: -1 },  // вверх-вправо
        // { dx: 1, dy: 1 },  // вниз-вправо
        // { dx: -1, dy: 1 },  // вниз-влево
        // { dx: -1, dy: -1 }  // вверх-влево
    ];


    let attack = false;

    for (let rad of radiuse) {
        const newX = from.x + rad.dx;
        const newY = from.y + rad.dy;


        if (newX === to.x && newY === to.y) {
            attack = true;
        }
    }

    return attack;
}

function moveEnemys() {
    enemys.forEach(enemy => {
        const directions = [
            {dx: 0, dy: -1}, // вверх
            {dx: 1, dy: 0},  // вправо
            {dx: 0, dy: 1},  // вниз
            {dx: -1, dy: 0},  // влево
        ];


        //Движение противников
        let bestDirections = null;
        let bestDistance = Infinity;
        let sortedDirections = [];

        for (let dir of directions) {
            const newX = enemy.x + dir.dx;
            const newY = enemy.y + dir.dy;

            // if(newX === person.x && newY === person.y) {
            //     bestDirections = null;
            //     bestDistance = Infinity;
            //     break;
            // }

            if (isCellFree(newX, newY) || (newX !== person.x && newY !== person.y)) {
                const dist = Math.pow(newX - person.x, 2) + Math.pow(newY - person.y, 2)
                if (dist < bestDistance) {
                    sortedDirections.push(dir);
                    bestDistance = dist
                    bestDirections = dir
                }
            }
        }

        // sortedDirections = sortedDirections.sort((a, b) => b - a);


        if (chekAttakRadiuse(enemy, person)) {
            person.health -= enemy.attack;
            console.log(person.health);
        } else {
            for (let i = sortedDirections.length - 1; i >= 0; i--) {
                const nx = enemy.x + sortedDirections[i].dx;
                const ny = enemy.y + sortedDirections[i].dy;
                if (isCellFree(nx, ny)) {
                    enemy.x = nx;
                    enemy.y = ny;
                    break;
                }
            }
            // enemy.x = nx;
            // enemy.y = ny;
        }


    })

    enemys = enemys.filter(e => e.health > 0);
}

function gameLoop() {
    // Очистка экрана
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (person.health <= 0) {
        alert("Вы погибли")
        return;
    }

    if(enemys.length <= 0) {
        alert("Вы уничтожили всех врагов")
        return;
    }

    // Отрисовка
    drawMap();
    drawSwords();
    drawPotions();
    drawEnemys();
    drawPerson();
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

    switch (e.key) {
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
        case " ":
            for (let i = 0; i < enemys.length; i++) {
                if (chekAttakRadiuse(person, enemys[i])) {
                    enemys[i].health -= person.attack;
                }
            }
            break;
    }


    if (isCellFree(newX, newY)) {
        person.x = newX;
        person.y = newY;
        for (let i = 0; i < potions.length; i++) {
            if(
                potions[i].x === person.x &&
                potions[i].y === person.y
            ){
                person.health += 30;
                if(person.health > 100) person.health = 100;
                potions.splice(i, 1);
            }
        }
        for (let i = 0; i < swords.length; i++) {
            if(
                swords[i].x === person.x &&
                swords[i].y === person.y
            ){
                person.attack += 30;
                swords.splice(i, 1);
            }
        }
    }

    moveEnemys();


})
