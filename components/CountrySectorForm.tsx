
import React, { useState, useEffect } from 'react';
import { Country, Sector, UserData } from '../types';
import { COUNTRIES_DATA, SECTORS_DATA, AVERAGE_HOURLY_RATES_DATA, HOURS_PER_MONTH_REFERENCE } from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';

interface CountrySectorFormProps {
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

const CountrySectorForm: React.FC<CountrySectorFormProps> = ({ userData, onUpdateUserData, onNext }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(userData.countryCode);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(userData.sectorId);
  const [phMinimo, setPhMinimo] = useState<number | null>(null);
  const [phMedio, setPhMedio] = useState<number | null>(null);

  const selectedCountry = COUNTRIES_DATA.find(c => c.code === selectedCountryCode);
  const selectedSector = SECTORS_DATA.find(s => s.id === selectedSectorId);

  useEffect(() => {
    if (selectedCountry) {
      const calculatedMin = selectedCountry.minMonthlySalary / HOURS_PER_MONTH_REFERENCE;
      setPhMinimo(calculatedMin);
    } else {
      setPhMinimo(null);
    }

    if (selectedCountry && selectedSector) {
      const rateKey = `${selectedCountry.code}_${selectedSector.id}`;
      const avgRate = AVERAGE_HOURLY_RATES_DATA[rateKey] || AVERAGE_HOURLY_RATES_DATA[`${selectedCountry.code}_other`] || null; // Fallback to 'other' for country
      setPhMedio(avgRate);
    } else {
      setPhMedio(null);
    }
  }, [selectedCountryCode, selectedSectorId, selectedCountry, selectedSector]);

  const handleNext = () => {
    if (selectedCountryCode && selectedSectorId) {
      onUpdateUserData({ countryCode: selectedCountryCode, sectorId: selectedSectorId });
      onNext();
    }
  };
  
  const formatCurrency = (amount: number, currencySymbol: string) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Cuéntanos sobre ti y tu mercado" icon="🌍">
        <div className="space-y-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
              ¿En qué país resides actualmente?
            </label>
            <select
              id="country"
              value={selectedCountryCode || ''}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="" disabled>Selecciona tu país</option>
              {COUNTRIES_DATA.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-1">
              ¿Cuál es tu profesión o sector freelance principal?
            </label>
            <select
              id="sector"
              value={selectedSectorId || ''}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="" disabled>Selecciona tu sector</option>
              {SECTORS_DATA.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && phMinimo !== null && (
            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-md">
              <p className="text-sm text-sky-700">
                💡 En {selectedCountry.name}, el salario mínimo mensual de referencia es aproximadamente {formatCurrency(selectedCountry.minMonthlySalary, selectedCountry.currencySymbol)}.
                Esto equivale a una tarifa horaria mínima de referencia de <strong>{formatCurrency(phMinimo, selectedCountry.currencySymbol)}</strong> (calculado sobre {HOURS_PER_MONTH_REFERENCE} horas/mes).
              </p>
            </div>
          )}

          {selectedCountry && selectedSector && phMedio !== null && (
             <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
              <p className="text-sm text-amber-700">
                📊 Para el sector de "{selectedSector.name}" en {selectedCountry.name}, la tarifa promedio de mercado que hemos estimado es de unos <strong>{formatCurrency(phMedio, selectedCountry.currencySymbol)}</strong> por hora.
                {selectedCountry.code === 'ES' && (
                  <span className="block mt-1 text-xs text-amber-600">(Valores para España actualizados según datos recientes del mercado freelance.)</span>
                )}
              </p>
            </div>
          )}
          {selectedCountry && selectedSector && phMedio === null && (
             <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <p className="text-sm text-yellow-700">
                ⚠️ No tenemos un dato específico de tarifa promedio para "{selectedSector.name}" en {selectedCountry.name}. Usaremos una estimación general para el país o sector "Otro".
              </p>
            </div>
          )}


          <p className="text-xs text-slate-500 mt-4">
            Estos valores son estimaciones generales y pueden variar. Te recomendamos investigar más a fondo en fuentes locales para obtener datos más precisos.
          </p>

          <Button 
            onClick={handleNext} 
            disabled={!selectedCountryCode || !selectedSectorId}
            fullWidth
            size="lg"
          >
            Siguiente: Perfil Profesional
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CountrySectorForm;
