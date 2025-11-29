import { Card, Container, FeatureTitleBar } from '@/components/ui';
import React from 'react';

export default function UserEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FeatureTitleBar title="ユーザー管理 > 編集" />
      <Container size="sm">
        <Card>{children}</Card>
      </Container>
    </div>
  );
}
