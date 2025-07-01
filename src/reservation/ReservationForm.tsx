import React, { useState } from 'react';
import logo from '../assets/pandawok-brown.png';

const ReservationForm: React.FC = () => {
  const [selectedPeople, setSelectedPeople] = useState('2');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('12:30 pm');
  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    comments: '',
    acceptTerms: false
  });
  const [selectedCountry, setSelectedCountry] = useState('CL');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [modifiedData, setModifiedData] = useState({
    people: '',
    date: '',
    time: '',
    phone: '',
    email: '',
    comments: ''
  });

  const timeSlots = [
    '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
    '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm'
  ];

  const countries = [
    { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
    { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
    { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
    { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
    { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
    { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
    { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
    { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
    { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
    { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
    { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
    { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
    { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
    { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
    { code: 'KR', name: 'Corea del Sur', dialCode: '+82', flag: '🇰🇷' }
  ];

  const selectedCountryData = countries.find(country => country.code === selectedCountry) || countries[0];

  const isLargeGroup = parseInt(selectedPeople) >= 20;

  const handleRequestReservation = () => {
    setShowRequestForm(true);
  };

  const handleBackToSelection = () => {
    setShowRequestForm(false);
  };

  const handleContinueReservation = () => {
    setShowConfirmForm(true);
  };

  const handleConfirmReservation = () => {
    setShowSuccessScreen(true);
  };

  const handleModifyReservation = () => {
    console.log('Modify button clicked');
    setModifiedData({
      people: selectedPeople,
      date: selectedDate,
      time: selectedTime,
      phone: getPhoneNumber(),
      email: formData.email,
      comments: formData.comments
    });
    setShowSuccessScreen(false);
    setShowModifyForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value;
    const fullPhone = `${selectedCountryData.dialCode} ${phoneNumber}`;
    setFormData(prev => ({
      ...prev,
      phone: fullPhone
    }));
  };

  const getPhoneNumber = () => {
    if (!formData.phone) return '';
    const dialCode = selectedCountryData.dialCode;
    return formData.phone.startsWith(dialCode) 
      ? formData.phone.slice(dialCode.length).trim()
      : formData.phone;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const formatDateSpanish = (day: number, month: number, year: number) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(year, month, day);
    return `${days[date.getDay()]}, ${months[month]} ${day}`;
  };

  const handleDateSelect = (day: number) => {
    const selectedDateFormatted = formatDateSpanish(day, currentMonth.getMonth(), currentMonth.getFullYear());
    
    if (showModifyForm) {
      setModifiedData(prev => ({ ...prev, date: selectedDateFormatted }));
    } else {
      setSelectedDate(selectedDateFormatted);
    }
    
    setShowDatePicker(false);
  };

  const handleMonthYearSelect = (month: number, year: number) => {
    setCurrentMonth(new Date(year, month));
    setShowMonthYearPicker(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderMonthYearPicker = () => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowMonthYearPicker(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-800">Seleccionar fecha</h3>
          <div className="w-7"></div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
          <div className="grid grid-cols-5 gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleMonthYearSelect(currentMonthIndex, year)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  year === currentYear
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthYearSelect(index, currentYear)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  index === currentMonthIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getAvailableDates = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1);
    
    return { today, maxDate };
  };

  React.useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = formatDateSpanish(tomorrow.getDate(), tomorrow.getMonth(), tomorrow.getFullYear());
      setSelectedDate(formattedDate);
    }
  }, []);

 
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCountryDropdown) {
        const target = event.target as HTMLElement;
        const dropdown = target.closest('.country-dropdown-container');
        if (!dropdown) {
          setShowCountryDropdown(false);
        }
      }
      
      if (showDatePicker) {
        const target = event.target as HTMLElement;
        const datePicker = target.closest('.date-picker-container');
        if (!datePicker) {
          setShowDatePicker(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown, showDatePicker]);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long' });
    
    const days = [];
    const { today, maxDate } = getAvailableDates();
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8 sm:w-9 sm:h-9"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today;
      const isFuture = currentDate > maxDate;
      const isAvailable = !isPast && !isFuture;
      
      const isSelected = selectedDate && (() => {
        try {
          const parts = selectedDate.split(', ');
          if (parts.length === 2) {
            const dayPart = parts[1].split(' ');
            const selectedDay = parseInt(dayPart[1]);
            const selectedMonthName = dayPart[0];
            
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const selectedMonthIndex = monthNames.indexOf(selectedMonthName);
            
            return day === selectedDay && 
                   currentMonth.getMonth() === selectedMonthIndex &&
                   currentMonth.getFullYear() === currentMonth.getFullYear();
          }
        } catch (error) {
          console.log('Error parsing date:', error);
        }
        return false;
      })();
      
      days.push(
        <button
          key={day}
          onClick={() => isAvailable ? handleDateSelect(day) : null}
          disabled={!isAvailable}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : isAvailable
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 sm:p-4 z-50 w-full sm:w-72 max-w-sm">
        {showMonthYearPicker ? (
          <div className="bg-white">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowMonthYearPicker(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">Seleccionar fecha</h3>
              <div className="w-6"></div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Año</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
                {[today.getFullYear(), today.getFullYear() + 1].map(year => (
                  <button
                    key={year}
                    onClick={() => handleMonthYearSelect(currentMonth.getMonth(), year)}
                    className={`p-1.5 rounded text-xs transition-colors ${
                      year === currentMonth.getFullYear()
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mes</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, index) => {
                  const monthDate = new Date(currentMonth.getFullYear(), index, 1);
                  const isValidMonth = monthDate >= new Date(today.getFullYear(), today.getMonth(), 1) && 
                                     monthDate <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
                  
                  if (!isValidMonth) return null;
                  
                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthYearSelect(index, currentMonth.getFullYear())}
                      className={`p-1.5 rounded text-xs transition-colors ${
                        index === currentMonth.getMonth()
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setShowMonthYearPicker(true)}
                className="text-sm sm:text-base font-semibold text-gray-800 capitalize hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {monthName} {currentMonth.getFullYear()}
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-0.5">
              {days}
            </div>
          </>
        )}
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#211B17' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reserva confirmada</h1>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-6">
              Pronto estarás recibiendo un correo de confirmación con los datos de tu reserva.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons text-gray-600 text-xl">location_on</span>
              <span className="text-gray-800 font-medium">Panda Wok Valparaíso</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">person</span>
                <span className="text-gray-800">{selectedPeople} Persona{parseInt(selectedPeople) > 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">calendar_today</span>
                <span className="text-gray-800">{selectedDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">access_time</span>
                <span className="text-gray-800">{selectedTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h4 className="text-orange-800 font-semibold mb-2">Información importante que debes saber</h4>
            <p className="text-orange-700 text-sm mb-3">
              Esta reserva tendrá una tolerancia máxima de 15 minutos. Por favor llámanos si no vas a poder llegar a tiempo.
            </p>
            <p className="text-orange-700 text-sm font-medium mb-2">Notas Adicionales</p>
            <p className="text-orange-700 text-sm mb-2">
              <strong>En comentarios puedes ingresar preferencia de ubicación de mesa, lejos o cerca del escenario.</strong>
            </p>
            <p className="text-orange-700 text-sm">
              Recuerde que el tiempo límite de permanencia es de 3 horas.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons text-gray-600 text-xl">cake</span>
              <span className="text-gray-800 font-medium">
                Ingresa tu fecha de cumpleaños si deseas recibir promociones y cortesías para esa fecha. (opcional)
              </span>
            </div>
            
            <div className="flex gap-4">
              <select className="flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              
              <select className="flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                <option value="">Mes</option>
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Enviar
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleModifyReservation}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Modificar reserva
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showModifyForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#211B17' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="Panda wok" className="h-12 w-auto" />
              <span className="text-xl font-semibold text-gray-800">Panda Wok Valparaíso</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-800">{modifiedData.people || selectedPeople} Persona{parseInt(modifiedData.people || selectedPeople) > 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-800">{modifiedData.date || selectedDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-800">{modifiedData.time || selectedTime}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {formData.firstName && formData.lastName 
                ? `${formData.firstName} ${formData.lastName}` 
                : 'Usuario'}
            </h3>
          </div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="relative country-dropdown-container">
                  <div className="flex h-12">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg min-w-[100px] h-full outline-none"
                    >
                      <span className="text-sm mr-2">🇨🇱</span>
                      <span className="text-sm text-gray-600 mr-2">+56</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={modifiedData.phone}
                      onChange={(e) => setModifiedData(prev => ({ ...prev, phone: e.target.value }))
                      }
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none h-full"
                    />
                  </div>
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country.code);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-left"
                        >
                          <span className="text-lg mr-3">{country.flag}</span>
                          <span className="text-sm text-gray-700 mr-2">{country.dialCode}</span>
                          <span className="text-sm text-gray-600">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  value={modifiedData.email}
                  onChange={(e) => setModifiedData(prev => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none h-12"
                  placeholder="test@gmail.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm text-gray-500 mb-1">Fecha</label>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-400 outline-none text-left"
                >
                  {modifiedData.date || selectedDate}
                </button>
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-1 z-50 date-picker-container">
                    {renderCalendar()}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Hora</label>
                <select 
                  value={modifiedData.time || selectedTime}
                  onChange={(e) => setModifiedData(prev => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-all duration-200 hover:border-gray-400 outline-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Persona</label>
                <select 
                  value={modifiedData.people || selectedPeople}
                  onChange={(e) => setModifiedData(prev => ({ ...prev, people: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-all duration-200 hover:border-gray-400 outline-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
                >
                  {Array.from({ length: 149 }, (_, i) => i + 2).map(num => (
                    <option key={num} value={num.toString()}>
                      {num} Persona{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <textarea
                name="comments"
                value={modifiedData.comments}
                onChange={(e) => setModifiedData(prev => ({ ...prev, comments: e.target.value }))
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none resize-none"
                placeholder="Comentario (opcional)"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => {
                setShowModifyForm(false);
                setShowSuccessScreen(true);
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar reserva
            </button>
            <button 
              onClick={() => {
                if (modifiedData.people) setSelectedPeople(modifiedData.people);
                if (modifiedData.date) setSelectedDate(modifiedData.date);
                if (modifiedData.time) setSelectedTime(modifiedData.time);
                if (modifiedData.email) setFormData(prev => ({ ...prev, email: modifiedData.email }));
                if (modifiedData.comments) setFormData(prev => ({ ...prev, comments: modifiedData.comments }));
                
                alert('Reserva modificada exitosamente');
                setShowModifyForm(false);
                setShowSuccessScreen(true);
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Modificar reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showRequestForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#211B17' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToSelection}
              className="p-2 hover:bg-orange-100 rounded-lg transition-colors mr-4"
            >
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Panda wok" className="h-12 w-auto" />
              <span className="text-xl font-semibold text-gray-800">Panda Wok Valparaíso</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">Solicitud de reserva</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <label className="block text-sm text-gray-500 mb-1">Personas</label>
              <select 
                value={selectedPeople} 
                onChange={(e) => setSelectedPeople(e.target.value)}
                className="w-full p-3 border-2 border-orange-500 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-all duration-200 hover:border-orange-300 outline-none text-center font-medium text-gray-800"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f97316' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
              >
                {Array.from({ length: 149 }, (_, i) => i + 2).map(num => (
                  <option key={num} value={num.toString()}>
                    {num} Persona{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center relative">
              <label className="block text-sm text-gray-500 mb-1">Fecha</label>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full p-3 border-2 border-orange-500 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 outline-none font-medium text-gray-800"
              >
                {selectedDate}
              </button>
              {showDatePicker && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 date-picker-container">
                  {renderCalendar()}
                </div>
              )}
            </div>
            <div className="text-center">
              <label className="block text-sm text-gray-500 mb-1">Hora</label>
              <select 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border-2 border-orange-500 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-all duration-200 hover:border-orange-300 outline-none text-center font-medium text-gray-800"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-700 text-sm text-center">
              Deja tus datos y nos comunicaremos contigo cuando confirmemos disponibilidad.
            </p>
          </div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none"
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <div className="relative country-dropdown-container">
                  <div className="flex h-12">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg min-w-[75px] h-full outline-none"
                    >
                      <span className="text-sm mr-1">{selectedCountryData.flag}</span>
                      <span className="text-xs text-gray-600 mr-1">{selectedCountryData.dialCode}</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={getPhoneNumber()}
                      onChange={handlePhoneChange}
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none h-full"
                      placeholder="942978432"
                    />
                  </div>
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            const currentPhoneNumber = getPhoneNumber();
                            setSelectedCountry(country.code);
                            if (currentPhoneNumber) {
                              const newFullPhone = `${country.dialCode} ${currentPhoneNumber}`;
                              setFormData(prev => ({ ...prev, phone: newFullPhone }));
                            }
                            setShowCountryDropdown(false);
                          }}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-left"
                        >
                          <span className="text-lg mr-3">{country.flag}</span>
                          <span className="text-sm text-gray-700 mr-2">{country.dialCode}</span>
                          <span className="text-sm text-gray-600">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none h-12"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (opcional)</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none resize-none"
                placeholder="Deja aquí cualquier comentario adicional para tu reserva..."
              />
            </div>
          </div>

          <div className="text-center">
            <button 
              disabled={!formData.firstName || !formData.lastName || !formData.email}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
            >
              Solicitar Reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#211B17' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setShowConfirmForm(false)}
              className="p-2 hover:bg-orange-100 rounded-lg transition-colors mr-4"
            >
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Panda wok" className="h-12 w-auto" />
              <span className="text-xl font-semibold text-gray-800">Panda Wok Valparaíso</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">person</span>
                <span className="text-gray-800">{selectedPeople} Persona{parseInt(selectedPeople) > 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">calendar_today</span>
                <span className="text-gray-800">{selectedDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">access_time</span>
                <span className="text-gray-800">{selectedTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h4 className="text-orange-800 font-semibold mb-2">Información importante que debes saber</h4>
            <p className="text-orange-700 text-sm mb-3">
              Esta reserva tendrá una tolerancia máxima de 15 minutos. Por favor llámanos si no vas a poder llegar a tiempo.
            </p>
            <p className="text-orange-700 text-sm font-medium mb-2">Notas Adicionales</p>
            <p className="text-orange-700 text-sm mb-2">
              <strong>En comentarios puedes ingresar preferencia de ubicación de mesa, lejos o cerca del escenario.</strong>
            </p>
            <p className="text-orange-700 text-sm">
              Recuerde que el tiempo límite de permanencia es de 3 horas.
            </p>
          </div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none"
                  placeholder="Prueba"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none"
                  placeholder="Latasoft"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <div className="relative country-dropdown-container">
                  <div className="flex h-12">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg min-w-[75px] h-full outline-none"
                    >
                      <span className="text-sm mr-1">{selectedCountryData.flag}</span>
                      <span className="text-xs text-gray-600 mr-1">{selectedCountryData.dialCode}</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={getPhoneNumber()}
                      onChange={handlePhoneChange}
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none h-full"
                      placeholder="942978432"
                    />
                  </div>
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            const currentPhoneNumber = getPhoneNumber();
                            setSelectedCountry(country.code);
                            if (currentPhoneNumber) {
                              const newFullPhone = `${country.dialCode} ${currentPhoneNumber}`;
                              setFormData(prev => ({ ...prev, phone: newFullPhone }));
                            }
                            setShowCountryDropdown(false);
                          }}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-left"
                        >
                          <span className="text-lg mr-3">{country.flag}</span>
                          <span className="text-sm text-gray-700 mr-2">{country.dialCode}</span>
                          <span className="text-sm text-gray-600">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none h-12"
                  placeholder="test@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (opcional)</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200 outline-none resize-none"
                placeholder="Comentario (opcional)"
              />
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleConfirmReservation}
              disabled={!formData.firstName || !formData.lastName || !formData.email}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#211B17' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Panda wok" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Panda Wok Valparaíso</h1>
          <p className="text-gray-600">Reserva tu mesa online</p>
        </div>

        {showInfoAlert && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 relative">
            <div className="flex gap-3">
              <div className="text-orange-500 text-xl">ℹ️</div>
              <div className="flex-1">
                <h4 className="text-orange-800 font-semibold mb-2">Información importante que debes saber</h4>
                <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                  <li>Si tu reserva es mayor a 20 personas se debe realizar un abono del 50%</li>
                  <li>Tiempo de permanencia en el restaurante de 3 horas.</li>
                </ul>
              </div>
            </div>
            <button 
              className="absolute top-2 right-3 text-orange-400 hover:text-orange-600 text-xl p-1 transition-colors"
              onClick={() => setShowInfoAlert(false)}
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Personas</label>
            <select 
              value={selectedPeople} 
              onChange={(e) => setSelectedPeople(e.target.value)}
              className="w-full p-4 border-2 border-orange-500 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none transition-all duration-200 hover:border-orange-300 outline-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f97316' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
            >
              {Array.from({ length: 149 }, (_, i) => i + 2).map(num => (
                <option key={num} value={num.toString()}>
                  {num} Persona{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Fecha</label>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full p-4 border-2 border-orange-500 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 text-left flex items-center justify-between outline-none"
            >
              <span className="text-gray-800">{selectedDate}</span>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 8 4 4 4-4" />
              </svg>
            </button>
            {showDatePicker && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 date-picker-container">
                {renderCalendar()}
              </div>
            )}
          </div>
        </div>

        {isLargeGroup && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
            <div className="flex gap-3">
              <div className="text-blue-500 text-xl">⚠️</div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm mb-3">
                  La cantidad de personas en tu grupo supera el límite para reservas en línea.
                </p>
                <p className="text-gray-800 font-semibold text-sm mb-3">
                  Te invitamos a solicitar una reserva para grupos grandes.
                </p>
                <button 
                  onClick={handleRequestReservation}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Solicitar Reserva de Grupo
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLargeGroup && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Selecciona tu horario preferido</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`p-4 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                    selectedTime === time 
                      ? 'text-white shadow-xl scale-105' 
                      : 'text-white hover:shadow-lg'
                  }`}
                  style={{ 
                    backgroundColor: selectedTime === time ? '#8B4513' : '#3C2022',
                    boxShadow: selectedTime === time ? '0 10px 25px rgba(139, 69, 19, 0.3)' : '0 4px 15px rgba(60, 32, 34, 0.2)'
                  }}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTime && !isLargeGroup && (
          <div className="text-center">
            <button 
              onClick={handleContinueReservation}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Continuar con la Reserva
            </button>
          </div>
        )}
      </div>
      
      {showDatePicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default ReservationForm;