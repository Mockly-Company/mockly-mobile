import {addons} from 'storybook/manager-api';
const SidebarParents = {
  스크린: '스크린 소개',
  컴포넌트: '컴포넌트 소개',
  파운데이션: '파운데이션 소개',
  레이아웃: '레이아웃 소개',
  애니메이션: '애니메이션 소개',
  '디자인 시스템': '디자인 시스템',
} as const;

addons.setConfig({
  sidebar: {
    renderLabel: item => {
      // "Docs" 탭 이름을 커스터마이징
      const isDocs = item.type === 'docs' && item.depth === 1;
      if (isDocs && isOverview(item.parent)) {
        const newDocsName = SidebarParents[item.parent] || item.name;
        item.name = newDocsName;
      }
      return item.name;
    },
  },
});

function isOverview(parent: string): parent is keyof typeof SidebarParents {
  return parent in SidebarParents;
}
