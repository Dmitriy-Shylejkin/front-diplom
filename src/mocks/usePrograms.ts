import { useEffect, useState } from 'react';

export const usePrograms = (facultyId: string) => {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/programs/${facultyId}`)
      .then((res) => res.json())
      .then(setPrograms)
      .catch(console.error);
  }, []);

  return programs;
};