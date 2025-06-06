import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { loginWithGoogle } from "../services";

export const useGoogleAuth = ({
  successCallback,
}: {
  successCallback: ({
    bearerToken,
    refreshToken,
  }: {
    bearerToken: string;
    refreshToken: string;
  }) => void;
}) => {
  const mutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      const { bearerToken, refreshToken } = data;

      successCallback({ bearerToken, refreshToken });

      console.log("Login successful");
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  const login = useGoogleLogin({
    // Show Google's OAuth consent screen
    onSuccess: async (codeResponse) => {
      const { code } = codeResponse;
      mutation.mutate(code);
    },
    onError(error) {
      console.error("Error logging in", error);
    },
    flow: "auth-code",
  });

  return { login };
};
