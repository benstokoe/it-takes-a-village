import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Profile, Session, supabase } from '@/utils/supabase';

import { SplashScreen, useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  email: string;
  password: string;
  fullName?: string;
};

type AuthContextType = {
  initialized: boolean;
  profile: Profile | null;
  session: Session | null;
  signIn: (props: SignInProps) => Promise<void>;
  signUp: (props: SignUpProps) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  initialized: false,
  session: null,
  profile: null,
  signIn: () => new Promise(() => ({})),
  signUp: () => new Promise(() => ({})),
  signOut: () => Promise.resolve(),
});

export function useAuth() {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  }

  return value;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('fetching profile', userId);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      console.log('profile data', data);
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   switch (event) {
    //     case 'SIGNED_OUT':
    //       setToken(undefined);
    //       // setUser(undefined);
    //       setProfile(undefined);
    //       break;
    //     case 'INITIAL_SESSION':
    //     case 'SIGNED_IN':
    //     case 'TOKEN_REFRESHED':
    //       setToken(session?.access_token);
    //       setUser(session?.user);

    //       if (session?.user?.id) {
    //         const userProfile = await fetchProfile(session.user.id);
    //         setProfile(userProfile);
    //       }
    //       break;
    //     default:
    //     // no-op
    //   }
    // });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setInitialized(true);

      setSession(session);

      if (session?.user?.id) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
      if (session) {
        router.replace('/');
      } else {
        router.replace('/welcome');
      }
    }
    // eslint-disable-next-line
  }, [initialized, session]);

  async function signIn({ email, password }: SignInProps) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      return;
    }

    if (data.session) {
      setSession(data.session);
      console.log('User signed in:', data.user);
    } else {
      console.log('No user returned from sign in');
    }
  }

  async function signUp({ email, password, fullName }: SignUpProps) {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (result?.data?.session) {
      setSession(result.data.session);
      console.log('User signed up:', result.data.user);
    } else {
      console.log('No user returned from sign up');
    }

    // if (result.data?.session?.access_token) {
    //   setToken(result.data.session.access_token);
    //   // setUser(result.data.session.user);
    //   // if (result.data.session.user?.id) {
    //   //   const userProfile = await fetchProfile(result.data.session.user.id);
    //   //   setProfile(userProfile);
    //   // }
    // }

    // return result;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setInitialized(false);

    if (error) {
      console.error('Error signing out:', error);
      return;
    } else {
      console.log('User signed out');
    }

    // setSession(null);
  }

  // const updateProfile = useCallback(
  //   async (updates: Partial<Profile>) => {
  //     if (!user?.id) throw new Error('No authenticated user');

  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .update(updates)
  //       .eq('id', user.id)
  //       .select()
  //       .single();

  //     if (error) throw error;

  //     // setProfile(data);
  //   },
  //   [user?.id]
  // );

  // const refreshProfile = useCallback(async () => {
  //   if (!user?.id) return;

  //   const userProfile = await fetchProfile(user.id);
  //   setProfile(userProfile);
  // }, [user?.id, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        initialized,
        session,
        // user,
        profile,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
