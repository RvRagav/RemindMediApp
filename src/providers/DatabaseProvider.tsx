import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../database';

interface DatabaseContextType {
    isReady: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
    isReady: false,
    error: null,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
    children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initDatabase = async () => {
            try {
                await database.init();
                setIsReady(true);
            } catch (err) {
                console.error('Database initialization failed:', err);
                setError(err instanceof Error ? err : new Error('Unknown database error'));
            }
        };

        initDatabase();
    }, []);

    return (
        <DatabaseContext.Provider value={{ isReady, error }}>
            {children}
        </DatabaseContext.Provider>
    );
};
