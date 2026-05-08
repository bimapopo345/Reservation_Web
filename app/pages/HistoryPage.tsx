import { ClipboardList, Calendar, MapPin, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ReservationHistory {
  id: string;
  deskNumber: string;
  floor: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
}

export function HistoryPage() {
  const [history, setHistory] = useState<ReservationHistory[]>([]);

  const loadHistory = () => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('reservationHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      // Sort by date (newest first)
      parsedHistory.sort((a: ReservationHistory, b: ReservationHistory) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setHistory(parsedHistory);
    } else {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reservationHistory') {
        loadHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also refresh when window regains focus
    const handleFocus = () => {
      loadHistory();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'active':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Header */}
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-5xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Reservation History</h1>
      </div>

      <div className="max-w-5xl mx-auto">
        {history.length === 0 ? (
          /* Empty State Card */
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No reservation history.</p>
            </div>
          </div>
        ) : (
          /* History List */
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left Section - Desk Icon and Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-gray-900 mb-1">
                          {item.deskNumber}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{item.floor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{item.date}</span>
                          </div>
                        </div>

                        {/* Check-in/Check-out Times */}
                        {(item.checkInTime || item.checkOutTime) && (
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                            {item.checkInTime && (
                              <span>Check-in: {item.checkInTime}</span>
                            )}
                            {item.checkOutTime && (
                              <span>Check-out: {item.checkOutTime}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Status Badge */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}