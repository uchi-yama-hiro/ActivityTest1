// [JavaScript ES6 Modules] import文はモジュールから特定のエクスポートを読み込むES6の構文
// [Discord Embedded App SDK] @discord/embedded-app-sdkはDiscordのEmbedded App開発用SDKパッケージ（package.jsonのdependenciesに記載）
import { DiscordSDK } from "@discord/embedded-app-sdk";

// [JavaScript] constはブロックスコープの定数を宣言するES6の構文（再代入不可）
// DiscordアプリケーションのクライアントIDを文字列として定義している
const client_id = "1494883647604658226"

// [Discord Embedded App SDK] DiscordSDKクラスのインスタンスをnewキーワードで生成する
// client_idを引数として渡してSDKを初期化している
const discordSdk = new DiscordSDK(client_id);

// [JavaScript] asyncキーワードを付けることで非同期関数として定義する（内部でawaitが使用可能になる）
// functionキーワードで名前付き関数setupDiscordSdkを定義している
async function setupDiscordSdk() {
    // [JavaScript] letはブロックスコープの変数を宣言するES6の構文（再代入可能）
    // authにnullを代入して初期化している（後で認証情報が入る）
    let auth = null;
    // [ブラウザ/Node.js] console.log()はデバッグ用に文字列をコンソールへ出力する標準構文
    console.log("DiscordSDK is setting up");

    // [JavaScript] awaitキーワードはPromiseが解決されるまで処理を一時停止する（asyncの中でのみ使える）
    // [Discord Embedded App SDK] discordSdk.ready()はDiscord SDKの準備が完了するまで待機するSDKのメソッド
    await discordSdk.ready();
    // [ブラウザ/Node.js] console.log()はデバッグ用に文字列をコンソールへ出力する標準構文
    console.log("DiscordSDK is ready");

    // [JavaScript] 分割代入（Destructuring Assignment）でauthorize()の戻り値からcodeだけを取り出している
    // [Discord Embedded App SDK] discordSdk.commands.authorizeはDiscordの認可フローを開始するSDKのコマンド
    const { code } = await discordSdk.commands.authorize({
        // client_idはDiscordアプリのクライアントIDを渡している
        client_id: client_id,
        // response_type: "code"はOAuth2で認証コードを受け取ることを指定している
        response_type: "code",
        // stateはCSRF対策用のランダム文字列（ここでは空文字列を指定）
        state: "",
        // prompt: "none"は認証画面を表示せずにサイレント認証を試みる設定
        prompt: "none",
        // scopeは要求するDiscordの権限スコープの配列
        scope: [
            // "identify"はユーザーの基本情報（ID、ユーザー名など）を取得する権限
            "identify",
            // "guilds"はユーザーが所属するサーバー一覧を取得する権限
            "guilds",
        ],
    });
    // [ブラウザ/Node.js] console.log()はデバッグ用に認可成功のメッセージをコンソールへ出力する標準構文
    console.log("Authorization is successful");

    // [Fetch API] fetch()はHTTPリクエストを送信するブラウザ・Node.js組み込み関数
    // "/api/token"は同一オリジン（同じサーバー）の相対パスへPOSTリクエストを送る
    const response = await fetch("/api/token", {
        // method: "POST"はHTTPメソッドをPOSTに指定している
        method: "POST",
        // headersはHTTPリクエストヘッダーを指定するオブジェクト
        headers: {
            // "Content-Type": "application/json"はJSONデータを送ることを示すヘッダー
            "Content-Type": "application/json",
        },
        // [JavaScript] JSON.stringify()はJavaScriptのオブジェクトをJSON文字列に変換する組み込み関数
        // bodyにJSON文字列に変換したオブジェクトを渡している
        body: JSON.stringify({
            // codeは分割代入で取得した認可コードを送信している（{ code: code }と同じ意味のショートハンド）
            code,
        }),
    });
    // [ブラウザ/Node.js] console.log()はデバッグ用にトークン取得成功メッセージをコンソールへ出力する標準構文
    console.log("Token is fetched");

    // [JavaScript] 分割代入でresponse.json()の戻り値からaccess_tokenだけを取り出している
    // awaitはresponse.json()がPromiseを返すので解決されるまで待機する
    const { access_token } = await response.json();
    // [Discord Embedded App SDK] discordSdk.commands.authenticateはアクセストークンを使って認証するSDKのコマンド
    // awaitで認証処理が完了するまで待機し、結果をauthに代入している
    auth = await discordSdk.commands.authenticate({
        // access_tokenはサーバーから取得したOAuth2アクセストークン（{ access_token: access_token }と同じ意味のショートハンド）
        access_token,
    });
    // [ブラウザ/Node.js] console.log()はデバッグ用に認証成功メッセージをコンソールへ出力する標準構文
    console.log("Authentication is successful");

    // [JavaScript] if文はauthがnullかどうかを判定する条件分岐
    if (auth == null) {
        // [JavaScript] throwキーワードは例外を発生させる構文
        // new Error()はJavaScript組み込みのエラーオブジェクトを生成している
        throw new Error("Authenticate command failed");
    }

    // [JavaScript] returnキーワードで関数の戻り値としてauthを返している
    return auth;
}

