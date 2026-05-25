import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProject } from '../../hooks/useProject';
import { SECTOR } from '../../contexts/ProjectContext';
import type { Sector } from '../../types';

const SECTOR_ACCENT: Record<Sector, string> = {
  SOFTWARE:     'bg-indigo-500',
  CONSTRUCCION: 'bg-amber-500',
};

const NAV_ITEMS = [
  { to: '/dashboard',       label: 'Proyectos',        icon: '▦' },
  { to: '/proyecto/nuevo',  label: 'Nuevo proyecto',   icon: '+' },
];

const Sidebar = () => {
  const { user, logout }                                    = useAuth();
  const { activeProject, activeSector, clearActiveProject } = useProject();
  const navigate                                            = useNavigate();

  const accentColor = activeSector ? SECTOR_ACCENT[activeSector] : 'bg-indigo-500';

  const handleLogout = () => {
    clearActiveProject();
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-slate-900 text-slate-300 h-full">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-6 rounded-full ${accentColor} transition-colors duration-300`} />
          <span className="font-semibold text-white text-sm tracking-wide">GestorPro</span>
        </div>
      </div>

      {activeProject && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
          <p className="text-[0.65rem] uppercase tracking-widest text-slate-500 mb-0.5">Proyecto activo</p>
          <p className="text-xs font-medium text-white truncate">{activeProject.name}</p>
          <button
            onClick={() => { clearActiveProject(); navigate('/dashboard'); }}
            className="text-[0.65rem] text-slate-500 hover:text-slate-300 mt-1 transition-colors"
          >
            ← Volver al listado
          </button>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <span className="text-base w-4 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}

        {activeProject && (
          <NavLink
            to={`/workspace/${activeProject.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <span className="text-base w-4 text-center">◈</span>
            Workspace
          </NavLink>
        )}
      </nav>

      <div className="px-3 pb-4 pt-2 border-t border-slate-800 mt-2">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-[0.65rem] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-1 px-3 py-1.5 text-xs text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
