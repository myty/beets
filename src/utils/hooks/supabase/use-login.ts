import { UserCredentials } from "interfaces/user-credentials";
import { useAuth } from "utils/hooks/supabase/use-auth";
import { useMutation } from "utils/hooks/use-mutation";
import { ErrorMessages } from "constants/error-messages";

interface UseLoginOptions {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}

const useLogin = (options?: UseLoginOptions) => {
    const { onError, onSuccess } = options ?? {};
    const auth = useAuth();

    const result = useMutation<void, Error, UserCredentials>({
        fn: async (credentials: UserCredentials) => {
            const { email, password, redirectTo } = credentials;
            const loginResult = await auth.signIn(
                { email, password },
                { redirectTo }
            );

            const { error } = loginResult;
            const emailNotConfirmedError =
                error != null &&
                error.message === ErrorMessages.EMAIL_NOT_CONFIRMED;

            if (emailNotConfirmedError) {
                throw new Error(ErrorMessages.EMAIL_NOT_CONFIRMED_CHECK_EMAIL);
            }

            if (error != null) {
                throw error;
            }
        },
        onError,
        onSuccess,
    });

    return result;
};

export { useLogin };
