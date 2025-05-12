import { useContext } from 'react';
import { AuthContext } from '../app/contexts/authContext';

/*useAuth é um hook customizado que encapsula a lógica de acesso ao contexto de autenticação.
Ele verifica se o contexto está disponível e, se não, lança um erro explicando que o hook precisa ser usado dentro de um AuthProvider.
Ele retorna o valor do contexto (user, login, logout), permitindo que você use facilmente essas informações em qualquer componente.*/
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return context;
}
