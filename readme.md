<div align="center">
<samp>

# ADA2nd 課題

💜  No.01  じゃんけん 💜

</samp>
</div>



### 1.プロダクト名

「みせろぐ」

### 2.課題内容（どんな作品？）

- SNSなどでみつけたいい感じのお店のURLをストックしておき、必要な時に取り出せるようにするためのLINEbot。ブックマークは増えていくのに集めた情報を一生活用できない問題を解決します！
- GASとMessaging APIを使用し、スプレッドシートをDB代わりとしています。

### 3.DEMO

LINE公式アカウントでおともだち登録してください
- Bot ID:  @409smhit <br>
<img width="120" alt="MiseLog-logo" src="https://github.com/user-attachments/assets/b288f1b3-c9b0-4b6a-bd12-27925ddc3ad5" width="300">
<img width="120" alt="MiseLog-QR" src="https://github.com/user-attachments/assets/eb29ccf0-7775-41eb-bd4f-04e6cd7d632b" width="300">

### 4.作ったアプリケーション用のIDまたはPasswordがある場合

- なし

### 5.工夫した点・こだわった点

- LINEbotでは、受信したメッセージによって応答の出しわけをしていくため、分岐処理が要となります。LINEの応答トークンの使用時間制限（1分以内）やGASの実行時間制限（1つにつき最大6分）にかかるとエラーが出てしまうため、いかに簡単な処理で終わらせるか、分岐の整理やユーザーメッセージの引き出し方を工夫しました。
- GASをローカルで開発するため、claspを使用しています（実はDEVの卒制でも使用しました）。

### 6.難しかった点・次回トライしたいこと(又は機能)

- 5に記載のとおり、分岐の整理や時間制限による処理落ちとの戦いに苦心しました。。と思いきや、意外と定数や変数の定義漏れや表記ブレ、数字かテキストかの違いなど基本的なことが動かない直接の原因だったようです。
- 登録時の入力方法や、結果のカルーセル表示など、もう少し改善する予定です。
- 次回は、本当は今回トライしたかったNode.jsとDBを使ってみたい。

### 7.次回ミニ講義で聞きたいこと

- 複雑な条件分岐の整理のコツなど

### 8.フリー項目（感想、シェアしたいこと等なんでも）
- 感想
  - GASのプロジェクト履歴が確認しやすくなっていた！

- Miro
  - 分岐の流れを整理しました[(URL)](https://miro.com/app/board/uXjVKshQe7I=/)<br>
  <img width="500" alt="分岐の流れ" src="https://github.com/user-attachments/assets/f99a7ec1-2dff-4fbb-a486-5d12ffacc965">
  
- 参考記事
  - ローカルでGASの開発を可能にするCLIツールclaspを使ってみた[（URL）](https://qiita.com/zumi0/items/a4dd6e00cad7ee341d77)
  - その他思い出したら追加します
  