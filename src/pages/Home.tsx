import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { runTuringApi } from "../services/turingApi";
import Tape from "../components/Tape";

const Home = () => {
  const [input, setInput] = useState("");
  const [initialState, setInitialState] = useState("qi");
  const [finalState, setFinalState] = useState("qf");
  const [bodyTransitions, setBodyTransitions] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapeContent, setTapeContent] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(-1);

  // Inicializa a fita com espaços extras ao redor do input
  const initializeTape = (input: string) => {
    const tape = `____${input}____`.split(""); // Fita com espaços extras
    setTapeContent(tape);
    setCursorPosition(4); // Coloca o cursor na posição inicial
  };

  // Submete os dados para a API e processa a resposta
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
      setCurrentStep(0); // Reinicia para o primeiro passo
      setIsPlaying(false); // Pausa no início
      initializeTape(input); // Reinicia a fita com o input
    } catch (err) {
      console.error("Erro na submissão:", err);
      alert("Erro ao processar a Máquina de Turing! Verifique os dados e tente novamente.");
    }
  };

  // Atualiza a fita e a posição do cursor com base no passo atual
  const updateTapeAndCursor = (step: number) => {
    const stepData = response?.turingExecutionSteps[step];
    if (stepData) {
      const tapeArray = stepData.tapeContent.split(""); // Conteúdo da fita da API
      const updatedTapeContent = [...tapeContent]; // Copia a fita atual para atualização
  
      // Calcula o comprimento do binário
      const binaryLength = tapeArray.length;
  
      // Substitui o valor no início (posição 3, caso o primeiro valor não seja um número)
      if (isNaN(parseInt(tapeArray[0]))) {
        updatedTapeContent[3] = tapeArray[0]; // Substitui o valor na posição 3
      }
  
      // Substitui o valor no final (última posição conforme o tamanho do binário)
      if (isNaN(parseInt(tapeArray[tapeArray.length - 1]))) {
        updatedTapeContent[3 + binaryLength] = tapeArray[tapeArray.length - 1]; // Substitui o valor na posição final
      }
  
      // Atualiza os valores da fita para o restante dos valores de tapeArray
      tapeArray.forEach((value: string, index: number) => {
        if (index >= 4 && index < tapeArray.length - 4) {
          // Verifica se o valor não é um número e se o valor na fita ainda não foi substituído
          if (isNaN(parseInt(value)) && updatedTapeContent[3 + index] !== value) {
            updatedTapeContent[3 + index] = value; // Substitui o valor se não for numérico e ainda não foi substituído
          }
        }
      });
  
      // Atualiza a fita com os novos valores
      setTapeContent(updatedTapeContent);
  
      // Atualiza a posição do cursor
      const direction = stepData.nextTransition.includes(">") 
        ? 1 
        : stepData.nextTransition.includes("<") 
        ? -1 
        : 0;
  
      setCursorPosition((prev) => {
        // Calcula a nova posição com base na direção
        const newPosition = prev + direction;
  
        // Garante que o cursor não ultrapasse os limites (posição 3 até 8)
        return Math.max(3, Math.min(newPosition, 8)); // Posição mínima 3, máxima 8
      });
    }
  };
  
  
  

  // Executa o próximo passo
  const handleNextStep = () => {
    if (response && currentStep < response.turingExecutionSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Atualiza a fita e o cursor
      updateTapeAndCursor(nextStep);
    }
  };

  // Retrocede um passo
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);

      // Atualiza a fita e o cursor
      updateTapeAndCursor(prevStep);
    }
  };

  // Play/Pause da simulação
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false); // Pausa a execução
    } else {
      setIsPlaying(true); // Inicia a execução
    }
  };

  // Garante a execução contínua no modo Play
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNextStep();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

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
              onChange={(e) => {
                setInput(e.target.value);
                initializeTape(e.target.value);
              }}
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
          <Tape tapeContent={tapeContent} cursorPosition={cursorPosition} />
        </div>

        {response && (
          <div>
            <h3>Simulação</h3>
            <div>
              <button onClick={handlePreviousStep} disabled={currentStep === 0}>
                Passo Anterior
              </button>
              <button onClick={handlePlayPause}>
                {isPlaying ? "Pausar" : "Play"}
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep >= response.turingExecutionSteps.length - 1}
              >
                Próximo Passo
              </button>
            </div>
            <p>
              <strong>Estado Atual:</strong>{" "}
              {response.turingExecutionSteps[currentStep]?.currentState}
            </p>
            <p>
              <strong>Leitura:</strong>{" "}
              {response.turingExecutionSteps[currentStep]?.readSymbol}
            </p>
            <p>
              <strong>Fita Atual:</strong>{" "}
              {response.turingExecutionSteps[currentStep]?.tapeContent}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;