interface DeskCardProps {
  name: string;
  floor: string;
  status: 'Penuh' | 'Terisi' | 'Kosong';
  occupied: number;
  total: number;
}

export function DeskCard({ name, floor, status, occupied, total }: DeskCardProps) {
  const getStatusColor = () => {
    if (status === 'Penuh') return 'bg-red-100 border-red-200';
    if (status === 'Terisi') return 'bg-yellow-100 border-yellow-200';
    return 'bg-green-100 border-green-200';
  };

  const getDotColor = () => {
    if (status === 'Penuh') return 'bg-red-500';
    if (status === 'Terisi') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusTextColor = () => {
    if (status === 'Penuh') return 'text-red-600';
    if (status === 'Terisi') return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`rounded-2xl p-4 border-2 ${getStatusColor()} transition-all hover:shadow-md`}>
      <div className="flex flex-col items-center text-center">
        {/* Status Dot */}
        <div className={`w-8 h-8 ${getDotColor()} rounded-full mb-3 shadow-md`}></div>
        
        {/* Desk Name */}
        <h3 className="font-bold text-base text-gray-900 mb-1">{name}</h3>
        
        {/* Floor Info */}
        <p className="text-xs text-gray-600 mb-2">{floor}</p>
        
        {/* Status */}
        <p className={`text-sm font-semibold ${getStatusTextColor()} mb-1`}>
          {status}
        </p>
        
        {/* Occupancy */}
        <p className="text-xs text-gray-500">
          {occupied} / {total}
        </p>
      </div>
    </div>
  );
}
