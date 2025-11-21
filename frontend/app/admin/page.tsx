import { MenuLinkButton } from '@/features/auth/components/MenuLinkButton';

export default function AdminDashboard() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MenuLinkButton
          title="ユーザー管理"
          description="システムユーザーの作成・編集・削除"
          href="/admin/users"
        />
        <MenuLinkButton
          title="ロール管理"
          description="権限とロールの設定"
          href="#"
          disabled
        />
        <MenuLinkButton
          title="システム設定"
          description="アプリケーション全体の設定"
          href="#"
          disabled
        />
      </div>
    </div>
  );
}
