import { createContext, ReactNode, useState } from 'react';

type User = { email: string };

type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
};

/*Cria um contexto com o tipo AuthContextType, onde o valor pode ser undefined inicialmente.
Usamos undefined para indicar que o valor do contexto ainda não foi definido até que o AuthContext.Provider seja usado.
Isso permite que você tenha uma estrutura de autenticação global no seu aplicativo, onde 
qualquer componente pode acessar o estado do usuário e as funções de login/logout sem 
precisar passar esses dados manualmente entre os componentes.*/
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*O AuthProvider é um componente que gerencia o estado de autenticação (login/logout) e 
disponibiliza esses dados para outros componentes do seu app. Ele é útil porque permite 
que você não precise passar o estado de autenticação manualmente por props para cada componente.

Imagine que o AuthProvider é como uma caixa de ferramentas onde você guarda as informações de quem está logado (o usuário).
Ele permite que todos os componentes do seu app acessem essa informação de login (o usuário), 
sem precisar de passar por cada um deles manualmente.*/
export function AuthProvider({ children }: { children: ReactNode }) {
  //Cria um estado para armazenar o nome ou email do usuário
  const [user, setUser] = useState<User | null>(null);

  //Pense na user como uma caixa onde você guarda informações da pessoa logada.
  //O login() coloca o nome ou email dentro da caixa.
  //O logout() esvazia a caixa, ou seja, ninguém está logado.
  const login = (email: string) => setUser({ email });
  const logout = () => setUser(null);

  //{children} é uma forma do React lidar com componentes filhos. Quando você escreve algo assim
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
/*useAuth é um hook customizado que encapsula a lógica de acesso ao contexto de autenticação.
Ele verifica se o contexto está disponível e, se não, lança um erro explicando que o hook precisa ser usado dentro de um AuthProvider.
Ele retorna o valor do contexto (user, login, logout), permitindo que você use facilmente essas informações em qualquer componente.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return context;
}*/
