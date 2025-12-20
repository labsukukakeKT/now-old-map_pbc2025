# ユーザー認証機能実装ガイド

## 実装内容

### 1. データベーススキーマの更新

[prisma/schema.prisma](prisma/schema.prisma) の `user_DB` モデルに以下のフィールドを追加：
- `email` (String @unique) - ユーザーメールアドレス（ユニーク）
- `password` (String) - パスワードハッシュ値
- `created_at` (DateTime @default(now())) - アカウント作成日時
- `updated_at` (DateTime @updatedAt) - 最終更新日時

### 2. API エンドポイントの実装

#### サインアップ: `POST /api/auth/signup`
- ファイル: [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)
- 機能:
  - メールアドレスの重複チェック
  - パスワードのSHA256ハッシュ化
  - 新規ユーザー作成
  - デフォルトユーザー名設定（メール名）

リクエスト例：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### ログイン: `POST /api/auth/login`
- ファイル: [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
- 機能:
  - ユーザー認証（メール+パスワード）
  - セッション情報返却

リクエスト例：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. UIコンポーネント

作成されたUIコンポーネント：
- [components/ui/button.tsx](components/ui/button.tsx) - ボタンコンポーネント
- [components/ui/input.tsx](components/ui/input.tsx) - 入力フィールド
- [components/ui/label.tsx](components/ui/label.tsx) - ラベル
- [components/ui/card.tsx](components/ui/card.tsx) - カードレイアウト
- [lib/utils.ts](lib/utils.ts) - ユーティリティ関数

### 4. ページの実装

#### ログインページ: `/login`
- ファイル: [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)
- 機能:
  - メール・パスワード入力フォーム
  - API連携
  - ローカルストレージにユーザー情報を保存
  - 成功時は `/account` にリダイレクト

#### サインアップページ: `/signup`
- ファイル: [app/(auth)/signup/page.tsx](app/(auth)/signup/page.tsx)
- 機能:
  - メール・パスワード入力フォーム
  - パスワード確認
  - パスワード最小文字数チェック（6文字以上）
  - API連携
  - 成功時は `/account` にリダイレクト

#### アカウントページ: `/account`
- ファイル: [app/account/page.tsx](app/account/page.tsx)
- 機能:
  - ログイン済みユーザーの情報表示
  - ユーザー情報の表示（ID、メール、ユーザー名、自己紹介、登録日時）
  - 新しい場所を追加ボタン
  - ログアウト機能

### 5. ナビゲーション

右上のアカウントボタンから `/account` ページへ遷移可能：
- ファイル: [components/MenuBar.jsx](components/MenuBar.jsx)
- 既に `/account` へのリンクが実装済み

## 使用方法

### 1. ユーザーサインアップ
```
1. ホームページ（/）の右上「アカウント」をクリック
2. ログイン画面から「Sign up」をクリック
3. メールアドレスとパスワードを入力
4. 「Sign Up」ボタンをクリック
5. アカウント作成完了後、自動的にアカウントページにリダイレクト
```

### 2. ユーザーログイン
```
1. ホームページ（/）の右上「アカウント」をクリック
2. メールアドレスとパスワードを入力
3. 「Log In」ボタンをクリック
4. ログイン完了後、アカウントページが表示
```

### 3. ログアウト
```
1. アカウントページ（/account）にアクセス
2. 「ログアウト」ボタンをクリック
3. ホームページにリダイレクト
```

## セッション管理

ユーザー情報はローカルストレージに保存されています：
- `localStorage.user` - ユーザー情報
- `localStorage.session` - セッション情報（ユーザーID、メール）

**注意**: 本番環境では、より安全なセッション管理方法（httpOnly クッキーなど）の使用を検討してください。

## パスワード保護

パスワードはSHA256でハッシュ化されて保存されます。

## データベースマイグレーション

スキーマ変更はPrismaマイグレーションで管理されています：
```bash
npx prisma migrate dev
```

## 次のステップ

必要に応じて以下の機能を実装できます：
- パスワードリセット機能
- メール認証
- ユーザープロフィール編集機能
- ソーシャルログイン（OAuth）
- より強力なパスワード保護（bcrypt など）
