import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './src/lib/supabase';
import { Session } from '@supabase/supabase-js';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import StudentDashboard from './src/screens/StudentDashboard';

export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  FacultyDashboard: undefined;
  StudentDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchRole(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchRole(session);
    });
  }, []);

  const fetchRole = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      // In a real app, you would fetch this from your backend or decoded JWT
      // For now, we assume the user role is stored in user metadata or fetched from API
      // e.g. const res = await fetch('/api/user/role', ...)
      const userRole = currentSession.user.user_metadata?.role || 'STUDENT';
      setRole(userRole);
    } else {
      setRole(null);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!session ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : role === 'ADMIN' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
        ) : role === 'FACULTY' ? (
          <Stack.Screen name="FacultyDashboard" component={FacultyDashboard} options={{ title: 'Faculty Dashboard' }} />
        ) : (
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ title: 'Student Dashboard' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
