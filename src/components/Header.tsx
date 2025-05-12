
import { Music } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-primary rounded-lg p-2">
          <Music size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">OS Process Visualizer</h1>
          <p className="text-sm text-muted-foreground">Music Player with OS Concepts</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="glass px-3 py-1 rounded-lg">
          <span className="text-xs font-semibold text-os-state-running">
            Processes: 4
          </span>
        </div>
        <div className="glass px-3 py-1 rounded-lg">
          <span className="text-xs font-semibold text-os-state-ready">
            Threads: 12
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
