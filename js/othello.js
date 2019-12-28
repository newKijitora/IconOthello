/******************** グローバル変数 ********************/

var i;
var player; // 自分のプレイヤー番号
var opponent; // 相手のプレイヤー番号
var squares = []; // マス目と石を描画する<canvas>要素の配列
var stone_array = []; // 描画用の石の配列
var check_array = []; // 検索用の石の配列
for (i = 0; i < 64; stone_array[i++] = 0); // 描画用の石の配列の初期化
for (i = 0; i < 64; check_array[i++] = 0); // 検索用の石の配列の初期化
var stones = 4; // 石の総数
var pass_stone = 0; // パスの数
var score = 0; // ゲーム終了時の自分の石の数
var reader; // 盤面の読み込みタイマーID
/* テキストを準備 */
var text = {
  A : 'あなたの番です。',
  B : '相手の番です。',
  C : '勝ちました！',
  D : '負けました！',
  E : '引き分けです！'
}
/* 石をはさむメソッド用引数のセット */
var between_property = {
  between_right : '8 - mystone % 8,100,1,1,1', // 右検索用の引数セット
  between_left : 'mystone % 8 + 1,100,-1,-1,-1', // 左検索用の引数セット
  between_bottom : '(8 - mystone / 8) * 8,100,8,8,8', // 下検索用の引数セット
  between_top : '(mystone / 8 + 1) * 8,100,-8,-8,-8', // 上検索用の引数セット
  between_right_bottom : '(8 - mystone % 8) * 9,(8 - mystone / 8) * 9,9,9,9', // 右下検索用の引数セット
  between_right_top : '(8 - mystone % 8) * 7,(mystone / 8 + 1) * 7,-7,-7,-7', // 右上検索用の引数セット
  between_left_bottom : '(mystone % 8 + 1) * 7,(8 - mystone / 8) * 7,7,7,7', // 左下検索用の引数セット
  between_left_top : '(mystone % 8 + 1) * 9,(mystone / 8 + 1) * 9,-9,-9,-9' // 左上検索用の引数セット
}

/********************* ゲームを構成する関数 ********************/

