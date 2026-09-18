import type { ReactNode } from 'react';
import styles from '../../../css/libraryPage/LibraryLayout.module.css';

interface LibraryLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function LibraryLayout({ sidebar, children }: LibraryLayoutProps) {
  return (
    <div className={styles.libraryLayout}>
      {sidebar}
      <main className={styles.content}>{children}</main>
    </div>
  );
}