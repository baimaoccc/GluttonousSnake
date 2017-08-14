

function Map() {
    this.width = 700;
    this.height = 500;
    this._map = null;

    this.show = function () {
        this._map = document.createElement('div');
        $(this._map).css({
            'width': this.width + 'px',
            'height': this.height + 'px'
        });
        $(this._map).addClass('map');
        $('body').append($(this._map));
    }
}

function Food() {
    this.width = 20;
    this.height = 20;
    this.x = 0;
    this.y = 0;
    this._food = null;

    this.show = function () {
        if (this._food == null) {
            this._food = document.createElement('div');
            $(this._food).css({
                'width': this.width + 'px',
                'height': this.height + 'px'
            });
            $(this._food).addClass('food');
            $('.map').append($(this._food));
        }
        this.x = Math.floor(Math.random() * 35);
        this.y = Math.floor(Math.random() * 25);


        var isSnakeBody = this.checkFood();
        while (isSnakeBody) {
            if (this.checkFood()) {
                this.x = Math.floor(Math.random() * 35);
                this.y = Math.floor(Math.random() * 25);
            }
            isSnakeBody = this.checkFood()
        }
        ;

        $(this._food).css({
            'left': this.x * this.width + 'px',
            'top': this.y * this.height + 'px'
        });
    }

    //TODO:遍历蛇的数组，如果与蛇的数组相同就重新取位置，保证每次随机的食物位置不与蛇重复
    this.checkFood = function () {
        for (var i = 0; i < snake.bodyArr.length; i++) {
            if (this.x == snake.bodyArr[i][0] && this.y == snake.bodyArr[i][1]) {
                return true;
            }
        }
        return false;
    }
}


var flag = true;
function Snake() {
    this.width = 20;
    this.height = 20;
    this.direction = '';

    this.bodyArr = [[3, 2, null], [2, 2, null], [1, 2, null]];

    this.setDirect = function (code) {
        switch (code) {
            case 37:
                this.direction = 'left';
                break;
            case 38:
                this.direction = 'up';
                break;
            case 39:
                this.direction = 'right';
                break;
            case 40:
                this.direction = 'down';
                break;
            case 32:
                //暂停

                console.log(flag);
                if (flag) {
                    clearInterval(timer);
                    document.querySelector('audio').pause();
                    flag = false;
                } else {
                    timer = setInterval(snake.move.bind(snake),game.speed);
                    document.querySelector('audio').play();
                    flag = true;
                }

        }
    };
    this.show = function () {
        //遍历蛇的数组
        for (var i = 0; i < this.bodyArr.length; i++) {
            if (this.bodyArr[i][2] == null) {
                this.bodyArr[i][2] = document.createElement('div');
                $(this.bodyArr[i][2]).css({
                    'width': this.width + 'px',
                    'height': this.height + 'px',
                });
                $('.map').append(this.bodyArr[i][2]);
            }
            if (i == 0) {
                $(this.bodyArr[i][2]).addClass('snake_head');
            } else {
                $(this.bodyArr[i][2]).addClass('snake_body');
            }
            $(this.bodyArr[i][2]).css({
                'left': this.bodyArr[i][0] * this.width + 'px',
                'top': this.bodyArr[i][1] * this.height + 'px'
            });
        }
    }

    this.move = function () {
        var temp = [];
        var firstUnitX = this.bodyArr[0][0];
        var firstUnitY = this.bodyArr[0][1];
        temp.push(firstUnitX);
        temp.push(firstUnitY);

        switch (this.direction) {
            case 'right': {
                temp[0] = temp[0] + 1;
            }
                break;
            case 'left': {
                temp[0] = temp[0] - 1;
            }
                break;
            case 'up': {
                temp[1] = temp[1] - 1;
            }
                break;
            case 'down': {
                temp[1] = temp[1] + 1;
            }
                break;
            default: {
                return;
            }
        }
        var pop = this.bodyArr.pop();
        $(pop[2]).remove();
        this.bodyArr.unshift(temp);


        // 判断蛇迟到食物
        if (this.bodyArr[0][0] == food.x && this.bodyArr[0][1] == food.y) {
            var x = this.bodyArr[this.bodyArr.length - 1][0];
            var y = this.bodyArr[this.bodyArr.length - 1][1];
            this.bodyArr.push([x, y, null]);
            sum++;
            game.checkLevel();
            $('#game_score').text(sum);
            $('#game_level').text(game.level);


            food.show();
        }

        // 判断撞墙死
        if (this.bodyArr[0][0] < 0 || this.bodyArr[0][0] > 34 ||
            this.bodyArr[0][1] < 0 || this.bodyArr[0][1] > 24) {
            alert('撞墙死');
            clearInterval(timer);
            return;
        }

        // 判断撞自身死
        for (var i = 1; i < this.bodyArr.length; i++) {
            if (this.bodyArr[0][0] == this.bodyArr[i][0] && this.bodyArr[0][1] == this.bodyArr[i][1]) {
                alert('吃到自己死');
                clearInterval(timer);
                return;
            }
        }

        this.show();
    }
}

function Game(level, speed) {
    this.level = level;
    this.speed = speed;
}
Game.prototype.initGame = function (speed) {
    map = new Map();    //实例化地图类对象
    map.show();         //显示地图

    snake = new Snake(); //实例化蛇类对象
    snake.show();


    food = new Food();  //实例化食物类对象
    food.show();        //显示食物

    timer = setInterval(snake.move.bind(snake), this.speed);

    document.onkeydown = function () {
        var code;
        if (window.event) {
            code = window.event.keyCode;
        } else {
            code = event.keyCode;
        }
        snake.setDirect(code);
    };
}

Game.prototype.checkLevel = function () {
    var levelObj = {
        1: {
            score: 10,
            speed: 300
        },
        2: {
            score: 20,
            speed: 200
        },
        3: {
            score: 30,
            speed: 100
        },
        4: {
            score: 50,
            speed: 50
        }
    }
    if (sum >= levelObj[this.level].score) {
        $('section').css('animation', 'lightning 1s');

        this.level++;
        this.speed = levelObj[this.level].speed;
        clearInterval(timer);
        timer = setInterval(snake.move.bind(snake), this.speed);
    }
}


