import React from 'react';

import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import FaceIcon from '@mui/icons-material/Face';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

export const roles = ['student', 'parent', 'teacher', 'counseling'];

const getEmptyQuestionForEachRole = () => Object.fromEntries(roles.map(role => [role, []]));

export const roleProfiles = [
  { id: 0, display: '學生', label: 'student', icon: <FaceIcon /> },
  { id: 1, display: '家長', label: 'parent', icon: <FamilyRestroomIcon /> },
  { id: 2, display: '導師', label: 'teacher', icon: <CastForEducationIcon /> },
  { id: 3, display: '輔師', label: 'counseling', icon: <CastForEducationIcon /> },
];

export const optionsCountList = Array(10)
  .fill()
  .map((_, idx) => ({ value: idx, label: idx.toString() }));

// Using an empty string to clear the component or `undefined` for uncontrolled components
export const formEmptyValues = {
  researchName: [],
  formName: '',
  formCustId: '',
  minScore: '', // If set to zero, the input box will be filled with zero. But I want user to select themselves
  optionsCount: '',
  formTitle: {},
  formIntro: {},
  // This will be assigned to questionState afterward
  questions: getEmptyQuestionForEachRole(),
};

export const questionsEmptyState = getEmptyQuestionForEachRole();

export const getDefaultQuestionState = ({ id }) => ({ id, label: '', options: [] });

export const createFormActionType = {
  ADD_QUESTION: 'ADD_QUESTION',
  SET_QUESTION: 'SET_QUESTION',
  REMOVE_QUESTION: 'REMOVE_QUESTION',
  ADD_STUDENT_QUESTION: 'ADD_STUDENT_QUESTION_COUNT',
  ADD_PARENT_QUESTION: 'ADD_PARENT_QUESTION_COUNT',
  ADD_TEACHER_QUESTION: 'ADD_TEACHER_QUESTION_COUNT',
  ADD_COUNSELING_QUESTION: 'ADD_COUNSELING_QUESTION_COUNT',
  SET_STUDENT_QUESTION: 'SET_STUDENT_QUESTION',
  SET_PARENT_QUESTION: 'SET_PARENT_QUESTION',
  SET_COUNSELING_QUESTION: 'SET_COUNSELING_QUESTION',
};
