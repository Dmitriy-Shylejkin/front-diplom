import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

export const useStudents = (groupId: string | undefined = undefined) => {
  const [students, setStudents] = useState<any[]>([]);
  let query = ''
  query = groupId ? query + `groupId=${groupId}` : query + ''

  useEffect(() => {
    fetch(`http://localhost:4000/students/?${query}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);
  console.log('st', students)
  return students;
};

// api/students.ts
export const createStudent = async (newStudent: any) => {
  try {
    console.log('dasdasdaddsad', localStorage.getItem('token'))
    const response = await fetch('http://192.168.1.68:4000/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
      body: JSON.stringify(newStudent),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};