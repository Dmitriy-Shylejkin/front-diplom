import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

export const useStudents = (groupId: string | undefined = undefined) => {
  const [students, setStudents] = useState<any[]>([]);
  let query = ''
  query = groupId ? query + `groupId=${groupId}` : query + ''

  useEffect(() => {
    fetch(`${BACKEND_URL}/students?${query}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  return students;
};