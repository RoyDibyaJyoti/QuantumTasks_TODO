import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
  onAddTask: () => void;
}

export default function MainLayout({ children, onAddTask }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-slate-300 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onAddTask={onAddTask} />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