// [JavaScript] 即時実行関数式（IIFE: Immediately Invoked Function Expression）をasyncで包んだパターン
// (async () => { ... })()という形で、定義と同時に非同期関数を実行している
(async () => {
    // [JavaScript] try-catch文はtryブロック内で例外（エラー）が発生したときcatchブロックで受け取るための構文
    try{
        // [JavaScript] awaitキーワードでsetupDiscordSdk()の完了を待機し、結果をauthに代入している
        let auth = await setupDiscordSdk();
        // [ブラウザ/Node.js] console.log()はデバッグ用にセットアップ完了メッセージをコンソールへ出力する標準構文
        console.log("DiscordSDK is set up");

        // [Discord Embedded App SDK] discordSdk.commands.getChannelは現在のチャンネル情報を取得するSDKのコマンド
        // discordSdk.channelIdはSDKが自動的に提供する現在のチャンネルIDプロパティ
        const channel = await discordSdk.commands.getChannel({ channel_id: discordSdk.channelId });
        // [DOM API] document.getElementById()はid属性が"channel-name"の要素をHTMLから取得するブラウザのDOM API
        // .innerTextはその要素のテキスト内容をchannel.nameで書き換えるDOMプロパティ
        document.getElementById("channel-name").innerText = channel.name;

        // [Fetch API] fetch()でDiscord API v10のユーザーが所属するサーバー一覧エンドポイントにGETリクエストを送る
        const guilds = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
            // headersはHTTPリクエストヘッダーを指定するオブジェクト
            headers: {
                // [OAuth2] AuthorizationヘッダーでBearerトークンを渡してDiscord APIへの認証を行う
                Authorization: `Bearer ${auth.access_token}`,
                // 'Content-Type': 'application/json'はJSONデータをやり取りすることを示すヘッダー
                'Content-Type': 'application/json',
            },
        });
        // [JavaScript] awaitでresponse.json()がPromiseを返すので解決されるまで待機しJSON形式にパースする
        const guildsJson = await guilds.json(); // サーバー情報を取得
        // [JavaScript] Array.find()は配列の中から条件に一致する最初の要素を返す配列メソッド
        // アロー関数 g => g.id === discordSdk.guildId でdiscordSdk.guildIdと一致するサーバーを探している
        const currentGuild = guildsJson.find((g) => g.id === discordSdk.guildId);
        // [DOM API] document.createElement()はHTMLの'img'要素を新しく生成するブラウザのDOM API
        const guildImg = document.createElement('img');
        // [DOM API] setAttribute()はHTML要素の属性を設定するブラウザのDOM API
        // 'src'属性にDiscord CDNのサーバーアイコン画像URLを設定している
        guildImg.setAttribute(
            'src',
            // テンプレートリテラルでサーバーIDとアイコンハッシュからアイコン画像URLを組み立てている
            `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`
        );
        // [DOM API] document.getElementById()はid属性が"guild-icon"の要素をHTMLから取得するブラウザのDOM API
        // .appendChild()は取得した要素の子要素としてguildImgを追加するブラウザのDOM API
        document.getElementById("guild-icon").appendChild(guildImg);
    }catch(e){
        // [ブラウザ/Node.js] console.error()はエラーをコンソールのエラー出力（赤色）に表示する標準構文
        // catchブロックのeはtryブロック内で発生した例外オブジェクト
        console.error(e);
    }
})();

