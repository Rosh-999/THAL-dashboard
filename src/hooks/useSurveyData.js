import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { calculateMetrics } from '../utils/calculations';

export const useSurveyData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // collection name based on the project context
    const responsesRef = collection(db, 'survey_responses');
    const q = query(responsesRef, orderBy('Timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...calculateMetrics(doc.data())
        }));
        setData(results);
        setLoading(false);
      } catch (err) {
        console.error("Error processing survey data:", err);
        setError(err);
        setLoading(false);
      }
    }, (err) => {
      console.error("Firebase subscription error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { data, loading, error };
};
