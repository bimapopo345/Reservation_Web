import { AlertCircle, Building2, Calendar, CheckCircle2, FileText, Home, Lightbulb, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ApiError, apiFetch } from '../lib/api';
import { formatDisplayDate, todayInput, tomorrowInput } from '../lib/dates';
import type { Reservation, WorkspaceSummary } from '../types';

export function ShuffleTablesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(todayInput());
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleResult, setShuffleResult] = useState<Reservation | null>(null);
  const [currentDisplay, setCurrentDisplay] = useState({ floor: 6, table: '1' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);

  useEffect(() => {
    apiFetch<WorkspaceSummary>(`/workspace/summary?date=${selectedDate}`).then(setSummary).catch(() => setSummary(null));
  }, [selectedDate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isShuffling) {
      interval = setInterval(() => {
        const randomFloor = Math.floor(Math.random() * 2) + 6;
        const randomTable = String(Math.floor(Math.random() * 59) + 1);
        setCurrentDisplay({ floor: randomFloor, table: randomTable });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isShuffling]);

  const handleGetRandomTable = async () => {
    setErrorMessage(null);
    setShuffleResult(null);
    setIsShuffling(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const reservation = await apiFetch<Reservation>('/reservations/shuffle', {
        method: 'POST',
        body: { date: selectedDate },
      });
      setShuffleResult(reservation);
      setCurrentDisplay({
        floor: reservation.desk.floor.includes('7') ? 7 : 6,
        table: reservation.desk.name,
      });
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Unable to shuffle a table.');
    } finally {
      setIsShuffling(false);
    }
  };

  const handleGoToHome = () => {
    navigate(user?.role === 'admin' ? '/admin-home' : '/');
  };

  const dateChoices = [
    { label: 'Today', value: todayInput() },
    { label: 'Tomorrow', value: tomorrowInput() },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-4xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Shuffle Your Seat</h1>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Workspace</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {summary?.totalFloors ?? 0} Floors - {summary?.totalDesks ?? 0} Desks
              </h2>
              <p className="text-sm text-gray-600">- {summary?.totalSeats ?? 0} Total Seats</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Available Seats</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{summary?.availableSeats ?? 0}</h2>
              <p className="text-sm text-gray-600">- {summary?.reservedSeats ?? 0} Reserved</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Shuffle className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-lg text-gray-900">Shuffle Tables System</h2>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Shuffle className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-gray-900">Automated Table Selection</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our intelligent system automatically selects the best available table for you based on real-time availability and optimal space distribution.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-sm text-gray-900">How It Works</h3>
          </div>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="font-semibold">1.</span><span>Press the "Get Random Table" button below</span></li>
            <li className="flex gap-2"><span className="font-semibold">2.</span><span>System will randomly select a floor and table for you</span></li>
            <li className="flex gap-2"><span className="font-semibold">3.</span><span>Sit at any available seat within the assigned table</span></li>
          </ol>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              <span className="font-bold text-blue-900">Pro Tip: </span>
              The system ensures fair distribution of seats across all floors. Simply choose your preferred date and let the system do the rest!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-lg mb-6">
        <h2 className="font-bold text-xl text-gray-900 text-center mb-2">Choose Your Table</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Choose a date and get a random seat instantly</p>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Date</label>
          <div className="grid grid-cols-2 gap-4">
            {dateChoices.map((choice) => (
              <button
                key={choice.value}
                onClick={() => {
                  setSelectedDate(choice.value);
                  setErrorMessage(null);
                  setShuffleResult(null);
                }}
                className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedDate === choice.value ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className={`w-8 h-8 ${selectedDate === choice.value ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`font-bold text-sm ${selectedDate === choice.value ? 'text-gray-900' : 'text-gray-600'}`}>
                    {choice.label}
                  </p>
                  <p className="text-xs text-gray-500">{formatDisplayDate(choice.value)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-semibold">{errorMessage}</p>
          </div>
        )}

        <button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleGetRandomTable}
          disabled={isShuffling}
        >
          <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
          {isShuffling ? 'Shuffling...' : 'Get Random Table'}
        </button>

        {isShuffling && (
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200 text-center">
            <Shuffle className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-bounce" />
            <p className="text-sm text-gray-600 mb-4">Shuffling tables...</p>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Current Selection</p>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Floor</p>
                  <p className="text-4xl font-bold text-purple-600">{currentDisplay.floor}</p>
                </div>
                <div className="text-2xl text-gray-300">-</div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Table</p>
                  <p className="text-4xl font-bold text-blue-600">{currentDisplay.table}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {shuffleResult && !isShuffling && (
          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Your table has been assigned.</p>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Your Reserved Table</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Floor</p>
                    <p className="text-5xl font-bold text-purple-600">{shuffleResult.desk.floor}</p>
                  </div>
                  <div className="text-3xl text-gray-300">-</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Table</p>
                    <p className="text-5xl font-bold text-blue-600">{shuffleResult.desk.name}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDisplayDate(shuffleResult.date)}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleGoToHome}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Home
                </button>
                <button
                  onClick={() => {
                    setShuffleResult(null);
                    setErrorMessage(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Shuffle Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
