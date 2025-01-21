import Layout from '../components/layout/Layout';
import { useState, useEffect } from 'react';
import { runTuringApi } from '../services/turingApi';
import Tape from '../components/Tape';

const Home = () => {
  const [input, setInput] = useState('');
  const [initialState, setInitialState] = useState('');
  const [finalState, setFinalState] = useState('');
  const [bodyTransitions, setBodyTransitions] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapeContent, setTapeContent] = useState<string[]>([]);


  const initializeTape = (input: string) => {
    const tape = `____${input}____`.split('');
    setTapeContent(tape);
  };

  const handleSubmit = async () => {
    const requestData = {
      input,
      initialState,
      finalState,
      bodyTransitions,
    };
  
    console.log("Dados enviados para o backend:", requestData);
  
    try {
      const result = await runTuringApi(requestData);
      console.log("Resultado da API:", result);
  
      setResponse(result);
      setCurrentStep(0); // Inicia a simulação a partir do primeiro passo
      setIsPlaying(false); // Pausa a execução no início
  
      // Inicializa a fita com espaços extras ao redor e configura o cursor
      const tape = `____${input}____`.split('');
      setTapeContent(tape); // Atualiza a fita no estado
  
      // Determina a posição inicial do cursor (primeiro caractere inserido)
      const cursorPos = tape.findIndex(char => char !== '_');
      console.log("Posição inicial do cursor:", cursorPos);
  
      setCursorPosition(cursorPos); // Atualiza a posição do cursor no estado
  
    } catch (err: any) {
      console.error("Erro na submissão:", err);
      alert("Erro ao processar a Máquina de Turing! Verifique os dados e tente novamente.");
    }
  };
  
  

  const handleNextStep = () => {
    if (response && currentStep < response.turingExecutionSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTapeContent(response.turingExecutionSteps[nextStep]?.tapeContent.split('') || []);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setTapeContent(response.turingExecutionSteps[prevStep]?.tapeContent.split('') || []);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    initializeTape(value);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNextStep();
        // Atualiza o cursor a cada passo
        const currentStepData = response?.turingExecutionSteps[currentStep];
        const newCursorPosition = tapeContent.findIndex(char => char === currentStepData?.readSymbol);
        setCursorPosition(newCursorPosition);  // Atualiza o cursor
      }, 1000);
    } else if (!isPlaying && currentStep !== 0) {
      clearInterval(interval);  // Pausa a execução
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, tapeContent, response]);
  

  const [cursorPosition, setCursorPosition] = useState<number>(-1);  // Inicializa o cursor fora da fita

  return (
    <Layout>
      <div>
        <h1>Máquina de Turing</h1>
        <div>
          <label>
            Input:
            <input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Ex: 1011"
            />
          </label>
          <label>
            Estado Inicial:
            <input
              type="text"
              value={initialState}
              onChange={(e) => setInitialState(e.target.value)}
              placeholder="Ex: qi"
            />
          </label>
          <label>
            Estado Final:
            <input
              type="text"
              value={finalState}
              onChange={(e) => setFinalState(e.target.value)}
              placeholder="Ex: qf"
            />
          </label>
          <label>
            Transições:
            <textarea
              value={bodyTransitions}
              onChange={(e) => setBodyTransitions(e.target.value)}
              placeholder="Digite as transições..."
            />
          </label>
          <button onClick={handleSubmit}>Rodar Máquina</button>
        </div>

        <div>
          <h3>Fita da Máquina</h3>
          <Tape
            tapeContent={tapeContent}
            cursorPosition={cursorPosition}
          />
        </div>

        {response && (
          <div>
            <h3>Simulação</h3>
            <div>
              <button onClick={handlePreviousStep} disabled={currentStep === 0}>
                Passo Anterior
              </button>
              <button onClick={handlePlayPause}>
                {isPlaying ? 'Pausar' : 'Play'}
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep >= response.turingExecutionSteps.length - 1}
              >
                Próximo Passo
              </button>
            </div>
            <p>
              <strong>Estado Atual:</strong>{' '}
              {response.turingExecutionSteps[currentStep]?.currentState}
            </p>
            <p>
              <strong>Leitura:</strong>{' '}
              {response.turingExecutionSteps[currentStep]?.readSymbol}
            </p>
            <p>
              <strong>Fita Atual:</strong>{' '}
              {response.turingExecutionSteps[currentStep]?.tapeContent}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
