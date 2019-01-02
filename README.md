# kwh-taker

## 動作要件
- node

## 使い方

1. config_default.ymlをconfig.ymlにリネームする

2. 上記でリネームしたconfig.ymlを開き、でんき家計簿のuserIdとpasswordを入力する

3. コマンドプロンプト（Windows）またはターミナル（Mac）で、本フォルダに移動し、下記コマンドを実行し、必要なライブラリを取得
```
npm install
```

4. さらに、以下のコマンドを実行すると、ブラウザが立ち上がりスクレイピングを開始
```
npm start
```

5. result.csvに取得したデータが書き出される


## 機能要件
- ログインページ、ユーザーID、パスワードはconfig.ymlで管理する。
- 使用料・料金タブから2年間分のテーブルから値を取得