import { Shuffle, Monitor, Map, ArrowRight } from 'lucide-react';
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
      <h2 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
          >
            <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
              <p className="text-xs text-gray-500 truncate">{action.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
