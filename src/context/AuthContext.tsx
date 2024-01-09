import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextProps {
  estAuthentifiee: boolean;
  connexion: () => void;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estAuthentifiee, setEstAuthentifiee] = useState(false);

  const connexion = () => setEstAuthentifiee(true);
  const deconnexion = () => setEstAuthentifiee(false);

  return (
    <AuthContext.Provider value={{ estAuthentifiee, connexion, deconnexion }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit etre utilisé avec AuthProvider');
  }

  return context;
};
