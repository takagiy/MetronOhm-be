[English here](README.md) | 日本語

# MetronOhm-be🎶 - 音ゲーバックエンド
MetronOhm-beは2019年度の明石高専高専祭にて4Eの学生により展示された音ゲーのバックエンド部分です。

## 配布
[releases](https://github.com/takagiy/MetronOhm-be/releases)から実行ファイルがダウンロードできます。

## ライセンス
Copyright(c) Yuki Takagi 2020   
MIT Licenseのもとで配布します。 （[LICENSE](./LICENSE)を参照）   
※[releases](https://github.com/takagiy/MetronOhm-be/releases)には、このリポジトリのライセンスが適用されない第三者のオブジェクトが含まれます。（external\_LICENSE.txtを参照）

## 必要なもの
遊ぶとき
* *フロントエンド部分*

ソースからビルドするとき（必須でない）
* `node`
* `npm`
* `make`（必須でない）

## 使い方
[releases](https://github.com/takagiy/MetronOhm-be/releases)からダウンロードした実行ファイルを
開くとバックエンド部分が起動します。
あるいは、[実行ファイルをソースからビルドする](#%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%8B%E3%82%89%E3%83%93%E3%83%AB%E3%83%89%E3%81%99%E3%82%8B%E5%A0%B4%E5%90%88)こともできます。

## ソースからビルドする場合
*[ビルドの不要なコンパイル済み実行ファイルも用意されています。](https://github.com/takagiy/MetronOhm-be/releases)*   
以下のコマンドで実行ファイルをビルドし、バックエンド部分を起動できます。

```console
make run
```

### 必須でないターゲット
バックエンド部分を起動せずに、コンパイルのみを行うには以下のコマンドを用います。

```console
make js
```

実行ファイルは以下のコマンドで生成できます。

```console
make bin
```

自分の環境で実行可能な実行ファイルのみを生成するには、以下のコマンドを用います。

```console
make bin.platform
```
