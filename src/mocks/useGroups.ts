import { useEffect, useState } from 'react';

export const useGroups = (programId: string | undefined = undefined, curatorId: string | undefined = undefined) => {
  const [groups, setGroups] = useState<any[]>([]);
  let query = '';
  query = programId ? query + `programId=${programId}` : query + '';
  query = curatorId ? query + `curatorId=${curatorId}` : query + '';

  useEffect(() => {
    fetch(`/groups/?${query}`)
      .then((res) => res.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  return groups;
};