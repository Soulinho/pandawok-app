import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; // Import a date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Import its CSS

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber?: number;
  onReservationCreate?: (reservationData: ReservationData) => void;
}

interface ReservationData {
  tableNumber?: number;
  guests: number | null;
  time: string | null;
  name: string;
  date: Date | null; // Add date to the ReservationData interface
  notes?: string;
}

const NewReservationModal: React.FC<NewReservationModalProps> = ({ isOpen, onClose, tableNumber, onReservationCreate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // New state for selected date, default to today
  const [selectedGuests, setSelectedGuests] = useState<number | null>(null);
  const [customGuests, setCustomGuests] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentStep, setCurrentStep] = useState<'date' | 'guests' | 'time' | 'name'>('date'); // Start with 'date'
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date()); // Reset date to today
      setSelectedGuests(null);
      setCustomGuests('');
      setShowCustomInput(false);
      setCurrentStep('date'); // Always start at the date step
      setSelectedTime(null);
      setGuestName('');
      setNotes('');
    }
  }, [isOpen, tableNumber]);

  if (!isOpen) return null;

  const predefinedOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleDateSelection = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleGuestSelection = (guests: number) => {
    setSelectedGuests(guests);
    setShowCustomInput(false);
    setCustomGuests('');
  };

  const handleCustomGuests = () => {
    setShowCustomInput(true);
    setSelectedGuests(null);
  };

  const handleCustomGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomGuests(value);
    if (value && parseInt(value) > 0) {
      setSelectedGuests(parseInt(value));
    } else {
      setSelectedGuests(null);
    }
  };

  const getFormattedDate = (date: Date | null) => {
    if (!date) return 'Selecciona una fecha';
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 12; hour <= 18; hour++) {
      if (hour === 18) {
        times.push('6:30 PM');
        break;
      }
      const time12 = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      times.push(`${time12}:00 ${period}`);
      times.push(`${time12}:30 ${period}`);
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const handleContinueFromDate = () => {
    if (selectedDate) {
      setCurrentStep('guests');
    }
  };

  const handleContinueFromGuests = () => {
    if (selectedGuests && selectedGuests > 0) {
      setCurrentStep('time');
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinueFromTime = () => {
    if (selectedTime) {
      setCurrentStep('name');
    }
  };

  const handleCreateReservation = () => {
    const reservationData: ReservationData = {
      tableNumber,
      guests: selectedGuests,
      time: selectedTime,
      name: guestName,
      date: selectedDate, // Include the selected date
      notes: notes,
    };

    onReservationCreate?.(reservationData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Nueva Reserva</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-wrap border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            {/* Date Step Button */}
            <button
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-b-2 whitespace-nowrap ${
                currentStep === 'date' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">{getFormattedDate(selectedDate)}</span>
            </button>

            {/* Guests Step Button */}
            <button
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-b-2 whitespace-nowrap ${
                currentStep === 'guests' ? 'border-orange-500 text-orange-600' : currentStep === 'date' ? 'text-gray-500 border-transparent' : 'text-gray-400 border-transparent'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs sm:text-sm">{selectedGuests ? `${selectedGuests} Invitado${selectedGuests > 1 ? 's' : ''}` : 'Invitados'}</span>
            </button>

            {/* Time Step Button */}
            <button
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-b-2 whitespace-nowrap ${
                currentStep === 'time' ? 'border-orange-500 text-orange-600' : 'text-gray-400 border-transparent'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm">{selectedTime || 'Hora'}</span>
            </button>

            {/* Name Step Button */}
            <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-400 whitespace-nowrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs sm:text-sm">Nombre</span>
            </button>
          </div>

          {currentStep === 'date' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Selecciona la fecha</h3>
              <div className="flex justify-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelection}
                  dateFormat="dd/MM/yyyy"
                  inline
                  minDate={new Date()} // Only allow dates from today onwards
                  className="react-datepicker-custom" // Add a custom class for styling if needed
                />
              </div>
            </div>
          )}

          {currentStep === 'guests' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Cantidad de comensales</h3>
              <div className="space-y-2">
                {predefinedOptions.map((guests) => (
                  <button
                    key={guests}
                    onClick={() => handleGuestSelection(guests)}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors ${
                      selectedGuests === guests ? 'bg-orange-50 border-orange-300' : ''
                    }`}
                  >
                    <span className="text-sm sm:text-base text-gray-700">{guests} Invitado{guests > 1 ? 's' : ''}</span>
                  </button>
                ))}

                {showCustomInput ? (
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <label htmlFor="customGuests" className="block text-sm font-medium text-gray-700 mb-2">
                      Número personalizado de invitados:
                    </label>
                    <input
                      type="number"
                      id="customGuests"
                      min="1"
                      max="50"
                      value={customGuests}
                      onChange={handleCustomGuestsChange}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                      placeholder="Ingresa el número"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleCustomGuests}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors text-orange-600"
                  >
                    <span className="text-sm sm:text-base">Otro número de invitados...</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'time' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Selecciona la hora</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelection(time)}
                    className={`px-2 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors text-center ${
                      selectedTime === time ? 'bg-orange-50 border-orange-300 text-orange-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'name' && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Información del cliente</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Nombre del cliente *
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="Ingresa el nombre del cliente"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Notas especiales (opcional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                    placeholder="Ej: Mesa junto a la ventana, celebración especial..."
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen de la reserva:</h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Mesa:</span> {tableNumber}</p>
                    <p><span className="font-medium">Invitados:</span> {selectedGuests}</p>
                    <p><span className="font-medium">Hora:</span> {selectedTime}</p>
                    <p><span className="font-medium">Fecha:</span> {getFormattedDate(selectedDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            {currentStep === 'date' && (
              <button
                onClick={handleContinueFromDate}
                disabled={!selectedDate}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Continuar
              </button>
            )}
            {currentStep === 'guests' && (
              <button
                onClick={handleContinueFromGuests}
                disabled={!selectedGuests || selectedGuests <= 0}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Continuar
              </button>
            )}
            {currentStep === 'time' && (
              <button
                onClick={handleContinueFromTime}
                disabled={!selectedTime}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Continuar
              </button>
            )}
            {currentStep === 'name' && (
              <button
                onClick={handleCreateReservation}
                disabled={!guestName.trim()}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Crear Reserva
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservationModal;