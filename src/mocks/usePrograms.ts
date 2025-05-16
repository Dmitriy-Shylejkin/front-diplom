import { useEffect, useState } from 'react';

export const usePrograms = (facultyId: string | undefined = undefined) => {
  const [programs, setPrograms] = useState<any[]>([]);
  let query = ''
  query = facultyId ? query + `facultyId=${facultyId}` : query + ''

  useEffect(() => {
    fetch(`/programs/?${query}`)
      .then((res) => res.json())
      .then(setPrograms)
      .catch(console.error);
  }, []);

  return programs;
};