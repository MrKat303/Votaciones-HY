"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Admin {
    id: string;
    rut: string;
}

interface AuthContextType {
    admin: Admin | null;
    login: (rut: string, pass: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    admin: null,
    login: async () => false,
    logout: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const stored = localStorage.getItem("hy_admin_session");
        if (stored) {
            try {
                setAdmin(JSON.parse(stored));
            } catch (e) {
                localStorage.removeItem("hy_admin_session");
            }
        }
        setLoading(false);
    }, []);

    const login = async (rut: string, pass: string) => {
        const result = await api.loginAdmin(rut, pass);
        if (result && result.success && result.admin) {
            setAdmin(result.admin);
            localStorage.setItem("hy_admin_session", JSON.stringify(result.admin));
            return true;
        }
        return false;
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem("hy_admin_session");
        router.push("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
