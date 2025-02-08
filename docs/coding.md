# コーディング

## Git hooks

1. チームと共有用のGit hooksの参照先ディレクトリを作成
```shell
mkdir .githooks
```

2. Git hooksの参照先ディレクトリを変更
```shell
git config --local core.hooksPath .githooks
```

3. [.githooks/pre-commit](/.githooks/pre-commit)作成&記述
4. 実行権限付与
```shell
chmod a+x ./.githooks/pre-commit
```
