
import React, { useState, useMemo } from 'react';
import { QuizQuestion, UserData, Sector } from '../types';
import { QUIZ_QUESTIONS_DATA, PLATFORM_EXAMPLES_BY_SECTOR, SECTORS_DATA, NEW_QUESTION_ID, MAX_PLATFORM_EXAMPLES } from '../constants';
import Button from './ui/Button';
import Card from './ui/Card';

interface QuizFormProps {
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  onCompleteQuiz: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ userData, onUpdateUserData, onCompleteQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(userData.quizAnswers);

  const currentQuestionDefinition = QUIZ_QUESTIONS_DATA[currentQuestionIndex];
  
  const selectedSector: Sector | undefined = useMemo(() => {
    return SECTORS_DATA.find(s => s.id === userData.sectorId);
  }, [userData.sectorId]);

  const getPlatformExamplesText = (sectorId: string | null | undefined, count: number = MAX_PLATFORM_EXAMPLES): string => {
    if (!sectorId) return "algunas conocidas";
    const examples = PLATFORM_EXAMPLES_BY_SECTOR[sectorId] || PLATFORM_EXAMPLES_BY_SECTOR['other'];
    return examples.slice(0, count).join(', ') || "algunas conocidas";
  };

  const currentQuestion: QuizQuestion = useMemo(() => {
    if (currentQuestionDefinition.id === NEW_QUESTION_ID) {
      const platformExamples = getPlatformExamplesText(selectedSector?.id);
      const customizedQuestionText = currentQuestionDefinition.questionText.replace('{platformExamplesPlaceholder}', platformExamples);
      
      const customizedOptions = currentQuestionDefinition.options.map(opt => {
        if (opt.points === 2) { // Customize the 2-point option as per prompt
          return { ...opt, text: `Sí, he usado alguna vez plataformas como ${getPlatformExamplesText(selectedSector?.id, 2)} o similares.` };
        }
        return opt;
      });
      return { ...currentQuestionDefinition, questionText: customizedQuestionText, options: customizedOptions };
    }
    return currentQuestionDefinition;
  }, [currentQuestionDefinition, selectedSector]);


  const handleOptionSelect = (questionId: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }));
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion.id] === undefined && currentQuestion.options.length > 0) {
        handleOptionSelect(currentQuestion.id, currentQuestion.options[0].points);
    }
    if (currentQuestionIndex < QUIZ_QUESTIONS_DATA.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onUpdateUserData({ quizAnswers: answers });
      onCompleteQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS_DATA.length) * 100;

  if (!currentQuestion) return <p>Cargando cuestionario...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Vamos a conocerte mejor" icon="📝">
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-sky-700">Progreso</span>
            <span className="text-sm font-medium text-sky-700">{currentQuestionIndex + 1} de {QUIZ_QUESTIONS_DATA.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="p-2 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-700 mb-1">
            {currentQuestion.icon && <span className="mr-2">{currentQuestion.icon}</span>}
            {currentQuestion.blockTitle}
          </h3>
          <p className="text-md text-slate-600 mb-6">{currentQuestion.questionText}</p>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-150 ${
                  answers[currentQuestion.id] === option.points
                    ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.points}
                  checked={answers[currentQuestion.id] === option.points}
                  onChange={() => handleOptionSelect(currentQuestion.id, option.points)}
                  className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500 mr-3"
                />
                <span className="text-sm text-slate-700">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Button 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Anterior
          </Button>
          <Button onClick={handleNextQuestion} disabled={answers[currentQuestion.id] === undefined && currentQuestion.options.length > 0}>
            {currentQuestionIndex === QUIZ_QUESTIONS_DATA.length - 1 ? 'Calcular Mi Tarifa 💰' : 'Siguiente'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizForm;
