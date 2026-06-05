import React from 'react';
import Dashboard from '../components/Dashboard';

function DashboardPage() {
  const DEFAULT_ITEMS = [
    { id: 'default-widget', title: '기본 위젯 (EC2)', w: 4, h: 3, x: 0, y: 0 },
  ];

  const SIDEBAR_ITEMS = [
    { id: 'default-widget', title: '기본 위젯 (EC2)', w: 4, h: 3 },
    { id: 'widget-1', title: 'EC2 인스턴스', w: 4, h: 2 },
    { id: 'widget-2', title: 'S3 버킷 요약', w: 3, h: 3 },
    { id: 'widget-3', title: '결제 대시보드', w: 6, h: 2 },
    { id: 'widget-4', title: '기타1', w: 4, h: 2 },
    { id: 'widget-5', title: '기타2', w: 4, h: 2 },
    { id: 'widget-6', title: '기타3', w: 4, h: 2 },
  ];

  return (
    <div>
      <Dashboard
        width="null"
        height="null"
        title="SQL 대시보드"
        currentTabs={DEFAULT_ITEMS}
        sidebarTabs={SIDEBAR_ITEMS}
      />
    </div>
  );
}

export default DashboardPage;
