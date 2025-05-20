import axios from 'axios';

const token = '1234';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    Authorization: token
  }
});

api.interceptors.request.use(
  (config) => {
    //let loggedUser = 91;

    //config.data.userId = loggedUser;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // ou AsyncStorage no React Native
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});*/

//O interceptador so pode ser usado com uma instancia do axios
//antes de ser enviado para o servidor - request
//ou a resposta - response
