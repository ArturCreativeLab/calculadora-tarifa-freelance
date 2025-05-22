import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import { ARTUR_LAB_NAME } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] p-4">
      <Card className="w-full max-w-2xl text-center">
        <p className="text-sm font-medium text-sky-600 mb-2">Modo Freelancer | {ARTUR_LAB_NAME}</p>
        <h1 className="text-4xl font-bold text-sky-700 mb-6">
          ¡Calcula tu Tarifa Freelance Ideal! 👋
        </h1>
        <p className="text-lg text-slate-600 mb-4">
          Esta herramienta te guiará de forma amigable para que calcules un precio justo y competitivo, basado en tu perfil y el mercado.
        </p>
        <p className="text-slate-500 mb-8">
          Responderás algunas preguntas sencillas sobre tu experiencia y tu forma de trabajar. ¡No te preocupes, no hay respuestas correctas o incorrectas! El objetivo es ayudarte a reflexionar y obtener una tarifa que te motive.
        </p>
        <Button onClick={onStart} size="lg" className="px-10">
          ¡Empecemos! 🚀
        </Button>
      </Card>
       {/* Footer moved to App.tsx for global display, or could be specific here if needed */}
    </div>
  );
};

export default WelcomeScreen;
