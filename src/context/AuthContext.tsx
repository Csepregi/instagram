import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import {Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
import { Hub } from 'aws-amplify';

type UserType = CognitoUser | null | undefined;

type AuthContextType = {
    user: UserType,
    userId: string,
}

const AuthContext = createContext<AuthContextType>({user: undefined, userId: ''});

const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<UserType>(undefined)

    const checkUser = async () => {
        try {
            const authUser = await Auth.currentAuthenticatedUser({bypassCache: true})
            setUser(authUser);
        } catch (error) {
            setUser(null)
            }
        }

    useEffect(() => {
        checkUser();
    },[])

    useEffect(() => {
        const listener: HubCallback = (data) => {
            const {event} = data.payload;
            if (event === 'signOut') {
                setUser(null);
            }
            if (event === 'signIn') {
                checkUser();
            }
        }
        const subscription = Hub.listen('auth', listener);
        return () => subscription()
    },[])

    console.log("User constext ", user)

    return (
        <AuthContext.Provider value={{user, userId: user?.attributes?.sub}}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);