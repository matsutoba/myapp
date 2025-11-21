import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Container } from '../Container/Container';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Stack } from '../Stack/Stack';

const meta: Meta = {
  title: 'Layout/Examples',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const LoginPage: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <Container size="sm">
        <Card>
          <Stack spacing="md">
            <h1 className="text-2xl font-bold text-center">ログイン</h1>

            <Input
              label="メールアドレス"
              type="email"
              placeholder="user@example.com"
            />

            <Input
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
            />

            <Button className="w-full">ログイン</Button>

            <div className="text-center text-sm text-gray-600">
              アカウントをお持ちでない方は
              <a href="#" className="text-blue-600 hover:underline ml-1">
                新規登録
              </a>
            </div>
          </Stack>
        </Card>
      </Container>
    </div>
  ),
};

export const UserCreateForm: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gray-200 h-10 flex items-center px-4 font-semibold">
        ユーザー管理 &gt; 新規作成
      </div>
      <Container size="sm">
        <Card>
          <Stack spacing="md">
            <Alert variant="info">
              新しいユーザーを作成します。必要な情報を入力してください。
            </Alert>

            <Input label="名前" required placeholder="山田太郎" />

            <Input
              label="メールアドレス"
              type="email"
              required
              placeholder="user@example.com"
            />

            <Input
              label="パスワード"
              type="password"
              required
              helperText="最低6文字以上で設定してください"
            />

            <Select
              label="ロール"
              required
              options={[
                { value: 'user', label: '一般ユーザー' },
                { value: 'admin', label: '管理者' },
              ]}
            />

            <Stack direction="horizontal" spacing="sm">
              <Button>作成</Button>
              <Button variant="secondary">キャンセル</Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </div>
  ),
};

export const UserList: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gray-200 h-10 flex items-center px-4 font-semibold">
        ユーザー管理
      </div>
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <h1 className="text-2xl font-bold">ユーザー一覧</h1>
            <Button>新規作成</Button>
          </Stack>

          <Card padding="none">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    名前
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    メールアドレス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ロール
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[
                  {
                    id: 1,
                    name: '山田太郎',
                    email: 'yamada@example.com',
                    role: '管理者',
                  },
                  {
                    id: 2,
                    name: '佐藤花子',
                    email: 'sato@example.com',
                    role: '一般ユーザー',
                  },
                  {
                    id: 3,
                    name: '鈴木一郎',
                    email: 'suzuki@example.com',
                    role: '一般ユーザー',
                  },
                ].map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Stack direction="horizontal" spacing="sm">
                        <button className="text-blue-600 hover:underline">
                          編集
                        </button>
                        <button className="text-red-600 hover:underline">
                          削除
                        </button>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Stack>
      </Container>
    </div>
  ),
};

export const Dashboard: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-indigo-900 h-8 text-white flex justify-between items-center px-3">
        <div className="font-bold">MyApp</div>
        <div className="text-sm">管理者</div>
      </div>
      <Container>
        <Stack spacing="lg">
          <h1 className="text-3xl font-bold mt-6">ダッシュボード</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <Stack spacing="sm" align="center">
                <div className="text-4xl font-bold text-blue-600">150</div>
                <div className="text-gray-600">総ユーザー数</div>
                <div className="text-sm text-green-600">+12% 先月比</div>
              </Stack>
            </Card>
            <Card>
              <Stack spacing="sm" align="center">
                <div className="text-4xl font-bold text-green-600">89%</div>
                <div className="text-gray-600">アクティブ率</div>
                <div className="text-sm text-green-600">+3% 先月比</div>
              </Stack>
            </Card>
            <Card>
              <Stack spacing="sm" align="center">
                <div className="text-4xl font-bold text-orange-600">24</div>
                <div className="text-gray-600">未読通知</div>
                <div className="text-sm text-red-600">対応が必要</div>
              </Stack>
            </Card>
          </div>

          <Card>
            <Stack spacing="md">
              <h2 className="text-xl font-bold">最近のアクティビティ</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">
                      山田太郎さんが登録しました
                    </div>
                    <div className="text-sm text-gray-600">2時間前</div>
                  </div>
                  <span className="text-green-600 text-sm">新規登録</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">
                      佐藤花子さんがログインしました
                    </div>
                    <div className="text-sm text-gray-600">5時間前</div>
                  </div>
                  <span className="text-blue-600 text-sm">ログイン</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">
                      システムメンテナンス完了
                    </div>
                    <div className="text-sm text-gray-600">8時間前</div>
                  </div>
                  <span className="text-gray-600 text-sm">システム</span>
                </div>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gray-200 h-10 flex items-center px-4 font-semibold">
        ユーザー管理 &gt; 新規作成
      </div>
      <Container size="sm">
        <Card>
          <Stack spacing="md">
            <Alert variant="error">
              ユーザーの作成に失敗しました。以下の点をご確認ください：
              <ul className="list-disc ml-5 mt-2">
                <li>メールアドレスが正しい形式であること</li>
                <li>パスワードが6文字以上であること</li>
                <li>既に同じメールアドレスが登録されていないこと</li>
              </ul>
            </Alert>

            <Input label="名前" required value="山田太郎" />

            <Input
              label="メールアドレス"
              type="email"
              required
              value="invalid-email"
              error="正しいメールアドレスを入力してください"
            />

            <Input
              label="パスワード"
              type="password"
              required
              value="123"
              error="パスワードは6文字以上で入力してください"
              helperText="最低6文字以上で設定してください"
            />

            <Select
              label="ロール"
              required
              value="user"
              options={[
                { value: 'user', label: '一般ユーザー' },
                { value: 'admin', label: '管理者' },
              ]}
            />

            <Stack direction="horizontal" spacing="sm">
              <Button>作成</Button>
              <Button variant="secondary">キャンセル</Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </div>
  ),
};
