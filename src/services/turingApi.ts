import axios from 'axios';

// const API_URL = 'http://localhost:8080/api/turing-machine/run';
const API_URL = 'https://maquina-de-turing.onrender.com/api/turing-machine/run';

const USERNAME = "user";
const PASSWORD = "password";

export interface TuringApi {
  input: string;
  initialState: string;
  finalState: string;
  bodyTransitions: string;
}

export const runTuringApi = async (data: TuringApi) => {
  try {
    const response = await axios.post(
      API_URL, 
      data, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro na resposta da API:', error.response);
    throw new Error(error.response?.data?.message || 'Erro ao comunicar com a API.');
  }
};