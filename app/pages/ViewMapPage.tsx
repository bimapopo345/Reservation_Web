import { ZoomIn, Download } from 'lucide-react';
import { useState } from 'react';
import floor6Map from 'figma:asset/6c6c9d39dc52f4759c8e8272da5eaae0a2b6bbff.png';
import floor7Map from 'figma:asset/b63ece6d2c0b4d24c2f6109933cd4336942b0592.png';

export function ViewMapPage() {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const handleDownload = (floor: string, imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Layout_Floor_${floor}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Header */}
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-7xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Floor Maps</h1>
      </div>

      {/* Floor Maps Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lantai 6 Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Lantai 6</h2>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <img 
              src={floor6Map} 
              alt="Layout 6th Floor" 
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setSelectedMap(floor6Map)}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
              View Larger
            </button>
            <button
              onClick={() => handleDownload('6', floor6Map)}
              className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Lantai 7 Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Lantai 7</h2>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <img 
              src={floor7Map} 
              alt="Layout 7th Floor" 
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setSelectedMap(floor7Map)}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
              View Larger
            </button>
            <button
              onClick={() => handleDownload('7', floor7Map)}
              className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Larger View */}
      {selectedMap && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMap(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Floor Layout - Larger View</h2>
              <button
                onClick={() => setSelectedMap(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <img 
              src={selectedMap} 
              alt="Floor Layout - Large View" 
              className="w-full h-auto rounded-lg"
            />
            
            <button
              onClick={() => setSelectedMap(null)}
              className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
