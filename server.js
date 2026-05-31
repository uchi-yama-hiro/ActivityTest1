// [Node.js] require()はCommonJS形式のモジュール読み込み構文 — Expressフレームワークを読み込む
const express = require('express');
// [Express] express()を呼び出してExpressアプリケーションのインスタンスを生成する
const app = express();
// [JavaScript] constはブロックスコープの定数を宣言するES6の構文（再代入不可）
// このポート番号でサーバーが接続を待ち受ける
const PORT = 3000;

// [Express] app.use()はミドルウェアを登録するExpressの構文
// [Express] express.json()はリクエストボディをJSON形式で解析するExpressのミドルウェア
app.use(express.json());

// [Express] app.post()はHTTPのPOSTメソッドで'/api/token'へのリクエストを受け取ったときの処理を登録するExpressの構文
// [JavaScript] asyncキーワードを付けることで非同期関数として定義する（内部でawaitが使用可能になる）
// reqはリクエストオブジェクト（クライアントから送られた情報）、resはレスポンスオブジェクト（サーバーから返す情報）
app.post('/api/token', async (req, res) => {
    // [Express] req.bodyはリクエストのボディ部分（送られてきたデータ）にアクセスするExpressの構文
    // .codeはリクエストボディの中のcodeというプロパティを取り出している
    code = req.body.code;
    // [Node.js] console.log()はデバッグ用にコンソールへ文字列と変数を出力するNode.jsの標準構文
    console.log("code:", code);

    // [JavaScript] URLSearchParamsはURLのクエリ文字列を組み立てるためのブラウザ・Node.js組み込みクラス
    // Discord OAuth2 APIに必要なパラメータをオブジェクト形式で渡している
    params = new URLSearchParams({
        // [Node.js] process.env.DISCORD_CLIENT_IDは環境変数DISCORD_CLIENT_IDの値を参照するNode.jsの構文
        client_id: process.env.DISCORD_CLIENT_ID,
        // [Node.js] process.env.DISCORD_CLIENT_SECRETは環境変数DISCORD_CLIENT_SECRETの値を参照するNode.jsの構文
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        // grant_type: "authorization_code"はOAuth2の認証コードフローを使うことを示すパラメータ
        grant_type: "authorization_code",
        // codeは先ほど取得した認証コードを渡している
        code: code,
    });
    // [Node.js] console.log()はデバッグ用にコンソールへparamsの内容を出力するNode.jsの標準構文
    console.log("params:", params);

    // [JavaScript] awaitキーワードはPromiseが解決されるまで処理を一時停止する（asyncの中でのみ使える）
    // [Fetch API] fetch()はHTTPリクエストを送信するブラウザ・Node.js組み込み関数
    // テンプレートリテラル（バッククォート）を使ってURLを文字列として組み立てている
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
        // method: "POST"はHTTPメソッドをPOSTに指定している
        method: "POST",
        // headersはHTTPリクエストヘッダーを指定するオブジェクト
        headers: {
            // "Content-Type": "application/x-www-form-urlencoded"はフォーム形式でデータを送ることを示すヘッダー
            "Content-Type": "application/x-www-form-urlencoded",
        },
        // body: paramsはリクエストのボディにURLSearchParamsで作成したパラメータを渡している
        body: params,
    });
    // [JavaScript] 分割代入（Destructuring Assignment）でresponse.json()の戻り値からaccess_tokenだけを取り出している
    // awaitはresponse.json()がPromiseを返すので解決されるまで待機する
    const { access_token } = await response.json();
    // [Node.js] console.log()はデバッグ用にaccess_tokenの値をコンソールへ出力するNode.jsの標準構文
    console.log("access token:", access_token);

    // [Express] res.json()はクライアントへJSON形式のレスポンスを返すExpressの構文
    // { access_token }は{ access_token: access_token }と同じ意味（ES6のショートハンドプロパティ）
    res.json({ access_token });
});

// [Express] app.use()はミドルウェアを登録するExpressの構文
// [Express] express.static('dist')はdistディレクトリ内の静的ファイル（HTML, CSS, JSなど）を配信するExpressのミドルウェア
app.use(express.static('dist'));

// [Express] app.listen()はサーバーを起動してPORTで指定したポート番号で接続を待ち受けるExpressの構文
// 第2引数のアロー関数はサーバーが起動したときに実行されるコールバック関数
app.listen(PORT, () => {
    // [Node.js] console.log()はサーバー起動のメッセージをコンソールへ出力するNode.jsの標準構文
    // テンプレートリテラル（${PORT}）を使って変数PORTの値を文字列に埋め込んでいる
    console.log(`サーバーが${PORT}番ポートで起動しました。`);
});
