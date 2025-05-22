import React, { useState, useEffect } from 'react';
import { Country, Sector, ClientInputData } from '../types';
import { COUNTRIES_DATA, SECTORS_DATA, AVERAGE_HOURLY_RATES_DATA, HOURS_PER_MONTH_REFERENCE } from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';

interface ClientCountrySectorFormProps {
  clientInputData: ClientInputData;
  onUpdateClientInputData: (data: Partial<ClientInputData>) => void;
  onNext: () => void;
}

const ClientCountrySectorForm: React.FC<ClientCountrySectorFormProps> = ({ clientInputData, onUpdateClientInputData, onNext }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(clientInputData.countryCode);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(clientInputData.sectorId);
  
  const selectedCountry = COUNTRIES_DATA.find(c => c.code === selectedCountryCode);
  const selectedSector = SECTORS_DATA.find(s => s.id === selectedSectorId);

  const [phMinimoPreview, setPhMinimoPreview] = useState<string | null>(null);
  const [phMedioPreview, setPhMedioPreview] = useState<string | null>(null);

  const formatCurrency = (amount: number, currencySymbol: string) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  useEffect(() => {
    if (selectedCountry) {
        const minRate = selectedCountry.minMonthlySalary / HOURS_PER_MONTH_REFERENCE;
        setPhMinimoPreview(formatCurrency(minRate, selectedCountry.currencySymbol));
    } else {
        setPhMinimoPreview(null);
    }

    if (selectedCountry && selectedSector) {
        const rateKey = `${selectedCountry.code}_${selectedSector.id}`;
        const avgRate = AVERAGE_HOURLY_RATES_DATA[rateKey] || AVERAGE_HOURLY_RATES_DATA[`${selectedCountry.code}_other`];
        if (avgRate) {
            setPhMedioPreview(formatCurrency(avgRate, selectedCountry.currencySymbol));
        } else {
            setPhMedioPreview("Dato no disponible, se usará estimación general.");
        }
    } else {
        setPhMedioPreview(null);
    }
  }, [selectedCountryCode, selectedSectorId, selectedCountry, selectedSector]);


  const handleNext = () => {
    if (selectedCountryCode && selectedSectorId) {
      onUpdateClientInputData({ countryCode: selectedCountryCode, sectorId: selectedSectorId });
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Contexto del Servicio Requerido" icon="🌍">
        <p className="text-sm text-slate-600 mb-6">Para estimar un rango de tarifa justo, necesitamos saber dónde buscas el servicio y qué tipo de profesional necesitas.</p>
        <div className="space-y-6">
          <div>
            <label htmlFor="client_country" className="block text-sm font-medium text-slate-700 mb-1">
              País donde buscas el servicio:
            </label>
            <select
              id="client_country"
              value={selectedCountryCode || ''}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="" disabled>Selecciona un país</option>
              {COUNTRIES_DATA.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="client_sector" className="block text-sm font-medium text-slate-700 mb-1">
              Sector o tipo de servicio profesional:
            </label>
            <select
              id="client_sector"
              value={selectedSectorId || ''}
              onChange={(e) => setSelectedSectorId(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="" disabled>Selecciona un sector</option>
              {SECTORS_DATA.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
           {phMinimoPreview && (
             <div className="bg-sky-50 border-l-4 border-sky-500 p-3 rounded-md text-xs">
               <p className="text-sky-700">En {selectedCountry?.name}, la tarifa horaria mínima ética de referencia es aprox. <strong>{phMinimoPreview}</strong>.</p>
             </div>
           )}
           {phMedioPreview && selectedSector && (
             <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-md text-xs">
               <p className="text-amber-700">Para "{selectedSector.name}" en {selectedCountry?.name}, la tarifa promedio de mercado estimada es aprox. <strong>{phMedioPreview}</strong>.</p>
             </div>
           )}

          <Button 
            onClick={handleNext} 
            disabled={!selectedCountryCode || !selectedSectorId}
            fullWidth
            size="lg"
          >
            Siguiente: Detalles del Proyecto
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ClientCountrySectorForm;
