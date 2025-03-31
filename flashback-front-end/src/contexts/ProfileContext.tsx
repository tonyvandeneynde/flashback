import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getBearerToken,
  logout as authUtilsLogout,
  refreshAccessToken,
  saveBearerToken,
  saveRefreshToken,
} from "../utils";
import { getMe } from "../services";
import { setupAxiosInterceptors } from "../axiosSetup";
import { useGoogleAuth } from "../hooks";

interface ProfileContextType {
  image: string;
  name: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [axiosInitialized] = useState<boolean>(false);

  const initialize = async () => {
    setIsLoading(true);

    const token = getBearerToken();
    if (token) {
      const user = await getMe();
      if (user) {
        setImage(user.picture);
        setName(user.name);
        setIsLoggedIn(true);
      }
    }
    setIsLoading(false);
  };

  const login = ({
    bearerToken,
    refreshToken,
  }: {
    bearerToken: string;
    refreshToken: string;
  }) => {
    saveBearerToken(bearerToken);
    saveRefreshToken(refreshToken);
    initialize();
  };

  const logout = () => {
    setIsLoggedIn(false);
    setImage("");
    setName("");
    authUtilsLogout();
  };

  useEffect(() => {
    setupAxiosInterceptors({
      logout,
      getBearerToken,
      refreshAccessToken,
    });

    initialize();
  }, []);

  useEffect(() => {}, [axiosInitialized]);

  const { login: loginWithGoogle } = useGoogleAuth({ successCallback: login });

  return (
    <ProfileContext.Provider
      value={{ image, name, isLoggedIn, loginWithGoogle, logout, isLoading }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
