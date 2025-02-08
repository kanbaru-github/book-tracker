# コーディング

## Git hooks

- pre-commitで静的解析
- pre-pushで自動テスト(時間がかかり効率が悪いため)


:::note waring
警告
commit,push時にメッセージが表示されることを確認
:::

1. チームと共有用のGit hooksの参照先ディレクトリを作成
```shell
mkdir .githooks
```

1.  Git hooksの参照先ディレクトリを変更
```shell
git config --local core.hooksPath .githooks
```

1. [.githooks/pre-commit](/.githooks/pre-commit)作成&記述
2. 実行権限付与
```shell
chmod a+x ./.githooks/pre-commit
```

1. [.githooks/pre-push](/.githooks/pre-push)作成&記述
2. 実行権限付与
```shell
chmod a+x ./.githooks/pre-push
```
