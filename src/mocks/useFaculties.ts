import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

export const useFaculties = () => {
  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/faculties`,{
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setFaculties)
      .catch(console.error);
  }, []);

  return faculties;
};