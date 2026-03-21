import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import seedProjects from '../config/seedData';
import { computePhases, getTimelineRange } from '../utils/phaseComputer';
import { daysBetween } from '../utils/dateUtils';
import { useFirebaseProjects, writeProject as fbWriteProject, removeProject as fbRemoveProject } from '../hooks/useFirebase';

const TimelineContext = createContext();

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 20;

export function TimelineProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(() => new Set());
  const [zoomLevel, setZoomLevelState] = useState(4);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef(null);

  // Load projects from Firebase — seed if empty
  const handleFirebaseData = useCallback((data) => {
    if (data) {
      setProjects(data);
      if (!loaded) {
        setVisibleProjects(new Set(data.map(p => p.id)));
        setLoaded(true);
      }
    } else {
      // Database empty — seed it
      seedProjects.forEach(p => fbWriteProject(p));
    }
  }, [loaded]);

  useFirebaseProjects(handleFirebaseData);

  // Auto-fit zoom on initial load
  useEffect(() => {
    if (projects.length === 0 || !containerRef.current) return;

    let earliest = new Date('2099-01-01');
    let latest = new Date('2000-01-01');

    projects.forEach(p => {
      const phases = computePhases(p);
      phases.forEach(ph => {
        if (ph.start < earliest) earliest = new Date(ph.start);
        if (ph.end > latest) latest = new Date(ph.end);
      });
    });

    const totalProjectDays = daysBetween(earliest, latest);
    const viewportW = containerRef.current.clientWidth;
    const paddedDays = totalProjectDays * 1.3;
    let fitZoom = viewportW / paddedDays;
    fitZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(fitZoom * 2) / 2));
    setZoomLevelState(fitZoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const setZoomLevel = useCallback((newLevel, pivotClientX) => {
    newLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(newLevel * 2) / 2));

    setZoomLevelState(prev => {
      if (newLevel === prev) return prev;

      if (containerRef.current && pivotClientX !== undefined) {
        const rect = containerRef.current.getBoundingClientRect();
        const pivotX = pivotClientX - rect.left;
        const scrollRatio = (containerRef.current.scrollLeft + pivotX) / prev;
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = scrollRatio * newLevel - pivotX;
          }
        });
      }

      return newLevel;
    });
  }, []);

  const toggleVisibility = useCallback((projectId) => {
    setVisibleProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  }, []);

  const openModal = useCallback((projectId = null) => {
    setEditingProjectId(projectId);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingProjectId(null);
    setModalOpen(false);
  }, []);

  const addProject = useCallback((project) => {
    fbWriteProject(project);
    setVisibleProjects(prev => new Set([...prev, project.id]));
  }, []);

  const updateProject = useCallback((projectData) => {
    fbWriteProject(projectData);
  }, []);

  const deleteProject = useCallback((projectId) => {
    fbRemoveProject(projectId);
    setVisibleProjects(prev => {
      const next = new Set(prev);
      next.delete(projectId);
      return next;
    });
  }, []);

  const scrollToToday = useCallback(() => {
    if (!containerRef.current || projects.length === 0) return;
    const range = getTimelineRange(projects);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const x = daysBetween(range.start, today) * zoomLevel;
    containerRef.current.scrollTo({
      left: x - containerRef.current.clientWidth / 3,
      behavior: 'smooth'
    });
  }, [projects, zoomLevel]);

  const value = {
    projects,
    setProjects,
    visibleProjects,
    toggleVisibility,
    zoomLevel,
    setZoomLevel,
    editingProjectId,
    modalOpen,
    openModal,
    closeModal,
    addProject,
    updateProject,
    deleteProject,
    containerRef,
    scrollToToday,
    ZOOM_MIN,
    ZOOM_MAX,
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}
