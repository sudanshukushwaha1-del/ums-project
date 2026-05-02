import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';
import { fetchStudentDashboard } from '../lib/api';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <Text style={styles.subtitle}>View your enrolled courses, attendance, and grades.</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enrolled Courses</Text>
            {data?.courses?.map((c: any) => (
              <Text key={c.id}>- {c.title} ({c.code})</Text>
            ))}
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Grades</Text>
            {data?.grades?.map((g: any) => (
              <Text key={g.id}>- {g.course.title}: {g.grade}</Text>
            ))}
          </View>
        </>
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
