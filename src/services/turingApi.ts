import axios from 'axios';

const API_URL = 'http://localhost:8080/api/turing-machine/run';

export interface TuringApi {
  input: string;
  initialState: string;
  finalState: string;
  bodyTransitions: string;
}

export const runTuringApi = async (data: TuringApi) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao comunicar com a API.');
  }
};