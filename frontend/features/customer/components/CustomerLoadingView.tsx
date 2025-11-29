import CustomerEditLayout from './CustomerEditLayout';

export default function CustomerLoadingView() {
  return (
    <CustomerEditLayout>
      <p className="text-gray-600">読み込み中...</p>
    </CustomerEditLayout>
  );
}
