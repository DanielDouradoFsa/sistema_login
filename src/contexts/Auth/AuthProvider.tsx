import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { User } from "../../types/user"
import { useApi } from "../../hooks/useApi";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);
    const api = useApi();

    useEffect(() => {
        const validateToken = async () => {
            const storageToken = localStorage.getItem("authToken");
            if (storageToken) {
                const data = await api.validateToken(storageToken)
                if (data.user) {
                    setUser(data.user)
                }
            }
        }
        validateToken()
    }, [api]);

    const signin = async (email: string, password: string) => {
        const data = await api.signin(email, password);
        if (data.user && data.token) {
            setUser(data.user);
            setToken(data.token);
            return true;
        }
        return false;
    }

    const signout = async () => {
        await api.signout();
        setToken('');
        setUser(null);
    }
    const setToken = (token: string) => {
        localStorage.setItem("authToken", token)
    }
    return (
        <AuthContext.Provider value={{ user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    )
}