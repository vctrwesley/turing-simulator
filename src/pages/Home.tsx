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
      input: "1011",
      transitions: `qi,1,qi,1,>\nqi,0,qi,0,>\nqi,_,q1,Y,<\nq1,1,q1,1,<\nq1,0,q1,0,<\nq1,_,qf,X,>`
    },
    {
      name: "Números binários divisíveis por 3",
      input: "110",
      transitions: `qi,0,qi,0,>\nqi,1,q1,1,>\nq1,0,q2,0,>\nq1,1,qi,1,>\nq2,0,q1,0,>\nq2,1,q2,1,>\nqi,_,qf,_,>`
    },
    {
      name: "Decimal para binário",
      input: "6",
      transitions: `qi,0,qi,0,>\nqi,1,qi,1,>\nqi,2,qi,2,>\nqi,3,qi,3,>\nqi,4,qi,4,>\nqi,5,qi,5,>\nqi,6,qi,6,>\nqi,7,qi,7,>\nqi,8,qi,8,>\nqi,9,qi,9,>\nqi,_,halve,0,<\nhalve,0,halve,0,<\nhalve,1,addHalf,0,>\nhalve,2,halve,1,<\nhalve,3,addHalf,1,>\nhalve,4,halve,2,<\nhalve,5,addHalf,2,>\nhalve,6,halve,3,<\nhalve,7,addHalf,3,>\nhalve,8,halve,4,<\nhalve,9,addHalf,4,>\naddHalf,0,jump,5,<\naddHalf,1,jump,6,<\naddHalf,2,jump,7,<\naddHalf,3,jump,8,<\naddHalf,4,jump,9,<\njump,0,halve,0,<\njump,1,halve,1,<\njump,2,halve,2,<\njump,3,halve,3,<\njump,4,halve,4,<\nhalve,_,removezero,_,>\nremovezero,0,removezero,_,>\nremovezero,1,goBack,1,>\nremovezero,2,goBack,2,>\nremovezero,3,goBack,3,>\nremovezero,4,goBack,4,>\nremovezero,5,goBack,5,>\nremovezero,6,goBack,6,>\nremovezero,7,goBack,7,>\nremovezero,8,goBack,8,>\nremovezero,9,goBack,9,>\nremovezero,_,qf,_,>\ngoBack,0,goBack,0,>\ngoBack,1,goBack,1,>\ngoBack,2,goBack,2,>\ngoBack,3,goBack,3,>\ngoBack,4,goBack,4,>\ngoBack,5,goBack,5,>\ngoBack,6,goBack,6,>\ngoBack,7,goBack,7,>\ngoBack,8,goBack,8,>\ngoBack,9,goBack,9,>\ngoBack,_,rest,_,<\nrest,0,rest0,_,>\nrest0,_,setrest0,_,>\nrest,5,rest1,_,>\nrest1,_,setrest1,_,>\nsetrest0,0,setrest0,0,>\nsetrest0,1,setrest0,1,>\nsetrest1,0,setrest1,0,>\nsetrest1,1,setrest1,1,>\nsetrest0,_,continue,0,<\nsetrest1,_,continue,1,<\ncontinue,0,continue,0,<\ncontinue,1,continue,1,<\ncontinue,_,continue2,_,<\ncontinue2,_,halve,0,<`
    },
    {
      name: "Quantidade par de zeros",
      input: "1010",
      transitions: `qi,0,q1,0,>\nq1,0,qi,0,>\nqi,1,qi,1,>\nq1,1,q1,1,>\nqi,_,qf,_,-`
    },
    {
      name: "Duplicar string binária",
      input: "1",
      transitions: `qi,0,qi,0,>\nqi,1,qi,1,>\nqi,o,qi,0,>\nqi,i,qi,1,>\nqi,_,copying_from_right_to_left,_,<\ncopying_from_right_to_left,0,copying_0_to_the_right,o,>\ncopying_from_right_to_left,1,copying_1_to_the_right,i,>\ncopying_from_right_to_left,o,copying_from_right_to_left,o,<\ncopying_from_right_to_left,i,copying_from_right_to_left,i,<\ncopying_0_to_the_right,_,copying_from_right_to_left,o,<\ncopying_1_to_the_right,_,copying_from_right_to_left,i,<\ncopying_0_to_the_right,0,copying_0_to_the_right,0,>\ncopying_0_to_the_right,1,copying_0_to_the_right,1,>\ncopying_0_to_the_right,o,copying_0_to_the_right,o,>\ncopying_0_to_the_right,i,copying_0_to_the_right,i,>\ncopying_1_to_the_right,0,copying_1_to_the_right,0,>\ncopying_1_to_the_right,1,copying_1_to_the_right,1,>\ncopying_1_to_the_right,o,copying_1_to_the_right,o,>\ncopying_1_to_the_right,i,copying_1_to_the_right,i,>\ncopying_from_right_to_left,_,removing_the_markers,_,>\nremoving_the_markers,o,removing_the_markers,0,>\nremoving_the_markers,i,removing_the_markers,1,>\nremoving_the_markers,0,removing_the_markers,0,<\nremoving_the_markers,1,removing_the_markers,1,<\nremoving_the_markers,_,qf,_,>`
    },
    {
      name: "Palíndromo binário",
      input: "10101",
      transitions: `qi,0,qRight0,_,>\nqRight0,0,qRight0,0,>\nqRight0,1,qRight0,1,>\nqi,1,qRight1,_,>\nqRight1,0,qRight1,0,>\nqRight1,1,qRight1,1,>\nqRight0,_,qSearch0L,_,<\nqSearch0L,0,q1,_,<\nqRight1,_,qSearch1L,_,<\nqSearch1L,1,q1,_,<\nq1,0,qLeft0,_,<\nqLeft0,0,qLeft0,0,<\nqLeft0,1,qLeft0,1,<\nq1,1,qLeft1,_,<\nqLeft1,0,qLeft1,0,<\nqLeft1,1,qLeft1,1,<\nqLeft0,_,qSearch0R,_,>\nqSearch0R,0,qi,_,>\nqLeft1,_,qSearch1R,_,>\nqSearch1R,1,qi,_,>\nqSearch0R,1,qReject,1,-\nqSearch1R,0,qReject,0,-\nqSearch0L,1,qReject,1,-\nqSearch1L,0,qReject,0,-\nqi,_,qf,_,-\nq1,_,qf,_,-\nqSearch0L,_,qf,_,-\nqSearch0R,_,qf,_,-\nqSearch1L,_,qf,_,-\nqSearch1R,_,qf,_,-`
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
                    setInput(selectedExample.input);
                    initializeTape(selectedExample.input);
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
            <div className="controls">
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
            <div className="dados-execusao">
              <div className="execucao-item">
                <p>
                  <strong>Estado Atual:</strong>{" "}
                  {response.turingExecutionSteps[currentStep]?.currentState}
                </p>
              </div>
              <div className="execucao-item">
                <p>
                  <strong>Leitura:</strong>{" "}
                  {response.turingExecutionSteps[currentStep]?.readSymbol}
                </p>
              </div>
              <div className="execucao-item">
                <p>
                  <strong>Número de Passos:</strong>{" "}
                  {currentStep + 1}
                </p>
              </div>
              <div className="execucao-item">
                <p>
                <strong>Fita Atual:</strong>{" "}
                {response.turingExecutionSteps[currentStep]?.tapeContent.replace(/ /g, '_')}
                </p>
              </div>
            </div>
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
