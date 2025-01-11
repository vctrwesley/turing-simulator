import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout>
        <div>
            <h1>Bem-vindo à Máquina de Turing</h1>
            <p>Simule o funcionamento de uma Máquina de Turing interativamente.</p>
            <Link to="/about">Saiba mais sobre o projeto</Link>
        </div>
    </Layout>
  );
};

export default Home;
