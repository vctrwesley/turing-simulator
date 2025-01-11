import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const About = () => {
  return (
    <Layout>
        <div>
            <h1>Sobre o Projeto</h1>
            <p>
                Este simulador de Máquina de Turing foi desenvolvido para demonstrar o funcionamento de
                um modelo computacional fundamental na teoria da computação.
            </p>
            <Link to="/">Voltar para a página inicial</Link>
        </div>
    </Layout>
  );
};

export default About;
