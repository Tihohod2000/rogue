const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");

const MAP_WIDTH = 40;
const MAP_HEIGHT = 24;

const cellWidth = canvas.width / 40;
const cellHeight = canvas.height / 24;

const COUNT_OF_ROOMS = [5, 10];
const SIZE_OF_ROOM = [3, 8];

const COUNT_OF_HOLLWAYS = [3, 5];

const COUNT_OF_ENEMY = 10;
const COUNT_OF_POTION = 10;
const COUNT_OF_SWORD = 2;

const radiuse = [
    {dx: 0, dy: -1}, // вверх
    {dx: 1, dy: 0},  // вправо
    {dx: 0, dy: 1},  // вниз
    {dx: -1, dy: 0},  // влево
];

let enemys = [];
let potions = [];
let swords = [];

let person;

let map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH).fill().map(() => 1));

generateHallways()
generateRooms()
generatePerson()
generateItem()
generateEnemy()


function generateItem() {

    for (let i = 0; i < COUNT_OF_POTION; i++) {
        let position = randomPosition();
        potions.push({
            x: position.x,
            y: position.y,
            type: "health"
        });
    }

    for (let i = 0; i < COUNT_OF_SWORD; i++) {
        let position = randomPosition();
        swords.push({
            x: position.x,
            y: position.y,
            type: "attach"
        });
    }
}


function generatePerson() {

    let x, y;
    do {
        x = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
        y = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
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
        x = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
        y = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
    } while (map[y][x] !== 0 || (x === person.x && y === person.y));

    return {x, y};
}

function generateEnemy() {

    for (let i = 0; i < COUNT_OF_ENEMY; i++) {

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
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
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
    let randomCountOfHallwaysHorizontally = randomCountFromInterval(COUNT_OF_HOLLWAYS);
    let randomCountOfHallwaysVertically = randomCountFromInterval(COUNT_OF_HOLLWAYS);
    //Добавление горизонтальных коридоров
    for (let i = 0; i < randomCountOfHallwaysHorizontally; i++) {
        let y = Math.floor(Math.random() * (MAP_HEIGHT - 1) + 1);
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
        let x = Math.floor(Math.random() * (MAP_WIDTH - 1) + 1);
        let structure = map[0][x];
        if (structure === 0) {
            i--;
        } else if (x < map[0].length) {
            map.map((row) => row[x] = 0)
        } else {
            i--;
        }
    }
}

function randomCountFromInterval(interval) {
    return Math.floor(Math.random() * (interval[1] - interval[0] + 1)) + interval[0];
}

function generateRooms() {
    let randomCountOfRooms = randomCountFromInterval(COUNT_OF_ROOMS);

    for (let i = 0; i < randomCountOfRooms; i++) {
        let startX = Math.floor(Math.random() * MAP_WIDTH + 1);
        let startY = Math.floor(Math.random() * MAP_HEIGHT + 1);


        let randomSizeWidthOfRooms = randomCountFromInterval(SIZE_OF_ROOM);
        let randomSizeHeightOfRooms = randomCountFromInterval(SIZE_OF_ROOM);

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

            //Вычисляем отступ чтобы в следующем for-цикле проверять только периметр комнаты
            if (y === startY || y === startY + randomSizeHeightOfRooms - 1) {
                border = 1;
            } else {
                border = startX + randomSizeWidthOfRooms - 1;
            }


            //Проверяем что клетка комнаты доступна (является проходом в комнату)
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



//Отрисовка картинки объекта(враг, персонаж, меч, зелье)
function draw(img, obj) {
    ctx.drawImage(
        img,
        obj.x * cellWidth,
        obj.y * cellHeight,
        cellWidth,
        cellHeight
    )
}

// Отрисовка карты
function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
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
        draw(img, sword);
    })
}

function drawPotions() {
    let img = textures.potion;
    potions.forEach(potion => {
        draw(img, potion);
    })
}

function drawPerson() {
    let img = textures.person;
    draw(img, person);
    drawHealth(person, 'rgb(27,248,27)')
}

function drawHealth(obj, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(obj.x * cellWidth, obj.y * cellHeight);
    ctx.lineTo(obj.x * cellWidth + ((cellWidth * obj.health) / 100), obj.y * cellHeight)
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawEnemys() {
    let img = textures.enemy;
    enemys.forEach(enemy => {
        draw(img, enemy)
        drawHealth(enemy, 'rgb(255,0,0)');
    })
}

function chekAttakRadiuse(from, to) {
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
        const directions = radiuse;

        //Движение противников
        let bestDirections = null;
        let bestDistance = Infinity;
        let AllDirections = [];

        for (let dir of directions) {
            const newX = enemy.x + dir.dx;
            const newY = enemy.y + dir.dy;

            if (isCellFree(newX, newY) || (newX !== person.x && newY !== person.y)) {
                const dist = Math.pow(newX - person.x, 2) + Math.pow(newY - person.y, 2)
                if (dist < bestDistance) {
                    AllDirections.push(dir);
                    bestDistance = dist
                    bestDirections = dir
                }
            }
        }

        if (chekAttakRadiuse(enemy, person)) {
            person.health -= enemy.attack;
            console.log(person.health);
        } else {
            for (let i = AllDirections.length - 1; i >= 0; i--) {
                const nx = enemy.x + AllDirections[i].dx;
                const ny = enemy.y + AllDirections[i].dy;
                if (isCellFree(nx, ny)) {
                    enemy.x = nx;
                    enemy.y = ny;
                    break;
                }
            }
        }
    })

    enemys = enemys.filter(e => e.health > 0);
}

function reloadGame() {
    let exitGame = confirm("Хотите начать заново?");

    if (exitGame) {
        document.location.reload();
    }
}

function gameLoop() {

    // Очистка экрана
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (person.health <= 0) {
        alert("Вы погибли")
        reloadGame();
        return;
    }

    if (enemys.length <= 0) {
        alert("Вы уничтожили всех врагов")
        reloadGame();
        return;
    }

    // Отрисовка
    drawMap();
    drawSwords();
    drawPotions();
    drawEnemys();
    drawPerson();

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
    gameLoop();
})


document.addEventListener('keydown', (e) => {
    let newX = person.x;
    let newY = person.y;

    let key = e.key.toLowerCase();

    switch (key) {
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
        case "ц":
            newY--;
            break;
        case "ы":
            newY++;
            break;
        case "ф":
            newX--;
            break;
        case "в":
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
            if (
                potions[i].x === person.x &&
                potions[i].y === person.y
            ) {
                person.health += 30;
                if (person.health > 100) person.health = 100;
                potions.splice(i, 1);
            }
        }
        for (let i = 0; i < swords.length; i++) {
            if (
                swords[i].x === person.x &&
                swords[i].y === person.y
            ) {
                person.attack += 30;
                swords.splice(i, 1);
            }
        }
    }

    moveEnemys();

})