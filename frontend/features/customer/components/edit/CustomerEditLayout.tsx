import { Card, Container, FeatureTitleBar } from '@/components/ui';
import React from 'react';

export default function CustomerEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FeatureTitleBar title="顧客管理 > 編集" />
      <Container size="sm">
        <Card>{children}</Card>
      </Container>
    </div>
  );
}
