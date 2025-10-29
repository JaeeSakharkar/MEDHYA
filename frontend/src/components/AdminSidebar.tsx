import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  Trophy,
  FolderOpen,
} from 'lucide-react';

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Quizzes', href: '/admin/quizzes', icon: BookOpen },
  { title: 'Questions', href: '/admin/questions', icon: HelpCircle },
  { title: 'Chapters', href: '/admin/chapters', icon: FolderOpen },
  { title: 'Scores', href: '/admin/scores', icon: Trophy },
  { title: 'Users', href: '/admin/users', icon: Users },
];

export const AdminSidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-sidebar min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
