import React from 'react';
import { ClientInputData, ClientExperienceLevel, ClientProjectUrgency, ClientProjectVolume } from '../types';
import { CLIENT_EXPERIENCE_LEVEL_OPTIONS, CLIENT_URGENCY_MULTIPLIERS } from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';

interface ClientInputFormProps {
  clientInputData: ClientInputData;
  onUpdateClientInputData: (data: Partial<ClientInputData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ClientInputForm: React.FC<ClientInputFormProps> = ({ clientInputData, onUpdateClientInputData, onSubmit, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
     if (name === "estimatedHoursPerTask") {
        onUpdateClientInputData({ [name]: value ? parseFloat(value) : undefined });
    } else {
        onUpdateClientInputData({ [name]: value as any });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Detalles del Proyecto o Servicio" icon="📋">
        <div className="space-y-6">
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-slate-700 mb-1">
              Nivel de experiencia esperado del freelancer:
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={clientInputData.experienceLevel}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              {Object.entries(CLIENT_EXPERIENCE_LEVEL_OPTIONS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-slate-700 mb-1">
              Urgencia del proyecto:
            </label>
            <select
              id="urgency"
              name="urgency"
              value={clientInputData.urgency}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              {Object.entries(CLIENT_URGENCY_MULTIPLIERS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-slate-700 mb-1">
              Volumen o tipo de trabajo:
            </label>
            <select
              id="volume"
              name="volume"
              value={clientInputData.volume}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value={ClientProjectVolume.ONE_TASK}>Tarea puntual / Proyecto pequeño</option>
              <option value={ClientProjectVolume.SEVERAL_TASKS}>Varias tareas / Proyecto mediano</option>
              <option value={ClientProjectVolume.RECURRENT}>Trabajo recurrente / Colaboración continua</option>
            </select>
          </div>
           <div>
            <label htmlFor="estimatedHoursPerTask" className="block text-sm font-medium text-slate-700 mb-1">
              Horas estimadas (opcional, para una tarea o el total):
            </label>
            <input
              type="number"
              id="estimatedHoursPerTask"
              name="estimatedHoursPerTask"
              value={clientInputData.estimatedHoursPerTask || ''}
              onChange={handleChange}
              placeholder="Ej: 8"
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">Si dejas esto en blanco, usaremos una estimación general.</p>
          </div>


          <div className="flex justify-between items-center mt-8">
            <Button onClick={onBack} variant="outline">
              Anterior
            </Button>
            <Button onClick={onSubmit} size="lg">
              Estimar Rango de Costo 💰
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientInputForm;
