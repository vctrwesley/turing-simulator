import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useState } from 'react';
import { runTuringApi } from '../services/turingApi.ts';

const Home = () => {
  const [input, setInput] = useState('');
  const [initialState, setInitialState] = useState('');
  const [finalState, setFinalState] = useState('');
  const [bodyTransitions, setBodyTransitions] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const result = await runTuringApi({
        input,
        initialState,
        finalState,
        bodyTransitions,
      });
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao se comunicar com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <h1>Bem-vindo à Máquina de Turing</h1>
        <p>Simule o funcionamento de uma Máquina de Turing interativamente.</p>
        <Link to="/about">Saiba mais sobre o projeto</Link>

        <div style={{ marginTop: '20px' }}>
          <h2>Simulador</h2>
          <div>
            <div>
              <label>
                Input:
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ex: 1011"
                />
              </label>
            </div>
            <div>
              <label>
                Estado Inicial:
                <input
                  type="text"
                  value={initialState}
                  onChange={(e) => setInitialState(e.target.value)}
                  placeholder="Ex: qi"
                />
              </label>
            </div>
            <div>
              <label>
                Estado Final:
                <input
                  type="text"
                  value={finalState}
                  onChange={(e) => setFinalState(e.target.value)}
                  placeholder="Ex: qf"
                />
              </label>
            </div>
            <div>
              <label>
                Transições:
                <textarea
                  value={bodyTransitions}
                  onChange={(e) => setBodyTransitions(e.target.value)}
                  placeholder="Digite as transições..."
                  rows={5}
                />
              </label>
            </div>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Processando...' : 'Simular'}
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {response && (
            <div>
              <h3>Resultado:</h3>
              <TapeSimulation
                tapeContent={response.tapeContent}
                steps={response.turingExecutionSteps}
              />
              <p><strong>Aceito:</strong> {response.accepted ? 'Sim' : 'Não'}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const TapeSimulation = ({ tapeContent, steps }: any) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentTape = steps[currentStep]?.tapeContent || tapeContent;
  const cursorPosition = currentTape.indexOf('_');

  return (
    <div>
      <h4>Fita:</h4>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
        {currentTape.split('').map((char: string, index: number) => (
          <div
            key={index}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: index === cursorPosition ? 'lightblue' : 'white',
            }}
          >
            {char}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '200px', margin: '0 auto' }}>
        <button onClick={handlePreviousStep} disabled={currentStep === 0}>
          Passo Anterior
        </button>
        <button onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
          Próximo Passo
        </button>
      </div>
      <p><strong>Passo Atual:</strong> {currentStep + 1} de {steps.length}</p>
      <p><strong>Estado Atual:</strong> {steps[currentStep]?.currentState}</p>
      <p><strong>Transição:</strong> {steps[currentStep]?.nextTransition}</p>
    </div>
  );
};

export default Home;
