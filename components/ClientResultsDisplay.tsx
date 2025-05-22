import React from 'react';
import { ClientRateEstimate } from '../types';
import { ARTUR_LAB_NAME, MAIN_APP_TITLE, CLIENT_EDUCATIONAL_TIPS, DATA_SOURCES_LIST, CLIENT_EXPERIENCE_LEVEL_OPTIONS, CLIENT_URGENCY_MULTIPLIERS, HOURS_PER_MONTH_REFERENCE } from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';

interface ClientResultsDisplayProps {
  clientRateEstimate: ClientRateEstimate | null;
  onRestart: () => void;
  onChangeSettings: () => void;
}

const ClientResultsDisplay: React.FC<ClientResultsDisplayProps> = ({ clientRateEstimate, onRestart, onChangeSettings }) => {
  if (!clientRateEstimate || !clientRateEstimate.country || !clientRateEstimate.sector) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <Card>
          <p className="text-lg text-slate-600">Calculando estimación para el cliente...</p>
          <p className="text-sm text-slate-500 mt-2">Si esto tarda mucho, por favor intenta reiniciar.</p>
          <Button onClick={onRestart} className="mt-6" variant="outline">Reiniciar</Button>
        </Card>
      </div>
    );
  }

  const { phMinimoEthical, phMedioMarket, recommendedRateRange, urgencyMultiplier, totalEstimatedCost, country, sector } = clientRateEstimate;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: country.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const generateReportText = () => {
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    let report = `ESTIMACIÓN DE COSTO DE SERVICIO FREELANCE – ${MAIN_APP_TITLE} por ${ARTUR_LAB_NAME}\n`;
    report += `[Sello Visual Artur Creative Lab]\n`;
    report += `-----------------------------------------------------------------\n`;
    report += `Fecha de Generación: ${date}\n\n`;
    report += `DATOS DEL SERVICIO BUSCADO:\n`;
    report += `- País del Servicio: ${country.name}\n`;
    report += `- Sector Profesional: ${sector.name}\n\n`;
    // Could add experience level, urgency from clientInputData if passed down
    
    report += `RANGOS DE TARIFA HORARIA ESTIMADOS (en ${country.currencySymbol} ${country.currency}):\n`;
    report += `- Tarifa Mínima Ética de Referencia: ${formatCurrency(phMinimoEthical)} / hora\n`;
    report += `  (Basada en el costo de vida de referencia en ${country.name})\n`;
    report += `- Tarifa Promedio de Mercado (PH Medio): ${formatCurrency(phMedioMarket)} / hora\n`;
    report += `- RANGO RECOMENDADO (según nivel exp.): ${formatCurrency(recommendedRateRange.min)} - ${formatCurrency(recommendedRateRange.max)} / hora\n\n`;

    if (totalEstimatedCost) {
        report += `ESTIMACIÓN DE COSTO TOTAL DEL PROYECTO/TAREA:\n`;
        report += `- Rango Estimado: ${formatCurrency(totalEstimatedCost.min)} - ${formatCurrency(totalEstimatedCost.max)}\n`;
        report += `  (${totalEstimatedCost.explanation})\n\n`;
    }
    
    report += `CONSEJOS PARA CLIENTES:\n`;
    CLIENT_EDUCATIONAL_TIPS.forEach(tip => {
      report += `- ${tip}\n`;
    });
    report += `\n-----------------------------------------------------------------\n`;
    report += `Generado por la ${MAIN_APP_TITLE} de ${ARTUR_LAB_NAME}.\n`;
    report += `Recuerda: estos son valores estimados para ayudarte a planificar.\n`;
    return report;
  };

  const handleCopyToClipboard = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText)
      .then(() => alert('¡Informe copiado al portapapeles!'))
      .catch(err => alert('Error al copiar: ' + err));
  };


  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <Card title="Estimación de Costo de Servicio Freelance" icon="💰">
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-500">Servicio en:</p>
          <p className="text-xl font-semibold text-sky-700">{sector.name} en {country.name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6 text-center">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-700 mb-1">Tarifa Mínima Ética</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(phMinimoEthical)}</p>
            <p className="text-xs text-slate-500">({country.currencySymbol}/hora)</p>
          </div>
          <div className="p-4 bg-sky-50 border-2 border-sky-500 rounded-lg shadow-lg">
            <h4 className="text-sm font-semibold text-sky-700 mb-1">Rango Recomendado por Hora</h4>
            <p className="text-3xl font-bold text-sky-600">
              {formatCurrency(recommendedRateRange.min)} – {formatCurrency(recommendedRateRange.max)}
            </p>
            <p className="text-xs text-slate-500">(Según nivel de experiencia solicitado)</p>
          </div>
        </div>
        
        {totalEstimatedCost && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg text-center">
                <h4 className="text-md font-semibold text-amber-700 mb-1">Estimación de Costo Total del Proyecto/Tarea</h4>
                 <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(totalEstimatedCost.min)} – {formatCurrency(totalEstimatedCost.max)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{totalEstimatedCost.explanation}</p>
            </div>
        )}

        <p className="text-xs text-center text-slate-500 mt-3 mb-2">
          La Tarifa Mínima Ética se basa en el costo de vida de referencia en {country.name}. El Rango Recomendado considera el promedio de mercado (aprox. {formatCurrency(phMedioMarket)}) y el nivel de experiencia que buscas. 
          {urgencyMultiplier > 1 && ` Se ha aplicado un factor de urgencia (${urgencyMultiplier}x).`}
        </p>
      </Card>

      <Card title="Consejos para Contratar Freelancers" icon="🤝">
        <ul className="space-y-3 list-disc list-inside text-slate-600 mb-6">
          {CLIENT_EDUCATIONAL_TIPS.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
        <p className="text-sm text-slate-500">
          Una buena colaboración se basa en la claridad, el respeto mutuo y una compensación justa.
        </p>
      </Card>
      
      <Card title="¿Cómo estimamos estos rangos?" icon="💡" className="bg-slate-50">
        <details>
          <summary className="font-semibold text-sky-700 cursor-pointer hover:underline">
            Entiende la lógica detrás de los números
          </summary>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Nuestra estimación para clientes se basa en:</p>
            <p><strong>1. Tarifa Horaria Mínima Ética (PH_mínimo):</strong> Calculada a partir del salario mínimo de referencia en {country.name} ({formatCurrency(country.minMonthlySalary)}) dividido por {HOURS_PER_MONTH_REFERENCE} horas/mes. Esto es <strong>{formatCurrency(phMinimoEthical)}/hora</strong>.</p>
            <p><strong>2. Tarifa Horaria Media del Mercado (PH_medio):</strong> Es la tarifa promedio estimada para freelancers en {sector.name} en {country.name}. Para este caso: <strong>{formatCurrency(phMedioMarket)}/hora</strong>.</p>
            <p><strong>3. Nivel de Experiencia Solicitado:</strong> Ajustamos el PH_medio según el nivel que buscas (Básico, Profesional, Especializado). Por ejemplo, para un nivel "Experto", el rango será más alto que para un "Básico".</p>
             {/* Example: clientInputData is not directly available here, but we can explain generally */}
            <p><strong>4. Urgencia y Volumen:</strong> Proyectos urgentes pueden implicar un costo mayor. El volumen de trabajo también puede influir en la negociación final.</p>
            <p className="font-semibold mt-2">El Rango Recomendado:</p>
            <p>Te ofrecemos un rango (ej. {formatCurrency(recommendedRateRange.min)} - {formatCurrency(recommendedRateRange.max)}) que intenta equilibrar la tarifa mínima ética con las expectativas del mercado según la experiencia. No es una cifra exacta, sino una guía para tus conversaciones con freelancers.</p>
            
            <div className="mt-4 pt-3 border-t">
              <h5 className="font-semibold text-slate-700">Fuentes de Datos de Referencia:</h5>
              <ul className="list-disc list-inside text-xs">
                {DATA_SOURCES_LIST.map(source => <li key={source.name}>{source.name} {source.url && <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sky-600">(ver más)</a>}</li>)}
              </ul>
            </div>
            <p className="mt-3 text-xs"><em>Nota: Todos los valores son estimaciones con fines educativos. Las tarifas finales se acuerdan entre cliente y freelancer.</em></p>
          </div>
        </details>
      </Card>

      <div className="text-center space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-4">
        <Button onClick={handleCopyToClipboard} variant="outline" className="w-full md:w-auto">
          📋 Copiar Estimación Detallada
        </Button>
        <Button onClick={onChangeSettings} variant="outline" className="w-full md:w-auto">
          ⚙️ Cambiar Parámetros
        </Button>
        <Button onClick={onRestart} className="w-full md:w-auto">
          🔁 Ir al Inicio (Roles)
        </Button>
      </div>
      <p className="text-center text-xs text-slate-400 mt-8">
        {MAIN_APP_TITLE} - Un proyecto de {ARTUR_LAB_NAME}.
      </p>
    </div>
  );
};

export default ClientResultsDisplay;
