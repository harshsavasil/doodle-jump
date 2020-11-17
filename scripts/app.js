document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let numOfPlatforms = 5;
    let platforms = []; 
    let downTimerId;
    let upTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    class Platform {
        constructor(platformBottom) {
            this.bottom = platformBottom;
            this.left = Math.random() * (grid.offsetWidth - 85);
            this.visual =  document.createElement('div');
            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }
        
    function createPlatforms() {
        for(let index = 0; index < numOfPlatforms; index++) {
            let platformGap = grid.offsetHeight / numOfPlatforms;
            let newPlatformBottom = 100 + index * platformGap;
            let newPlatform = new Platform(newPlatformBottom);
            platforms.push(newPlatform);
        }
        console.log(platforms);
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 100) {
            platforms.forEach((platform) => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    score += 1;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    let newPlatform = new Platform(grid.offsetHeight);
                    platforms.push(newPlatform);
                }
            });
        }
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
            }
        }, 20);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach((platform) => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + doodler.offsetWidth) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('landed');
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            })
        }, 20);
    }

    function gameOver() {
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft();
        } else if (e.key === "ArrowRight") {
            moveRight();
        } else if (e.key === "ArrowUp") {
            moveStraight();
        }

    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        if (!isGoingLeft) {
            isGoingLeft = true;
            leftTimerId = setInterval(() => {
                if (doodlerLeftSpace >= 0) {
                    doodlerLeftSpace -= 10;
                    doodler.style.left = doodlerLeftSpace + 'px';
                } else {
                    doodlerLeftSpace = grid.offsetWidth - doodler.offsetWidth;
                    doodler.style.left = doodlerLeftSpace + 'px';
                }
            }, 30);
        }
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        if (!isGoingRight) {
            isGoingRight = true;
            clearInterval(leftTimerId);
            rightTimerId = setInterval(() => {
                if (doodlerLeftSpace <= grid.offsetWidth - doodler.offsetWidth) {
                    doodlerLeftSpace += 10;
                    doodler.style.left = doodlerLeftSpace + 'px';
                } else {
                    doodlerLeftSpace = 0;
                    doodler.style.left = doodlerLeftSpace + 'px';   
                }
            }, 30);
        }
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function start() {
        if (!isGameOver) {
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 20);
            jump();
            document.addEventListener('keyup', control);
        }
    }

    //TODO: attach to button
    start();
});