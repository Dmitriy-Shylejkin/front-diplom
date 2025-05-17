import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

export const useStudentDetail = (studentId: string) => {
  const [student, setStudent] = useState<object>({});

  useEffect(() => {
    fetch(`${BACKEND_URL}/students/${studentId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setStudent)
      .catch(console.error);
  }, []);

  return student;
};