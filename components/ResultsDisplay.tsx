import React, { useState } from 'react';
import { CalculatedRates, Country, Sector, SptLevel, UserData, ProjectSimulation, MicroLesson } from '../types';
import { 
  COUNTRIES_DATA, 
  SECTORS_DATA, 
  SPT_LEVELS, 
  MAIN_APP_TITLE,
  ARTUR_LAB_NAME, 
  PLATFORM_EXAMPLES_BY_SECTOR, 
  NEW_QUESTION_ID, 
  MAX_PLATFORM_EXAMPLES,
  AVERAGE_HOURLY_RATES_DATA,
  HOURS_PER_MONTH_REFERENCE,
  MICRO_LESSONS_DATA,
  SIMILAR_PROJECTS_HOURS_WARNING_THRESHOLD,
  DATA_SOURCES_LIST
} from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';

interface ResultsDisplayProps {
  rates: CalculatedRates | null;
  countryCode: string | null;
  sectorId: string | null;
  quizAnswers: UserData['quizAnswers'];
  onRestart: () => void;
  onChangeSettings: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ rates, countryCode, sectorId, quizAnswers, onRestart, onChangeSettings }) => {
  const [showProjectSimulator, setShowProjectSimulator] = useState(false);
  const [projectSim, setProjectSim] = useState<ProjectSimulation>({
    estimatedHours: 10,
    numberOfPhases: 1,
    extras: { urgency: false, extendedSupport: false, usageRights: false },
  });
  const [projectSimResult, setProjectSimResult] = useState<number | null>(null);

  const [monthlyProjects, setMonthlyProjects] = useState<number>(1);
  const [showMicroLessons, setShowMicroLessons] = useState<boolean>(false);
  const [currentMicroLesson, setCurrentMicroLesson] = useState<MicroLesson | null>(null);

  if (!rates || !countryCode || !sectorId) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <Card>
          <p className="text-lg text-slate-600">Calculando tus resultados...</p>
          <Button onClick={onRestart} className="mt-6" variant="outline">Reiniciar</Button>
        </Card>
      </div>
    );
  }

  const country = COUNTRIES_DATA.find(c => c.code === countryCode);
  const sector = SECTORS_DATA.find(s => s.id === sectorId);

  if (!country || !sector) {
    return <p className="text-red-500">Error: No se pudieron cargar los datos del país o sector.</p>;
  }

  const formatCurrency = (amount: number, noSymbol: boolean = false) => {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    if (!noSymbol) {
      options.style = 'currency';
      options.currency = country.currency;
    }
    return new Intl.NumberFormat(undefined, options).format(amount);
  };
  
  const sptLevel = SPT_LEVELS.find(level => rates.spt >= level.minSpt && rates.spt <= level.maxSpt) || SPT_LEVELS[0];

  let finalRecommendations = [...sptLevel.recommendations];
  const platformAnswerPoints = quizAnswers[NEW_QUESTION_ID];

  if (platformAnswerPoints !== undefined && platformAnswerPoints <= 1 && sector) { 
    const examples = PLATFORM_EXAMPLES_BY_SECTOR[sector.id] || PLATFORM_EXAMPLES_BY_SECTOR['other'];
    if (examples && examples.length > 0) {
      const platformExamplesText = examples.slice(0, MAX_PLATFORM_EXAMPLES).join(', ');
      const platformRec = `Considera explorar plataformas como ${platformExamplesText} para conectar y mostrar tu trabajo en ${sector.name}.`;
      if (!finalRecommendations.some(rec => rec.includes(platformExamplesText))) { 
        finalRecommendations.push(platformRec);
      }
    }
  }
  
   if (rates.spt >= 70 && !finalRecommendations.some(rec => rec.includes("mercados con mayor potencial"))) {
     finalRecommendations.push("Recuerda que las tarifas promedio varían. Si tu perfil es fuerte pero tu tarifa no es tan alta, investiga nichos de alta demanda o mercados con mayor potencial económico.");
   }

  const handleProjectSimChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setProjectSim(prev => ({
            ...prev,
            extras: { ...prev.extras, [name]: checked }
        }));
    } else {
        setProjectSim(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  };

  const calculateProjectSim = () => {
    let total = rates.tshSugerida * projectSim.estimatedHours;
    if (projectSim.extras.urgency) total *= 1.25; // Example multiplier
    if (projectSim.extras.extendedSupport) total *= 1.15;
    if (projectSim.extras.usageRights) total *= 1.20;
    setProjectSimResult(total);
  };

  const monthlyProjectionHours = projectSim.estimatedHours * monthlyProjects;
  const monthlyProjectionIncome = (projectSimResult || rates.tshSugerida * projectSim.estimatedHours) * monthlyProjects;


  const generateShareableText = () => {
    return `¡Descubrí mi tarifa freelance ideal con la calculadora de ${ARTUR_LAB_NAME}! 🚀\nMi nivel: ${sptLevel.level}\nSector: ${sector.name}\nTarifa Sugerida: ${formatCurrency(rates.tshSugerida)} (${country.currency}/hora)\n#TarifaFreelanceJusta #${ARTUR_LAB_NAME.replace(/\s/g, '')}`;
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(message))
      .catch(err => alert('Error al copiar: ' + err));
  };
  
  const generateReportText = () => {
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    let report = `INFORME DE TARIFA FREELANCE – ${MAIN_APP_TITLE} por ${ARTUR_LAB_NAME}\n`;
    report += `[Sello Visual Artur Creative Lab]\n`;
    report += `-----------------------------------------------------------------\n`;
    report += `Fecha de Generación: ${date}\n\n`;
    report += `DATOS DEL PERFIL FREELANCER:\n`;
    report += `- País: ${country.name}\n`;
    report += `- Sector Freelance: ${sector.name}\n`;
    report += `- Nivel Detectado: ${sptLevel.level} (Puntuación Perfil: ${rates.spt}/100)\n\n`;
    report += `MENSAJE DEL MENTOR VIRTUAL:\n`;
    report += `"${sptLevel.mentorMessage}"\n`;
    report += `Sugerencia Clave: "${sptLevel.mentorTip}"\n\n`;
    report += `TARIFAS SUGERIDAS (por hora en ${country.currencySymbol} ${country.currency}):\n`;
    report += `- Tarifa Mínima Ética: ${formatCurrency(rates.tshMinimaEtica, true)}\n`;
    report += `  (Calculada sobre el costo de vida de referencia en ${country.name})\n`;
    report += `- Tarifa Sugerida (TSH): ${formatCurrency(rates.tshSugerida, true)}\n`;
    if (rates.tshPremium) {
      report += `- Tarifa Premium (Potencial): ${formatCurrency(rates.tshPremium, true)}\n`;
    }
    report += `\nReferencia de Mercado (PH Medio para tu sector/país): ${formatCurrency(rates.phMedio, true)}\n\n`;

    if(showProjectSimulator && projectSimResult) {
        report += `SIMULACIÓN DE PROYECTO:\n`;
        report += `- Horas Estimadas: ${projectSim.estimatedHours} hs\n`;
        report += `- Presupuesto Estimado del Proyecto: ${formatCurrency(projectSimResult, true)}\n\n`;
        report += `PROYECCIÓN MENSUAL (CON ${monthlyProjects} PROYECTO(S) SIMILAR(ES)):\n`;
        report += `- Ingresos Brutos Estimados: ${formatCurrency(monthlyProjectionIncome, true)}\n`;
        report += `- Horas Totales Estimadas: ${monthlyProjectionHours} hs/mes\n\n`;
    }

    report += `RECOMENDACIONES PERSONALIZADAS:\n`;
    finalRecommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += `\n-----------------------------------------------------------------\n`;
    report += `Generado por la ${MAIN_APP_TITLE} de ${ARTUR_LAB_NAME}.\n`;
    report += `Recuerda: estos son valores estimados. ¡Sigue investigando y aprendiendo!\n`;
    return report;
  };
  
  const spainMarketInfo = country.code === 'ES' ? `En España, para tu sector "${sector.name}", usamos una PH_medio de ${formatCurrency(rates.phMedio)}. Estos valores son estimaciones actualizadas.` : "";

  const marketComparisonText = () => {
    if (rates.phMedio <= 0) return "";
    const diff = ((rates.tshSugerida - rates.phMedio) / rates.phMedio) * 100;
    if (diff > 5) return `¡Excelente! Tu tarifa sugerida está un ${diff.toFixed(0)}% por encima del promedio de tu mercado (${formatCurrency(rates.phMedio)}).`;
    if (diff < -5) return `Tu tarifa sugerida está un ${Math.abs(diff).toFixed(0)}% por debajo del promedio (${formatCurrency(rates.phMedio)}). ¡Potencial de crecimiento!`;
    return `Tu tarifa sugerida está alineada con el promedio de tu mercado (${formatCurrency(rates.phMedio)}).`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <Card title="¡Tu Cálculo de Tarifa Freelance!" icon="🎉">
        {/* ... (Profile Info, Mentor Message - same as before) ... */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-500">Tu especialidad:</p>
          <p className="text-xl font-semibold text-sky-700">{sector.name}</p>
          <p className="text-sm text-slate-500 mt-3">Nivel de perfil detectado (Puntuación: {rates.spt}/100):</p>
          <p className="text-xl font-semibold text-sky-700">{sptLevel.level}</p>
        </div>

        <div className="mb-6 p-4 bg-sky-50 border-l-4 border-sky-500 rounded-md">
            <h4 className="text-md font-semibold text-sky-700 mb-1">Mentor Virtual Dice:</h4>
            <p className="text-slate-700 text-sm">"{sptLevel.mentorMessage}"</p>
            <p className="text-slate-600 text-xs mt-2"><em>Sugerencia Clave: {sptLevel.mentorTip}</em></p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-2 text-center">
          {/* ... (Rate cards - TSH Minima, Sugerida, Premium - same as before) ... */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-700 mb-1">💡 Tarifa Mínima Ética</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(rates.tshMinimaEtica)}</p>
            <p className="text-xs text-slate-500">({country.currencySymbol}/hora)</p>
          </div>
          <div className="p-4 bg-sky-50 border-2 border-sky-500 rounded-lg shadow-lg">
            <h4 className="text-sm font-semibold text-sky-700 mb-1">⚖️ Tarifa Sugerida (TSH)</h4>
            <p className="text-3xl font-bold text-sky-600">{formatCurrency(rates.tshSugerida)}</p>
            <p className="text-xs text-slate-500">({country.currencySymbol}/hora)</p>
          </div>
          {rates.tshPremium && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-700 mb-1">🚀 Tarifa Premium</h4>
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(rates.tshPremium)}</p>
              <p className="text-xs text-slate-500">({country.currencySymbol}/hora)</p>
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-center mt-1">{marketComparisonText()}</p>
        <p className="text-xs text-center text-slate-500 mt-3 mb-2">
          La Mínima Ética considera el costo de vida en {country.name}. La Sugerida refleja tu perfil y el PH_medio ({formatCurrency(rates.phMedio)}) de tu mercado.
          {rates.tshPremium && ` La Premium es para perfiles ${sptLevel.level} (SPT > 89).`} {spainMarketInfo}
        </p>
      </Card>

      {/* Project Simulator */}
      <Card title="Simulador de Proyecto y Proyección Mensual" icon="🧮">
        <label className="inline-flex items-center cursor-pointer mb-4">
          <input type="checkbox" checked={showProjectSimulator} onChange={() => setShowProjectSimulator(!showProjectSimulator)} className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activar Simulador de Proyecto</span>
        </label>

        {showProjectSimulator && (
          <div className="space-y-4 mb-6 p-4 border border-slate-200 rounded-lg">
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-slate-700">Horas Estimadas para el Proyecto:</label>
              <input type="number" name="estimatedHours" id="estimatedHours" value={projectSim.estimatedHours} onChange={handleProjectSimChange} className="mt-1 p-2 w-full border-slate-300 rounded-md shadow-sm"/>
            </div>
            {/* Extras can be added here as checkboxes */}
             <Button onClick={calculateProjectSim} fullWidth>Calcular Presupuesto del Proyecto</Button>
            {projectSimResult !== null && (
              <div className="mt-4 p-3 bg-sky-50 rounded-md">
                <p className="text-lg font-semibold text-sky-700">Presupuesto Estimado del Proyecto: {formatCurrency(projectSimResult)}</p>
              </div>
            )}
            
            {/* Monthly Projection */}
            {projectSimResult !== null && (
                <div className="mt-6 pt-4 border-t">
                    <h4 className="text-md font-semibold text-slate-700 mb-2">Proyección Mensual:</h4>
                    <label htmlFor="monthlyProjects" className="block text-sm font-medium text-slate-700">¿Cuántos proyectos así harías al mes?</label>
                    <input type="number" name="monthlyProjects" id="monthlyProjects" value={monthlyProjects} onChange={(e) => setMonthlyProjects(parseInt(e.target.value) || 1)} className="mt-1 p-2 w-full border-slate-300 rounded-md shadow-sm"/>
                    <div className="mt-3 p-3 bg-amber-50 rounded-md">
                        <p>Ingresos Brutos Estimados: <strong>{formatCurrency(monthlyProjectionIncome)}</strong></p>
                        <p>Horas Totales Estimadas: <strong>{monthlyProjectionHours} hs/mes</strong></p>
                        {monthlyProjectionHours > SIMILAR_PROJECTS_HOURS_WARNING_THRESHOLD && (
                            <p className="text-red-600 text-xs mt-1">¡Atención! Esto supera las {SIMILAR_PROJECTS_HOURS_WARNING_THRESHOLD} horas mensuales. Considera ajustar tu carga o tarifa.</p>
                        )}
                    </div>
                </div>
            )}
          </div>
        )}
      </Card>

      <Card title="Próximos Pasos y Recomendaciones" icon="🧭">
         {/* ... (Recommendations - same as before) ... */}
        <ul className="space-y-3 list-disc list-inside text-slate-600 mb-6">
          {finalRecommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-4">
            <Button onClick={() => setShowMicroLessons(true)} variant="outline" size="sm">Ver Micro-Lecciones 💡</Button>
            <Button onClick={() => copyToClipboard(generateShareableText(), "¡Texto para redes copiado!")} variant="outline" size="sm">Compartir Resumen 🔗</Button>
        </div>
      </Card>

      {/* MicroLessons Modal/Section */}
      {showMicroLessons && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card title={currentMicroLesson ? currentMicroLesson.title : "Micro-Lecciones Freelance"} icon="🎓" className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {!currentMicroLesson ? (
              <ul className="space-y-2">
                {MICRO_LESSONS_DATA.map(lesson => (
                  <li key={lesson.id}>
                    <Button onClick={() => setCurrentMicroLesson(lesson)} fullWidth variant='outline'>{lesson.title}</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="text-slate-600 whitespace-pre-line">{currentMicroLesson.content}</p>
                {currentMicroLesson.link && currentMicroLesson.linkText && (
                  <a href={currentMicroLesson.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 underline mt-2 block">
                    {currentMicroLesson.linkText}
                  </a>
                )}
                <Button onClick={() => setCurrentMicroLesson(null)} className="mt-4" variant="secondary">Volver a Lecciones</Button>
              </div>
            )}
            <Button onClick={() => {setShowMicroLessons(false); setCurrentMicroLesson(null);}} className="mt-4" fullWidth>Cerrar</Button>
          </Card>
        </div>
      )}


      <Card title="¿Cómo calculamos tu tarifa?" icon="💡" className="bg-slate-50">
        {/* ... (Educational Content - same as before, but maybe add sources link) ... */}
        <details>
          <summary className="font-semibold text-sky-700 cursor-pointer hover:underline">
            Entiende la lógica detrás de los números (¡sin magia!)
          </summary>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Tu tarifa sugerida se calcula combinando tres factores clave:</p>
            <p><strong>1. Tarifa Horaria Mínima de Referencia (PH_mínimo):</strong> Es tu punto de partida. Lo calculamos dividiendo el salario mínimo mensual de referencia en {country.name} ({formatCurrency(country.minMonthlySalary)}) por {HOURS_PER_MONTH_REFERENCE} horas/mes. Esto da una base de <strong>{formatCurrency(rates.phMinimo)}/hora</strong>.</p>
            <p><strong>2. Tarifa Horaria Media del Mercado (PH_medio):</strong> Estimamos la tarifa promedio en tu sector ({sector.name}) y país ({country.name}). Para ti, es de unos <strong>{formatCurrency(rates.phMedio)}/hora</strong>.</p>
            <p><strong>3. Tu Perfil Profesional (SPT - Puntuación Total):</strong> Tus respuestas al cuestionario dan una puntuación (tu SPT es {rates.spt}/100) que refleja tu experiencia, portafolio, etc. ¡Es tu "factor X"!</p>
            <p className="font-semibold mt-2">La Fórmula (Simplificada):</p>
            <p><code>Tu Tarifa Sugerida = PH_mínimo + ((PH_medio - PH_mínimo) × (Tu SPT / 100))</code></p>
            <p>Partimos de tu PH_mínimo y sumamos una porción de la diferencia entre el PH_medio y tu PH_mínimo, según tu SPT. Si tu SPT es alto, tu tarifa se acerca más al PH_medio.</p>
            <p><strong>⚠️ Nunca por debajo del mínimo:</strong> Cobrar bajo tu Tarifa Mínima Ética ({formatCurrency(rates.tshMinimaEtica)}) puede ser insostenible.</p>
            <p><strong>🚀 Hacia la Tarifa Premium:</strong> Si tu perfil es excepcional (SPT > 89), como el tuyo ({rates.spt}/100), puedes aspirar a +25% sobre tu Tarifa Sugerida.</p>
            <div className="mt-4 pt-3 border-t">
              <h5 className="font-semibold text-slate-700">Fuentes de Datos de Referencia:</h5>
              <ul className="list-disc list-inside text-xs">
                {DATA_SOURCES_LIST.map(source => <li key={source.name}>{source.name} {source.url && <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sky-600">(ver más)</a>}</li>)}
              </ul>
            </div>
            <p className="mt-3 text-xs"><em>Nota: Todos los valores son estimaciones con fines educativos.</em></p>
          </div>
        </details>
      </Card>
      
      <div className="text-center space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-4">
        {/* ... (Action Buttons - Copiar Informe, Cambiar Config, Repetir Test - same as before) ... */}
         <Button onClick={() => copyToClipboard(generateReportText(), "¡Informe detallado copiado al portapapeles!")} variant="outline" className="w-full md:w-auto">
          📋 Copiar Informe Detallado
        </Button>
        <Button onClick={onChangeSettings} variant="outline" className="w-full md:w-auto">
          ⚙️ Cambiar País/Sector
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

export default ResultsDisplay;