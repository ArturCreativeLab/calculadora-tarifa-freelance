import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import { UserRole } from '../types';
import { MAIN_APP_TITLE, ARTUR_LAB_NAME } from '../constants';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-lg text-center">
        <p className="text-sm font-medium text-sky-600 mb-2">Bienvenido/a a la {MAIN_APP_TITLE}</p>
        <h1 className="text-3xl font-bold text-sky-700 mb-6">
          ¿Cómo podemos ayudarte hoy?
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Selecciona tu rol para acceder a las herramientas y cálculos personalizados:
        </p>
        <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
          <Button 
            onClick={() => onSelectRole(UserRole.FREELANCER)} 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 text-lg"
            variant="primary"
          >
            <span className="text-2xl mr-2">🧑‍💻</span> Soy Freelancer
            <span className="block text-xs mt-1 font-normal">Calcular cuánto cobrar</span>
          </Button>
          <Button 
            onClick={() => onSelectRole(UserRole.CLIENT)} 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 text-lg"
            variant="secondary"
          >
            <span className="text-2xl mr-2">🧑‍💼</span> Soy Cliente
            <span className="block text-xs mt-1 font-normal">Estimar cuánto pagar</span>
          </Button>
        </div>
      </Card>
      <footer className="mt-12 text-center text-sm text-slate-500 px-4">
            <p>&copy; {new Date().getFullYear()} {ARTUR_LAB_NAME}. Todos los derechos reservados.</p>
            <p className="mt-1">Este es un proyecto experimental del {ARTUR_LAB_NAME}. <br/> Buscamos ayudar a freelancers y clientes a entender el valor del trabajo creativo con herramientas justas y abiertas.</p>
        </footer>
    </div>
  );
};

export default RoleSelectionScreen;
