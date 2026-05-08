import { Shuffle, Monitor, Map, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router';

export function QuickActions() {
  const actions = [
    {
      icon: Shuffle,
      title: 'Shuffle Tables',
      description: 'Get a random table automatically',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/shuffle'
    },
    {
      icon: Monitor,
      title: 'Monitoring',
      description: 'Monitor desk status in real-time',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/monitoring'
    },
    {
      icon: Map,
      title: 'View Map',
      description: 'View the map of your desk reservations',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/floor-map'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-orange-500" fill="currentColor" />
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Actions</h2>
      </div>

      <div className="space-y-2">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="w-full bg-gray-50 rounded-xl p-2.5 flex items-center gap-2.5 hover:bg-gray-100 transition-all group"
          >
            <div className={`w-9 h-9 ${action.color} rounded-lg flex items-center justify-center shrink-0`}>
              <action.icon className={`w-4 h-4 ${action.iconColor}`} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h3 className="font-semibold text-xs text-gray-900">{action.title}</h3>
              <p className="text-[10px] text-gray-500 leading-tight truncate">{action.description}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}