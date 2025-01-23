import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { runTuringApi } from "../services/turingApi";
import Tape from "../components/Tape";
import './home.css';

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
  const [isFirstPrevious, setIsFirstPrevious] = useState(false);
  const [isFirstNext, setIsFirstNext] = useState(true);

  const [statusMessage, setStatusMessage] = useState(""); // Para armazenar a mensagem de status
  const [statusClass, setStatusClass] = useState(""); // Para armazenar a classe CSS

  const examples = [
    {
      name: "Exemplo padrão",
      transitions: `qi,1,qi,1,>\nqi,0,qi,0,>\nqi,_,q1,Y,<\nq1,1,q1,1,<\nq1,0,q1,0,<\nq1,_,qf,X,>`
    },
    {
      name: "Números binários divisíveis por 3",
      transitions: `qi,0,qi,0,>\nqi,1,q1,1,>\nq1,0,q2,0,>\nq1,1,qi,1,>\nq2,0,q1,0,>\nq2,1,q2,1,>\nqi,_,qf,_,>`
    }
  ];

  // Inicializa a fita com espaços extras ao redor do input
  const initializeTape = (input: string) => {
    const tape = `____${input}____`.split(""); // Fita com espaços extras
    setTapeContent(tape);
    setCursorPosition(4); // Coloca o cursor na posição inicial
  };


  // Submete os dados para a API e processa a resposta
  const handleSubmit = async () => {
    // Limpar a mensagem de status ao iniciar a submissão
    setStatusMessage("");
    setStatusClass("");
    
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
      alert(
        "Erro ao processar a Máquina de Turing! Verifique os dados e tente novamente."
      );
    }
  };

  // Atualiza a fita e a posição do cursor com base no passo atual
  const updateTapeAndCursor = (step: number) => {
    const stepData = response?.turingExecutionSteps[step];
    if (stepData) {
      console.log("stepData", stepData);

      // Atualiza os valores da fita com espaços extras
      let newTapeContent = [
        "_",
        "_",
        "_",
        "_",
        ...stepData.tapeContent.split(""),
        "_",
        "_",
        "_",
        "_",
      ];
      console.log("newTapeContent", newTapeContent);

      let direction = 0;

      // Verifica a direção e ajusta a posição do cursor
      if (tapeContent.length !== newTapeContent.length) {
        direction = stepData.nextTransition.includes(">")
          ? 1
          : stepData.nextTransition.includes("<")
          ? -1
          : 0;
      } else {
        direction = stepData.nextTransition.includes(">")
          ? 1
          : stepData.nextTransition.includes("<")
          ? -1
          : 0;
      }

      if(!isFirstPrevious && direction == -1){
        direction = +1;
        setIsFirstPrevious(true);
        setIsFirstNext(false);
      }
      if(!isFirstNext && direction == +1){
        if(step == response?.turingExecutionSteps.length -1){
          direction = 0;
        }else{
          direction = -1;
        }
        setIsFirstNext(true);
        setIsFirstPrevious(false);
      }

      setCursorPosition(cursorPosition + direction);

      setTapeContent(newTapeContent);
    }
  };

  // Executa o próximo passo
  const handleNextStep = () => {
    if (response && currentStep < response.turingExecutionSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateTapeAndCursor(nextStep);

      // Verificar estado final quando todos os passos forem concluídos
      if (nextStep === response.turingExecutionSteps.length - 1) {
        if (response.accepted) {
          setStatusMessage("Processo aprovado! Entrada aceita pela máquina.");
          setStatusClass("success");
        } else {
          setStatusMessage("Processo reprovado! Entrada rejeitada pela máquina.");
          setStatusClass("error");
        }
      }
    }
  };

  // Play/Pause da simulação
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Garante a execução contínua no modo Play
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNextStep();
      }, 1000); // Intervalo de 1 segundo entre os passos
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  return (
    <Layout>
      <div>
        <h1>Máquina de Turing</h1>
        <div className="form">
          <div className="container-itens">
            <div className="container-input">
              <label>
                Estado Inicial:
              </label>
              <input
                type="text"
                value={initialState}
                onChange={(e) => setInitialState(e.target.value)}
                placeholder="Ex: qi"/>
            </div>
            <div className="container-input">
              <label>
                Estado Final:
              </label>
              <input
                type="text"
                value={finalState}
                onChange={(e) => setFinalState(e.target.value)}
                placeholder="Ex: qf"/>
            </div>
            <div className="container-input">
              <label>Exemplos:</label>
              <select
                onChange={(e) => {
                  const selectedExample = examples.find(
                    (example) => example.name === e.target.value
                  );
                  if (selectedExample) {
                    setBodyTransitions(selectedExample.transitions);
                  }
                }}
              >
                <option value="">Selecione um exemplo</option>
                {examples.map((example) => (
                  <option key={example.name} value={example.name}>
                    {example.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="container">
            <div className="container-input entrada">
              <label>
              Entrada:
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                initializeTape(e.target.value);
              }}
              placeholder="Ex: 1011"/>
            </div>
            <div className="container-input">
              <label>
                Transições:
              </label>
              <textarea
                value={bodyTransitions}
                onChange={(e) => setBodyTransitions(e.target.value)}
                placeholder="Digite as transições..."/>
            </div>
          </div>
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
              <button onClick={handlePlayPause}>
                {isPlaying ? "Pausar" : "Play"}
              </button>
              <button
                onClick={handleNextStep}
                disabled={
                  currentStep >= response.turingExecutionSteps.length - 1
                }
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

        {statusMessage && (
                <div className={`status-message ${statusClass}`}>
                  {statusMessage}
                </div>
              )}
      </div>
    </Layout>
  );
};

export default Home;
