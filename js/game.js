var Game = function() {
    //dom 元素
    var gameDiv;
    var nextDiv;

    var timeDiv;
    var scoreDiv;
    var gameoverDiv;
    //保留得分
    var score = 0;

    //游戏矩阵
    // 10*20
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    //当前方块
    var cur;
    //下一个方块
    var next;

    //divs
    var nextDivs = [];
    var gameDivs = [];

    //初始化Div
    var initDiv = function(container, data, divs) {

        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement('div');
                newNode.className = "none";
                newNode.style.top = (i * 20) + 'px';
                newNode.style.left = (j * 20) + 'px';
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    }
    // 刷新div
    var refreshDiv = function(data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = 'none';
                } else if (data[i][j] == 1) {
                    divs[i][j].className = 'done';
                } else if (data[i][j] == 2) {
                    divs[i][j].className = 'current';
                }
            }
        }
    }

    //检测curr的点是否合法  pos  origin  x,y 是data的索引
    // 每次移动是一个
    var check = function(pos, x, y) {
        if (pos.x + x < 0) { //超出了上边界

            return false;
        } else if (pos.x + x >= gameData.length) { //超出了下边界
            return false;
        } else if (pos.y + y < 0) { //超出了左边界
            return false;
        } else if (pos.y + y >= gameData[0].length) { //超出了右边界
            return false;
        } else if (gameData[pos.x + x][pos.y + y] == 1) {
            return false; //这里检测方块是否被固定了。
        } else {
            return true;
        }
    }

    // 清除数据
    var clearData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                //把cur.data的数据拷贝到这里了
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }

            }
        }
    }

    //检测数据是否合法，可以下降 pos 是原点，data是squire中的数据
    var isValid = function(pos, data) {
        console.log('pos', pos);
        console.log('data', data);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    if (!check(pos, i, j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //设置数据
    var setData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                //把cur.data的数据拷贝到这里了
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }

            }
        }
    }
    //下移
    var down = function() {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs);
            return true;
        } else {
            return false;
        }
    }

    //左移
    var left = function() {
        if (cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }

    //右移
    var right = function() {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }

    //旋转
    var rotate = function() {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }
    // 方块移动到底部，给他固定
    var fixed = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                    }
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    }

    //生成下一个方块
    var performNext = function(type, dir) {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    }

    //检测是否要消除这一行了
    var checkClear = function() {
        var line = 0;
        // 检测gameData 从地下往上检测，看那行都是1就消除，然后把上面的往下移动一行
        for (var i = gameData.length - 1; i > 0; i--) {
            var clear = true;
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] != 1) {
                    clear = false;
                    break;
                }
            }
            if (clear) {
                line = line + 1;
                for (var m = i; m > 0; m--) {
                    for (var n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m - 1][n];
                    }
                }
                for (var n = 0; n < gameData[0].length; n++) {
                    gameData[0][n] = 0;
                }
                i++;
            }
        }
        return line;
    }

    // var 检查游戏是否结束
    var checkGameOver = function() {
        var gameOver = false;
        for (var i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] == 1) {
                gameOver = true;
            }
        }
        return gameOver;
    }

    // 游戏用时
    var setTime = function(time) {
        timeDiv.innerHTML = time;
    }

    //得分
    var addScore = function(line) {
        // score
        var s = 0;
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
                default:
                break;
        }
        score = score+s;
        scoreDiv.innerHTML = score;
    }
    // 游戏结束
    var gameover = function(win){
        if(win){
            gameoverDiv.innerHTML = "你赢了";
        }else{
            gameoverDiv.innerHTML = "你输了"
        }
    }

    //增加游戏的难度，如果我连续消除了几行，就可以选择给对方底部添加几行
    var addTailLines = function(lines){
        // 这是把数据往上移动了lines.length行
        for(var i=0; i<gameData.length - lines.length;i++){
            gameData[i] = gameData[i + lines.length];
        }
        // 从底部添加lines.length行
        for(var j=0;j<lines.length; j++){
            gameData[gameData.length - lines.length +j] = lines[j];
        }
        //注意也要把当前活动想的origin向上移动
        cur.origin.x = cur.origin.x - lines.length;
        if(cur.origin.x < 0){
            cur.origin.x = 0;
        }
        refreshDiv(gameData,gameDivs);

    }

    //初始化
    var init = function(doms, type, dir) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        gameoverDiv = doms.gameoverDiv;
        // 这里要修改为随机的
        // cur = SquareFactory.prototype.make(0,0);
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        // setData();
        // console.log('gameData', gameData);
        // refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    }

    //导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = function() {
        while (down());
    }
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.gameover = gameover;
    this.addTailLines = addTailLines;
}