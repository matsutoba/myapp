'use client';

import {
  Button,
  Card,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  IconButton,
  Input,
  Pagination,
  Stack,
  useToast,
} from '@/components/ui';
import type { Customer } from '@/features/customer/types';
import { actions } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const loadCustomers = async (page?: number) => {
    setLoading(true);
    const p = page && page > 0 ? page : Number(searchParams.get('page') || 1);
    const keyword = searchParams.get('keyword') || undefined;
    const result = await actions.customer.getCustomers({ page: p, keyword });

    if (result.success && result.data) {
      const data = result.data as any;
      if (Array.isArray(data)) {
        setCustomers(data);
        setTotalPages(1);
      } else if (data && data.items) {
        setCustomers(data.items);
        const take = data.take || 20;
        setTotalPages(Math.max(1, Math.ceil((data.total || 0) / take)));
      } else {
        setCustomers([]);
        setTotalPages(1);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const p = Number(searchParams.get('page') || 1);
    setSearchTerm(searchParams.get('keyword') || '');
    loadCustomers(p);
  }, [searchParams]);

  const handleSearch = (term?: string) => {
    const kw = typeof term === 'string' ? term : searchTerm;
    if (kw) router.push(`/customers?page=1&keyword=${encodeURIComponent(kw)}`);
    else router.push('/customers');
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    const result = await actions.customer.deleteCustomer(deleteTargetId);
    if (result.success) {
      showToast({
        title: '削除しました',
        message: '顧客を削除しました',
        variant: 'success',
        duration: 4000,
      });
      loadCustomers();
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <FeatureTitleBar title="顧客管理" />
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <div className="flex items-center space-x-2">
              <div className="w-72">
                <Input
                  placeholder="検索 (名前 or メール)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onEnter={() => handleSearch()}
                  trailing={
                    <IconButton
                      icon="Search"
                      onClick={() => handleSearch()}
                      aria-label="検索"
                    />
                  }
                />
              </div>
            </div>
            <Button size="sm" onClick={() => router.push('/customers/new')}>
              新規作成
            </Button>
          </Stack>

          <Card padding="none" className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    会社名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    担当者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    メール
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.contactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <IconButton
                        icon="Pencil"
                        onClick={() => router.push(`/customers/${c.id}`)}
                        aria-label="編集"
                      />
                      <IconButton
                        icon="Trash"
                        onClick={() => handleDeleteClick(c.id)}
                        aria-label="削除"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="px-4 py-4 flex justify-center">
            <Pagination
              page={Number(searchParams.get('page') || 1)}
              totalPages={totalPages}
              onPageChange={(p) => {
                const pageQuery = p > 1 ? `?page=${p}` : '';
                router.push(`/customers${pageQuery}`);
              }}
            />
          </div>
        </Stack>
      </Container>

      <ConfirmModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="削除確認"
        message="本当に削除しますか？"
        confirmText="削除"
        cancelText="キャンセル"
        variant="danger"
      />
    </div>
  );
}
