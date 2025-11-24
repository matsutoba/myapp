# Icon コンポーネント

`lucide-react` をラップし、トークンベースでサイズ・色・ストロークを統一管理できる汎用アイコンです。

## 特徴

- ✅ 5,000+ lucide アイコンに対応
- ✅ TypeScript 型安全 & トークン指定
- ✅ size / colorVariant / strokeWidth キー指定可能
- ✅ 数値指定との併用で柔軟性維持

## 基本的な使い方

```tsx
import { Icon } from '@/components/ui';

export function MyComponent() {
  return (
    <div>
      <Icon name="User" size="lg" />
      <Icon name="Settings" size="md" color="#666" />
      <Icon name="Heart" size="xl" strokeWidth="bold" />
    </div>
  );
}
```

## Props

| Prop           | 型                        | デフォルト   | 説明                                                     |
| -------------- | ------------------------- | ------------ | -------------------------------------------------------- |
| `name`         | `IconName`                | -            | lucide-react のアイコン名 (必須)                         |
| `size`         | `number \| IconSizeKey`   | `lg` (24)    | 数値またはサイズトークン (xs/sm/md/lg/xl)                |
| `color`        | `string`                  | -            | 直接色指定 (CSS color)                                   |
| `colorVariant` | `IconColorVariant`        | -            | プリセット色 (default/muted/info/success/warning/danger) |
| `strokeWidth`  | `number \| IconStrokeKey` | `normal` (2) | 数値またはトークン (light/normal/bold)                   |
| `className`    | `string`                  | `''`         | 追加 Tailwind クラス                                     |

## サイズ指定例

```tsx
<Icon name="Star" size="sm" />   // 16px
<Icon name="Star" size="lg" />   // 24px (default)
<Icon name="Star" size={40} />    // 任意の数値
```

## 線の太さ指定例

```tsx
<Icon name="Check" strokeWidth="light" />   // 1
<Icon name="Check" strokeWidth="normal" />  // 2 (default)
<Icon name="Check" strokeWidth="bold" />    // 3
```

## 色指定方法

```tsx
// 直接色
<Icon name="Heart" color="red" />
<Icon name="AlertCircle" color="#ef4444" />

// バリアント (推奨)
<Icon name="Info" colorVariant="info" />
<Icon name="CheckCircle" colorVariant="success" />
<Icon name="AlertTriangle" colorVariant="warning" />
<Icon name="XCircle" colorVariant="danger" />

// Tailwindクラスで細かく制御
<Icon name="Mail" className="text-blue-500" />
```

## よく使うアイコンカテゴリ

```tsx
// ナビゲーション
<Icon name="Home" />
<Icon name="Search" />
<Icon name="Menu" />
<Icon name="User" />

// アクション
<Icon name="Edit" />
<Icon name="Trash" />
<Icon name="Save" />
<Icon name="Download" />
<Icon name="Upload" />

// 状態表示
<Icon name="Check" />
<Icon name="X" />
<Icon name="AlertCircle" />
<Icon name="Info" />

// UI要素
<Icon name="ChevronRight" />
<Icon name="ChevronLeft" />
<Icon name="LogOut" />
```

## テキストと組み合わせ

```tsx
<button className="flex items-center gap-2">
  <Icon name="Download" size="md" />
  <span>ダウンロード</span>
</button>

<div className="flex items-center gap-2 text-green-600">
  <Icon name="Check" size="sm" />
  <span>保存しました</span>
</div>
```

## アニメーション

```tsx
<Icon name="Loader" size="lg" colorVariant="info" className="animate-spin" />
```

## IconButton との違い

| 特徴             | `Icon`        | `IconButton`           |
| ---------------- | ------------- | ---------------------- |
| 用途             | 単体表示      | クリック可能アクション |
| スタイル         | 最小限        | ボタン UI 付き         |
| インタラクション | なし          | hover/focus/active     |
| 主用途           | 状態/補助表示 | 操作トリガー           |

### 使い分け

```tsx
// 補助表示
<div className="flex items-center gap-2">
  <Icon name="Clock" size="sm" className="text-gray-500" />
  <span>2時間前</span>
</div>

// 操作
<IconButton icon="Trash" onClick={handleDelete} aria-label="削除" />
```

## TypeScript 型サポート

```tsx
import type { IconName, IconProps } from '@/components/ui';

const iconName: IconName = 'User'; // ✅ OK
// const invalid: IconName = 'InvalidIcon'; // ❌ 型エラー

const iconProps: IconProps = {
  name: 'Star',
  size: 'lg',
  colorVariant: 'warning',
};
```

## アクセシビリティ

アイコンのみでボタンを作る場合は `aria-label` を付与:

```tsx
<button aria-label="設定を開く">
  <Icon name="Settings" size="md" />
</button>
```

テキスト併用時は不要:

```tsx
<button>
  <Icon name="Save" size="md" />
  <span>保存</span>
</button>
```

## トークン一覧

| サイズキー | px  |
| ---------- | --- |
| xs         | 12  |
| sm         | 16  |
| md         | 20  |
| lg         | 24  |
| xl         | 32  |

| ストロークキー | width |
| -------------- | ----- |
| light          | 1     |
| normal         | 2     |
| bold           | 3     |

| 色バリアント | Tailwind クラス |
| ------------ | --------------- |
| default      | text-foreground |
| muted        | text-muted      |
| info         | text-blue-600   |
| success      | text-green-600  |
| warning      | text-yellow-600 |
| danger       | text-red-600    |

## 公式アイコン一覧

https://lucide.dev/icons/

Storybook の `IconGallery` でも確認できます。