// プレイに参加する順番でプレイヤーを設定
function createPlayer() {
  var result = document.getElementById('result');
  var request;
  request = getXHR(); // ユーティリティ関数
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      player = parseInt(request.responseText);
      opponent = player == 1 ? 2 : 1;
      stone_array[28] = 1;
      stone_array[35] = 1;
      stone_array[27] = 2;
      stone_array[36] = 2;
      result.innerHTML = player == 1 ? text['A'] : text['B'];
      checkArray();
    }
  };
  request.open('POST', 'php/player.php', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf8');
  request.send('request=order');
}
// 盤面を生成する
function createBoard() {
  var board;
  var i;
  board = document.getElementById('board');
  for (i = 0; i < 64; i++) {
    squares[i] = document.createElement('canvas');
    squares[i].setAttribute('class', 'square');
    squares[i].setAttribute('id', 'square' + i);
    squares[i].setAttribute('width', '68');
    squares[i].setAttribute('height', '68');
    squares[i].setAttribute('onclick', 'putStone(this)');
    board.appendChild(squares[i]);
  }
}
// クリックで石を置く
function putStone(obj) {
  if (stones % 2 == (player - 1)) {
    var stone_number;
    var check = [];
    var i = 0;
    var check_stone = false;
    stone_number = parseInt(obj.getAttribute('id').slice(6));
    if (stone_array[stone_number] == 0)
      stone_array[stone_number] = player;
    else
      return false;
    for (var prop in between_property) {
      check[i] = betweenStone(stone_number, between_property[prop]);
      i++;
    }
    for (i = 0; i < check.length; i++) {
      if (check[i] == true) {
        check_stone = true;
        break;
      }
    }
    if (check_stone == true) {
      stones++;
      checkArray(obj);
    }
  }
}
// 石が置ける場所の判定、はさんだ石の数などの検索に使用する関数
function betweenStone(mystone, between_prop) {
  var between_array = [];
  between_array = between_prop.split(','); // 引数セットを配列に分解
  var n = eval(between_array[0]);
  var m = eval(between_array[1]);
  var i = parseInt(between_array[2]), j = parseInt(between_array[3]), c = parseInt(between_array[4]);
  if (n > m) n = m;
  for (i; Math.abs(i) < Math.abs(n); i += c) {
    if (stone_array[mystone + i] == 0) return false;
    if (stone_array[mystone + i] == opponent) continue;
    if (stone_array[mystone + i] == player) {
      if (i == c) return false;
      for (j; Math.abs(j) < Math.abs(i); j += c) {
        stone_array[mystone + j] = player;
      }
      return true;
    }
  }
}
// 盤面の変化をチェック
function checkArray() {
  var i;
  for (i = 0; i < stone_array.length; i++) {
    check_array[i] = stone_array[i] == check_array[i] ? 0 : stone_array[i];
  }
  sendArray();
}
// 盤面の変化をサーバに送信
function sendArray(obj) {
  var request;
  var i;
  request = getXHR();
  request.open('POST', 'php/player.php', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf8');
  request.send('request=send' + '&stone_array=' + encodeURIComponent(stone_array) + '&check_array=' + encodeURIComponent(check_array) + '&stones=' + encodeURIComponent(stones) + '&pass_stone=' + encodeURIComponent(pass_stone));
}
// 盤面の変化をサーバから読み込み
function readArray() {
  var request;
  var response_array = [];
  var i;
  request = getXHR();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      response_array = request.responseText.split('/');
      stone_array = response_array[0].split(',');
      check_array = response_array[1].split(',');
      stones = parseInt(response_array[2]);
      pass_stone = parseInt(response_array[3]);
      drawStone();
      if (player == 1) result.innerHTML = (stones - pass_stone) % 2 == 0 ? text['A'] : text['B'];
      if (player == 2) result.innerHTML = (stones - pass_stone) % 2 == 1 ? text['A'] : text['B'];
      if ((stones - pass_stone) == 64) {
        window.setTimeout(function() {
          for (i = 0; i < stone_array.length; i++) {
            if (stone_array[i] == player) score++;
          }
          if (score == 32) result.innerHTML = text['E'];
          else
            result.innerHTML = (score > 32) ? text['C'] : text['D'];
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
function drawStone() {
  var i;
  for (i = 0; i < check_array.length; i++) {
    if (check_array[i] != 0) {
      prepareStone(squares[i], check_array[i]);
      if (check_array[i] == 3) {
        stone_array[i] = 0;
      }
    }
  }
}
// 石の描画用の関数
function prepareStone(obj, check) {
  var context;
  context = obj.getContext('2d');
  with(context) {
    clearRect(0, 0, 68, 68);
    if (check != 3) {
      beginPath();
      fillStyle = check == 1 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
      arc(34, 34, 28, 0, Math.PI * 2, true);
      fill();
    }
  }
}
// 自分の番手をパス
function passStone() {
  stones++;
  pass_stone++;
  sendArray();
}
// ゲームをリセット
function resetGame() {
  if (!reader) {
    reader = window.setInterval(function() {
      readArray();
    }, 100);
  }
  var i;
  for (i = 0; i < stone_array.length; stone_array[i++] = 3);
  stone_array[28] = 1;
  stone_array[35] = 1;
  stone_array[27] = 2;
  stone_array[36] = 2;
  stones = 4;
  score = 0;
  checkArray();
}

/******************** ドキュメント読み込み時のイベントハンドラ ********************/

window.onload = function() {
  createPlayer(); // プレイヤーを生成する
  createBoard(); // 盤面を生成する
  reader = window.setInterval(function() {
    readArray(); // 盤面の変化を定期的に検査する
  }, 100);
};
