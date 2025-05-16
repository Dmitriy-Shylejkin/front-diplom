import { useEffect, useState } from 'react';

export const useFaculties = () => {
  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    fetch('/faculties')
      .then((res) => res.json())
      .then(setFaculties)
      .catch(console.error);
  }, []);

  return faculties;
};