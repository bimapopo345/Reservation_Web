import { Download, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { Desk } from '../types';

export function ViewMapPage() {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [desks, setDesks] = useState<Desk[]>([]);

  useEffect(() => {
    apiFetch<Desk[]>('/desks').then(setDesks).catch(() => setDesks([]));
  }, []);

  const desksByFloor = useMemo(() => {
    const grouped = new Map<string, Desk[]>();
    desks.forEach((desk) => {
      grouped.set(desk.floor, [...(grouped.get(desk.floor) ?? []), desk]);
    });
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [desks]);

  const handleDownload = (floor: string) => {
    const floorDesks = desks.filter((desk) => desk.floor === floor);
    const csv = ['desk,capacity,type', ...floorDesks.map((desk) => `${desk.name},${desk.capacity},${desk.type}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Layout_${floor.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-7xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Floor Maps</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {desksByFloor.map(([floor, floorDesks]) => (
          <div key={floor} className="bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Lantai {floor.startsWith('6') ? '6' : '7'}</h2>
            <FloorMap desks={floorDesks} />
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={() => setSelectedFloor(floor)}
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
                View Larger
              </button>
              <button
                onClick={() => handleDownload(floor)}
                className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFloor && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFloor(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Floor Layout - Larger View</h2>
              <button onClick={() => setSelectedFloor(null)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                X
              </button>
            </div>
            <FloorMap desks={desks.filter((desk) => desk.floor === selectedFloor)} large />
            <button onClick={() => setSelectedFloor(null)} className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FloorMap({ desks, large = false }: { desks: Desk[]; large?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className={`grid grid-cols-3 md:grid-cols-4 gap-3 ${large ? 'min-h-[520px]' : 'min-h-[280px]'}`}>
        {desks.map((desk) => (
          <div
            key={desk.id}
            className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm flex flex-col justify-between min-h-[78px]"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">{desk.name}</span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <div>
              <p className="text-xs text-gray-500">{desk.type}</p>
              <p className="text-xs font-semibold text-blue-600">{desk.capacity} seats</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
