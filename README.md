# shaka
# Aegis SSL Renewal System β1.0

## 概要
- GitHub Actionsを基盤としたSSL証明書自動更新システム
- DV/Alpha証明書のみ対応（β1.0）
- 予算上限（金額/本数）で自動停止
- 証明書・注文情報・ログはJSONで保存
- UIはGitHub Pagesで閲覧（モノトーンSaaSデザイン）

## 運用手順
1. CSRを用意し、証明書情報をstate.jsonに登録
2. renewal-cron.ymlで定期実行（毎日9時）
3. renewal-manual.ymlで手動実行・リセット可能
4. 予算上限到達時は自動停止・警告表示
5. DNS検証は手動でTXTレコード設置（β1.0）
6. UIで証明書・予算・ログ・警告を確認

## 拡張案
- OV/EV対応
- AWS自動配置連携
- 本格認証（社内限定配信）

## 参考仕様書
- GlobalSign SSL API v4.13（SOAP）citeturn1fetch_file1
