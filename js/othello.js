/* オセロクラス */

class Othello {
  // コンストラクタ
  constructor() {
    

    // プレイヤーと相手の番号
    this.player;
    this.opponent;

    // 盤面
    this.board = undefined;
    
    // タイマー
    this.reader = 0;

    // リセットボタンの用意
    // this.reset = document.getElementById("reset");
    // this.reset.addEventListener("click", function() {
    //   this.resetGame();
    // }, false);

    // パスボタンの用意
    // this.pass = document.getElementById("pass");
    // this.pass.addEventListener("click", function() {
    //   this.passStone();
    // }, false);

    // サーバーへのリクエスト
    this.createPlayer();
  }

  // プレイヤーを生成する
  createPlayer() {
    // XHRオブジェクトの取得
    const request = getXHR();
    const _this = this;

    // コールバック
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        // プレイヤーと相手の設定
        const playerNumber = parseInt(request.responseText);
        const opponentNumber = playerNumber == 1 ? 2 : 1;
        _this.player = new Player(playerNumber, opponentNumber);

        // 盤面の初期化
        _this.board = new Board(_this.player);
        _this.board.stoneArray[28] = 1;
        _this.board.stoneArray[35] = 1;
        _this.board.stoneArray[27] = 2;
        _this.board.stoneArray[36] = 2;
  
        // const result = document.getElementById("result");
        // result.innerHTML = _this.player.playerNumber == 1 ? text['A'] : text['B'];
        
        _this.board.searchArray();

        Othello.reader = window.setInterval(function() {
          _this.board.readArray(); // 盤面の変化を定期的に検査する
        }, 100);
      }
    };
  
    // リクエストの開始
    request.open("POST", "php/player.php", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf8");
    request.send('request=order');
  }

  static reader = undefined;

  // ゲームをリセット
  resetGame() {
    if (!Othello.reader) {
      Othello.reader = window.setInterval(function() {
        this.board.readArray();
      }, 100);
    }
    
    // 盤面を初期化する
    for (let i = 0; i < stone_array.length; stone_array[i++] = 3);
    this.board.stoneArray[28] = 1;
    this.board.stoneArray[35] = 1;
    this.board.stoneArray[27] = 2;
    this.board.stoneArray[36] = 2;
    this.board.stones = 4;
    this.board.player.score = 0;
    
    this.board.checkArray();
  }

  // 自分の番手をパス
  passStone() {
    this.board.stones++;
    this.board.passStone++;
    this.board.sendArray();
  }
}
