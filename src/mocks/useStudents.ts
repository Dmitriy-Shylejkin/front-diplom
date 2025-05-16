import { useEffect, useState } from 'react';

export const useStudents = (groupId: string | undefined = undefined) => {
  const [students, setStudents] = useState<any[]>([]);
  let query = ''
  query = groupId ? query + `groupId=${groupId}` : query + ''

  useEffect(() => {
    fetch(`/students/?${query}`)
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  return students;
};