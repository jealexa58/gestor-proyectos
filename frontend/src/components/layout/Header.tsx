import { useLocation } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import Badge from '../common/Badge';
import type { Sector } from '../../types';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard':      'Mis Proyectos',
  '/proyecto/nuevo': 'Nuevo Proyecto',
};

const SECTOR_LABEL: Record<Sector, { label: string; variant: string }> = {
  SOFTWARE:     { label: 'Software',     variant: 'software'     },
  CONSTRUCCION: { label: 'Construcción', variant: 'construccion' },
};

const Header = () => {
  const { pathname }                     = useLocation();
  const { activeProject, activeSector }  = useProject();

  const title      = activeProject ? activeProject.name : (ROUTE_TITLES[pathname] ?? 'GestorPro');
  const sectorInfo = activeSector ? SECTOR_LABEL[activeSector] : null;

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        {sectorInfo && <Badge label={sectorInfo.label} variant={sectorInfo.variant} size="md" />}
      </div>
      {activeProject && (
        <p className="text-xs text-gray-400">
          Cliente: <span className="text-gray-600 font-medium">{activeProject.client}</span>
        </p>
      )}
    </header>
  );
};

export default Header;
