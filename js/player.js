/* プレイヤークラス */

class Player {
  // コンストラクタ
  constructor(playerNumber, opponentNumber) {
    // 自分と相手の番号
    this.playerNumber = playerNumber;
    this.opponentNumber = opponentNumber;

    // ゲーム終了時の自分の石の数
    this.score = 0;
  }
}
