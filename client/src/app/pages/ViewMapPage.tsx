import { Download, ZoomIn } from 'lucide-react';
import { useState } from 'react';

type FloorMap = {
  title: string;
  image: string;
  fileName: string;
};

const floorMaps: FloorMap[] = [
  { title: 'Lantai 6', image: '/floor-6.png', fileName: 'floor-6.png' },
  { title: 'Lantai 7', image: '/floor-7.png', fileName: 'floor-7.png' },
];

export function ViewMapPage() {
  const [selectedMap, setSelectedMap] = useState<FloorMap | null>(null);

  const handleDownload = (floor: FloorMap) => {
    const link = document.createElement('a');
    link.href = floor.image;
    link.download = floor.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl py-4 px-8 mb-8 shadow-lg max-w-md mx-auto text-center">
        <h1 className="font-bold text-2xl text-gray-900">Floor Maps</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
        {floorMaps.map((floor) => (
          <div key={floor.title} className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">{floor.title}</h2>
            <div className="rounded-2xl bg-white p-2">
              <img
                src={floor.image}
                alt={`Layout ${floor.title}`}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setSelectedMap(floor)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
                View Larger
              </button>
              <button
                type="button"
                onClick={() => handleDownload(floor)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setSelectedMap(null)}>
          <div className="max-h-[92vh] w-full max-w-7xl overflow-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedMap.title}</h2>
              <button
                type="button"
                onClick={() => setSelectedMap(null)}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
            <img src={selectedMap.image} alt={`Layout ${selectedMap.title}`} className="w-full h-auto rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
