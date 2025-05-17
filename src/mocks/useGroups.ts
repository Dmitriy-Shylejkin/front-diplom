import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

export const useGroups = (programId: string | undefined = undefined, curatorId: string | undefined = undefined) => {
  const [groups, setGroups] = useState<any[]>([]);
  let query = '';
  query = programId ? query + `programId=${programId}` : query + '';
  query = curatorId ? query + `curatorId=${curatorId}` : query + '';

  useEffect(() => {
    fetch(`${BACKEND_URL}/groups?${query}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  return groups;
};