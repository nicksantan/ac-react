import { useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../../firebase/config.ts';

export function useFirebaseProjects(onData) {
  useEffect(() => {
    const projectsRef = ref(database, 'timeline/projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onData(Object.values(data));
      } else {
        onData(null);
      }
    });
    return () => unsubscribe();
  }, [onData]);
}

export function writeProject(project) {
  set(ref(database, `timeline/projects/${project.id}`), project);
}

export function removeProject(projectId) {
  remove(ref(database, `timeline/projects/${projectId}`));
}
