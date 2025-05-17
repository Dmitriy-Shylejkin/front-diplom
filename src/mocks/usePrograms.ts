import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

export const usePrograms = (facultyId: string | undefined = undefined) => {
  const [programs, setPrograms] = useState<any[]>([]);
  let query = ''
  query = facultyId ? query + `facultyId=${facultyId}` : query + ''

  useEffect(() => {
    fetch(`${BACKEND_URL}/programs?${query}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setPrograms)
      .catch(console.error);
  }, []);

  return programs;
};