import React, { useState, useEffect, useCallback } from 'react';
// Fix: Import ClientProjectVolume
import { AppScreen, UserData, CalculatedRates, Country, Sector, UserRole, ClientInputData, ClientRateEstimate, ClientExperienceLevel, ClientProjectUrgency, ClientProjectVolume } from './types';
import { 
  COUNTRIES_DATA, 
  SECTORS_DATA, 
  AVERAGE_HOURLY_RATES_DATA, 
  QUIZ_QUESTIONS_DATA, 
  HOURS_PER_MONTH_REFERENCE, 
  MAIN_APP_TITLE,
  ARTUR_LAB_NAME,
  APP_FOOTER_MESSAGE,
  CLIENT_EXPERIENCE_LEVEL_OPTIONS,
  CLIENT_URGENCY_MULTIPLIERS,
  DEFAULT_CLIENT_ESTIMATED_HOURS
} from './constants';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import WelcomeScreen from './components/WelcomeScreen'; // Freelancer Welcome
import CountrySectorForm from './components/CountrySectorForm'; // Freelancer Country/Sector
import QuizForm from './components/QuizForm'; // Freelancer Quiz
import ResultsDisplay from './components/ResultsDisplay'; // Freelancer Results
import ClientCountrySectorForm from './components/ClientCountrySectorForm'; // Client Country/Sector
import ClientInputForm from './components/ClientInputForm'; // Client Main Inputs
import ClientResultsDisplay from './components/ClientResultsDisplay'; // Client Results

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.ROLE_SELECTION);
  
  // Freelancer States
  const [freelancerUserData, setFreelancerUserData] = useState<UserData>({
    countryCode: null,
    sectorId: null,
    quizAnswers: {},
  });
  const [calculatedFreelancerRates, setCalculatedFreelancerRates] = useState<CalculatedRates | null>(null);

  // Client States
  const [clientInputData, setClientInputData] = useState<ClientInputData>({
    countryCode: null,
    sectorId: null,
    experienceLevel: ClientExperienceLevel.PROFESSIONAL,
    urgency: ClientProjectUrgency.NORMAL,
    volume: ClientProjectVolume.ONE_TASK,
    estimatedHoursPerTask: undefined,
  });
  const [calculatedClientRates, setCalculatedClientRates] = useState<ClientRateEstimate | null>(null);


  const calculateFreelancerRatesLogic = useCallback(() => {
    if (!freelancerUserData.countryCode || !freelancerUserData.sectorId || Object.keys(freelancerUserData.quizAnswers).length !== QUIZ_QUESTIONS_DATA.length) {
      console.warn("Freelancer calculation prerequisites not met:", freelancerUserData, QUIZ_QUESTIONS_DATA.length);
      return;
    }

    const country = COUNTRIES_DATA.find(c => c.code === freelancerUserData.countryCode) as Country; 
    const sector = SECTORS_DATA.find(s => s.id === freelancerUserData.sectorId) as Sector; 

    const phMinimo = country.minMonthlySalary / HOURS_PER_MONTH_REFERENCE;

    const rateKey = `${country.code}_${sector.id}`;
    const phMedioFallbackForCountry = AVERAGE_HOURLY_RATES_DATA[`${country.code}_other`]; 
    const genericFallback = phMinimo * 2; 
    const phMedio = AVERAGE_HOURLY_RATES_DATA[rateKey] || phMedioFallbackForCountry || genericFallback;

    const rawSpt = Object.values(freelancerUserData.quizAnswers).reduce((sum, points) => sum + points, 0);
    
    const maxPossiblePoints = QUIZ_QUESTIONS_DATA.reduce((sum, q) => {
        const maxOptionPoints = q.options.length > 0 ? Math.max(...q.options.map(opt => opt.points)) : 0;
        return sum + maxOptionPoints;
    }, 0);

    const normalizedSpt = maxPossiblePoints > 0 ? (rawSpt / maxPossiblePoints) * 100 : 0;
    const finalSpt = Math.max(0, Math.min(100, Math.round(normalizedSpt)));

    const effectivePhMedio = Math.max(phMinimo, phMedio);
    const tsh = phMinimo + ((effectivePhMedio - phMinimo) * (finalSpt / 100));
    
    const rates: CalculatedRates = {
      phMinimo,
      phMedio: effectivePhMedio,
      spt: finalSpt, 
      tsh,
      tshMinimaEtica: phMinimo,
      tshSugerida: tsh,
    };

    if (rates.spt > 89) {
      rates.tshPremium = tsh * 1.25;
    }
    
    setCalculatedFreelancerRates(rates);
  }, [freelancerUserData]);

  const calculateClientRatesLogic = useCallback(() => {
    if (!clientInputData.countryCode || !clientInputData.sectorId) {
      console.warn("Client calculation prerequisites not met:", clientInputData);
      return;
    }
    const country = COUNTRIES_DATA.find(c => c.code === clientInputData.countryCode);
    const sector = SECTORS_DATA.find(s => s.id === clientInputData.sectorId);

    if (!country || !sector) {
      setCalculatedClientRates(null);
      return;
    }
    
    const phMinimoEthical = country.minMonthlySalary / HOURS_PER_MONTH_REFERENCE;
    const baseRateKey = `${country.code}_${sector.id}`;
    const phMedioMarketFallback = AVERAGE_HOURLY_RATES_DATA[`${country.code}_other`] || phMinimoEthical * 2;
    const phMedioMarket = AVERAGE_HOURLY_RATES_DATA[baseRateKey] || phMedioMarketFallback;

    const expLevelFactors = CLIENT_EXPERIENCE_LEVEL_OPTIONS[clientInputData.experienceLevel];
    const urgencyFactors = CLIENT_URGENCY_MULTIPLIERS[clientInputData.urgency];

    const minRate = Math.max(phMinimoEthical, phMedioMarket * expLevelFactors.multiplierMin);
    const maxRate = phMedioMarket * expLevelFactors.multiplierMax;

    let totalEstimatedCost;
    let costExplanation = '';

    // Basic cost estimation logic (can be expanded)
    const baseHours = clientInputData.estimatedHoursPerTask || (clientInputData.volume === ClientProjectVolume.ONE_TASK ? DEFAULT_CLIENT_ESTIMATED_HOURS : DEFAULT_CLIENT_ESTIMATED_HOURS * 2); // Simplistic volume adjustment

    if (baseHours) {
        totalEstimatedCost = {
            min: minRate * baseHours * urgencyFactors.multiplier,
            max: maxRate * baseHours * urgencyFactors.multiplier,
            explanation: `Estimado para ${baseHours}hs, con urgencia ${urgencyFactors.label.toLowerCase()}.`
        };
    }


    setCalculatedClientRates({
      phMinimoEthical,
      phMedioMarket,
      recommendedRateRange: { min: minRate, max: maxRate },
      urgencyMultiplier: urgencyFactors.multiplier,
      totalEstimatedCost,
      country,
      sector
    });

  }, [clientInputData]);

  useEffect(() => {
    if (userRole === UserRole.FREELANCER && currentScreen === AppScreen.RESULTS) {
      calculateFreelancerRatesLogic();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, calculateFreelancerRatesLogic, userRole]); 

  useEffect(() => {
    if (userRole === UserRole.CLIENT && currentScreen === AppScreen.CLIENT_RESULTS) {
      calculateClientRatesLogic();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, calculateClientRatesLogic, userRole]);

  const handleUpdateFreelancerUserData = (data: Partial<UserData>) => {
    setFreelancerUserData(prev => ({ ...prev, ...data }));
  };

  const handleUpdateClientInputData = (data: Partial<ClientInputData>) => {
    setClientInputData(prev => ({ ...prev, ...data }));
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setUserRole(selectedRole);
    if (selectedRole === UserRole.FREELANCER) {
      setCurrentScreen(AppScreen.WELCOME);
    } else if (selectedRole === UserRole.CLIENT) {
      setCurrentScreen(AppScreen.CLIENT_COUNTRY_SECTOR);
    }
  };
  
  // Freelancer Flow Handlers
  const handleFreelancerStart = () => setCurrentScreen(AppScreen.COUNTRY_SECTOR);
  const handleFreelancerCountrySectorNext = () => setCurrentScreen(AppScreen.QUIZ);
  const handleFreelancerQuizComplete = () => setCurrentScreen(AppScreen.RESULTS);
  
  // Client Flow Handlers
  const handleClientCountrySectorNext = () => setCurrentScreen(AppScreen.CLIENT_INPUT);
  const handleClientInputComplete = () => setCurrentScreen(AppScreen.CLIENT_RESULTS);


  const handleRestart = () => {
    setUserRole(UserRole.NONE);
    setFreelancerUserData({ countryCode: null, sectorId: null, quizAnswers: {} });
    setCalculatedFreelancerRates(null);
    setClientInputData({
      countryCode: null,
      sectorId: null,
      experienceLevel: ClientExperienceLevel.PROFESSIONAL,
      urgency: ClientProjectUrgency.NORMAL,
      volume: ClientProjectVolume.ONE_TASK,
      estimatedHoursPerTask: undefined,
    });
    setCalculatedClientRates(null);
    setCurrentScreen(AppScreen.ROLE_SELECTION);
  };

  const handleChangeFreelancerSettings = () => {
    setCalculatedFreelancerRates(null); 
    setCurrentScreen(AppScreen.COUNTRY_SECTOR);
  };
  
  const handleChangeClientSettings = () => {
    setCalculatedClientRates(null);
    setCurrentScreen(AppScreen.CLIENT_COUNTRY_SECTOR);
  };


  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.ROLE_SELECTION:
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
      
      // Freelancer Screens
      case AppScreen.WELCOME:
        return <WelcomeScreen onStart={handleFreelancerStart} />;
      case AppScreen.COUNTRY_SECTOR:
        return (
          <CountrySectorForm
            userData={freelancerUserData}
            onUpdateUserData={handleUpdateFreelancerUserData}
            onNext={handleFreelancerCountrySectorNext}
          />
        );
      case AppScreen.QUIZ:
        return (
          <QuizForm
            userData={freelancerUserData}
            onUpdateUserData={handleUpdateFreelancerUserData}
            onCompleteQuiz={handleFreelancerQuizComplete}
          />
        );
      case AppScreen.RESULTS:
        return (
          <ResultsDisplay
            rates={calculatedFreelancerRates}
            countryCode={freelancerUserData.countryCode}
            sectorId={freelancerUserData.sectorId}
            quizAnswers={freelancerUserData.quizAnswers}
            onRestart={handleRestart} // Full restart
            onChangeSettings={handleChangeFreelancerSettings} // Change country/sector for freelancer
          />
        );

      // Client Screens
      case AppScreen.CLIENT_COUNTRY_SECTOR:
        return (
          <ClientCountrySectorForm
            clientInputData={clientInputData}
            onUpdateClientInputData={handleUpdateClientInputData}
            onNext={handleClientCountrySectorNext}
          />
        );
      case AppScreen.CLIENT_INPUT:
        return (
          <ClientInputForm
            clientInputData={clientInputData}
            onUpdateClientInputData={handleUpdateClientInputData}
            onSubmit={handleClientInputComplete}
            onBack={() => setCurrentScreen(AppScreen.CLIENT_COUNTRY_SECTOR)}
          />
        );
      case AppScreen.CLIENT_RESULTS:
         return (
          <ClientResultsDisplay
            clientRateEstimate={calculatedClientRates}
            onRestart={handleRestart}
            onChangeSettings={handleChangeClientSettings} // Change client inputs
          />
        );

      default:
        return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 py-8">
      <header className="text-center mb-8 px-4">
        <a href="#" onClick={(e) => { e.preventDefault(); handleRestart();}} className="inline-block group">
         <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 group-hover:text-sky-800 transition-colors">
            {MAIN_APP_TITLE} <span className="text-sky-500">💸</span>
          </h1>
        </a>
        <p className="text-slate-500 text-sm sm:text-base mt-1">Un proyecto de <span className="font-semibold text-sky-600">{ARTUR_LAB_NAME}</span> para una colaboración freelance justa y transparente.</p>
      </header>
      <main>
        {renderScreen()}
      </main>
      {currentScreen !== AppScreen.ROLE_SELECTION && (
        <footer className="mt-12 text-center text-sm text-slate-500 px-4">
            <p>&copy; {new Date().getFullYear()} {ARTUR_LAB_NAME}. Todos los derechos reservados.</p>
            <p className="mt-1">{APP_FOOTER_MESSAGE}</p>
            <p className="mt-1">Los cálculos y valores presentados son estimaciones. Te recomendamos investigar tu mercado local.</p>
        </footer>
      )}
    </div>
  );
};

export default App;