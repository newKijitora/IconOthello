/* 盤面クラス */

class Board {
  // コンストラクタ
  constructor(player) {
    // 使用する定数
    this.squareLength = 64;
    this.squareWidth = 68;
    this.squareHeight = 68;
    
    this.player = player;

    this.stones = 4; // 石の総数
    this.passStone = 0; // パスの数

    // 描画用の石の配列と初期化
    this.stoneArray = [];
    for (let i = 0; i < this.squareLength; this.stoneArray[i++] = 0);

    // 描画用の石の配列と初期化
    this.checkArray = [];
    for (let i = 0; i < this.squareLength; this.checkArray[i++] = 0);

    // マス目の配列の初期化
    this.squares = [];
    for (let i = 0; i < this.squareLength; this.squares[i++] = undefined);

    // 盤面用の要素を取得
    this.element = document.getElementById("board");
    
    // 盤面の生成
    this.createBoard();

    // 石をはさむメソッド用引数のセット
  this.between_property = {
    between_right : '8 - mystone % 8,100,1,1,1', // 右検索用の引数セット
    between_left : 'mystone % 8 + 1,100,-1,-1,-1', // 左検索用の引数セット
    between_bottom : '(8 - mystone / 8) * 8,100,8,8,8', // 下検索用の引数セット
    between_top : '(mystone / 8 + 1) * 8,100,-8,-8,-8', // 上検索用の引数セット
    between_right_bottom : '(8 - mystone % 8) * 9,(8 - mystone / 8) * 9,9,9,9', // 右下検索用の引数セット
    between_right_top : '(8 - mystone % 8) * 7,(mystone / 8 + 1) * 7,-7,-7,-7', // 右上検索用の引数セット
    between_left_bottom : '(mystone % 8 + 1) * 7,(8 - mystone / 8) * 7,7,7,7', // 左下検索用の引数セット
    between_left_top : '(mystone % 8 + 1) * 9,(mystone / 8 + 1) * 9,-9,-9,-9' // 左上検索用の引数セット
  }

  }

  // 盤面を生成する
  createBoard() {
    // マス目の生成
    for (let i = 0; i < this.squareLength; i++) {
      // canvas要素の取得
      this.squares[i] = document.createElement("canvas");
      // 幅と高さを設定
      this.squares[i].width = this.squareWidth;
      this.squares[i].height = this.squareHeight;
      
      this.squares[i].setAttribute("class", "square");
      this.squares[i].setAttribute("id", "square" + i);
      
      const _this = this;
      this.squares[i].addEventListener("click", function() {
          _this.putStone(this)
      });
    
      board.appendChild(this.squares[i]);
    }
  }

  // 盤面の変化をサーバに送信
  sendArray() {
    const request = getXHR();
    request.open("POST", "php/player.php", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf8");
    request.send("request=send" +
      "&stone_array=" + encodeURIComponent(this.stoneArray) +
      "&check_array=" + encodeURIComponent(this.checkArray) +
      "&stones=" + encodeURIComponent(this.stones) +
      "&pass_stone=" + encodeURIComponent(this.passStone));
  }

  // 盤面の変化をサーバから読み込み
  readArray() {
    var response_array = [];
    const request = getXHR();
    const _this = this;
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        response_array = request.responseText.split('/');
        _this.stoneArray = response_array[0].split(',');
        _this.checkArray = response_array[1].split(',');
        _this.stones = parseInt(response_array[2]);
        _this.passStone = parseInt(response_array[3]);
        


        // 石を描画
        _this.drawStone();

        
        switch (_this.player.playerNumber) {
          case 1:
            result.innerHTML = (_this.stones - _this.passStone) % 2 == 0 ? text['A'] : text['B'];
            break;
          case 2:
            result.innerHTML = (_this.stones - _this.passStone) % 2 == 1 ? text['A'] : text['B'];
            break;
        }

        if ((_this.stones - _this.passStone) == 64) {
          window.setTimeout(function() {
            for (let i = 0; i < _this.stoneArray.length; i++) {
              if (_this.stoneArray[i] == _this.player.playerNumber) {
                _this.player.score++;
              }
            }

            if (_this.player.score == 32) {
              result.innerHTML = text['E'];
            } else {
              result.innerHTML = (_this.player.score > 32) ? text['C'] : text['D'];
            }

            // 処理を停止
            window.clearInterval(reader);
          }, 200);
        }
      }
    };

    request.open('POST', 'php/player.php', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf8');
    request.send('request=read');
  }
  
  // 変化した盤面を検索して石を描画
  drawStone() {
    for (let i = 0; i < this.checkArray.length; i++) {
      if (this.checkArray[i] != 0) {
        this.prepareStone(this.squares[i], this.checkArray[i]);
        if (this.checkArray[i] == 3) {
          this.stoneArray[i] = 0;
        }
      }
    }
  }

  // 石の描画用の関数
  prepareStone(canvas, check) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 68, 68);
    if (check != 3) {
      context.beginPath();
      context.fillStyle = check == 1 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
      context.arc(34, 34, 28, 0, Math.PI * 2, true);
      context.fill();
    }
  }
  
  // 石を置く
  putStone(obj) {
    if (this.stones % 2 == (this.player.playerNumber - 1)) {
      var stone_number;
      var check = [];
      var check_stone = false;
      stone_number = parseInt(obj.getAttribute('id').slice(6));
      
      if (this.stoneArray[stone_number] == 0) {
        this.stoneArray[stone_number] = this.player.playerNumber;
      } else {
        return false;
      }

      let i = 0;
      for (var prop in this.between_property) {
        check[i] = this.betweenStone(stone_number, this.between_property[prop]);
        i++;
      }

      for (let i = 0; i < check.length; i++) {
        if (check[i] == true) {
          check_stone = true;
          break;
        }
      }

      if (check_stone == true) {
        this.stones++;
        this.searchArray(obj);
      }
    }
  }

  
  // 石が置ける場所の判定、はさんだ石の数などの検索に使用する関数
  betweenStone(mystone, between_prop) {
    var between_array = [];
    between_array = between_prop.split(','); // 引数セットを配列に分解
    
    var n = eval(between_array[0]);
    var m = eval(between_array[1]);
    
    var i = parseInt(between_array[2]), j = parseInt(between_array[3]), c = parseInt(between_array[4]);
    if (n > m) n = m;
    
    for (i; Math.abs(i) < Math.abs(n); i += c) {
      if (this.stoneArray[mystone + i] == 0) return false;
      if (this.stoneArray[mystone + i] == this.player.opponentNumber) continue;
      if (this.stoneArray[mystone + i] == this.player.playerNumber) {
       if (i == c) return false;
        for (j; Math.abs(j) < Math.abs(i); j += c) {
          this.stoneArray[mystone + j] = this.player.playerNumber;
        }
        return true;
      }
    }
  }

  // 盤面の変化をチェックしてサーバーに送信する
  searchArray() {
    // 盤面の変化を検索
    for (let i = 0; i < this.stoneArray.length; i++) {
      this.checkArray[i] = this.stoneArray[i] == this.checkArray[i] ? 0 : this.stoneArray[i];
    }

    // サーバーに盤面を送信
    this.sendArray();
  }
}
