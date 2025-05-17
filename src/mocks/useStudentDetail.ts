import { useEffect, useState } from 'react';

export const useStudentDetail = (studentId: string) => {
  const [student, setStudent] = useState<object>({});
  console.log('aboba')

  useEffect(() => {
    fetch(`/students/${studentId}`)
      .then((res) => res.json())
      .then(setStudent)
      .catch(console.error);
  }, []);

  return student;
};