import Layout from '../components/layout/Layout';
import './about.css';
import albertoPhoto from '../assets/images/alberto.jpg';
import joaoPhoto from '../assets/images/joao-vitor.jpg';
import wesleyPhoto from '../assets/images/wesley.jpg';

const About = () => {
  return (
    <Layout>
        <div className="about-container">
        <h1>Sobre o Projeto</h1>
        <p>
          Este simulador de Máquina de Turing foi desenvolvido como parte do trabalho da disciplina de
          <strong> Teoria da Computação</strong>, ministrada pelo professor <strong>Cenez Araujo de Rezende</strong>.
          O projeto tem como objetivo explorar e demonstrar o funcionamento da Máquina de Turing,
          um modelo computacional teórico essencial na ciência da computação e fundamental para o entendimento
          da computabilidade e da teoria dos autômatos.
        </p>
        
        <h2>Desenvolvedores</h2>
        <div className="developers">
          <div className="developer">
          <img src={wesleyPhoto} alt="Developer" className="developer-photo" />
            <p>Victor Wesley</p>
          </div>
          <div className="developer">
            <img src={joaoPhoto} alt="Developer" className="developer-photo" />
            <p>João Victor</p>
          </div>
          <div className="developer">
            <img src={albertoPhoto} alt="Developer" className="developer-photo" />
            <p>Alberto Marinho</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
