import { create } from "zustand";
import type { ResumeContent } from "@resume-maker/types";

interface EditorState {
  // Current resume being edited
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;

  // Resume content
  resumeContent: ResumeContent | null;
  setResumeContent: (content: ResumeContent | null) => void;

  // Selected section for editing
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;

  // Unsaved changes tracking
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Current job being targeted
  targetJobId: string | null;
  setTargetJobId: (id: string | null) => void;

  // Tailored content (after AI processing)
  tailoredContent: ResumeContent | null;
  setTailoredContent: (content: ResumeContent | null) => void;

  // Reset editor state
  resetEditor: () => void;
}

const initialState = {
  currentResumeId: null,
  resumeContent: null,
  selectedSection: null,
  hasUnsavedChanges: false,
  targetJobId: null,
  tailoredContent: null,
};

export const useEditorStore = create<EditorState>()((set) => ({
  ...initialState,

  setCurrentResumeId: (id) => set({ currentResumeId: id }),
  setResumeContent: (content) => set({ resumeContent: content, hasUnsavedChanges: false }),
  setSelectedSection: (section) => set({ selectedSection: section }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  setTargetJobId: (id) => set({ targetJobId: id }),
  setTailoredContent: (content) => set({ tailoredContent: content }),
  resetEditor: () => set(initialState),
}));
