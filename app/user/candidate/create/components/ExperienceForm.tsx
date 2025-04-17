import React, { useState } from 'react';
import { FaPlus, FaBriefcase } from 'react-icons/fa';
import { Experience } from '../type';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceFormProps {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  setExperiences
}) => {
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceCheckbox = () => {
    setCurrentExperience(prev => ({ ...prev, current: !prev.current }));
  };

  const saveExperience = () => {
    if (isEditMode) {
      setExperiences(prev => 
        prev.map(exp => exp.id === currentExperience.id ? currentExperience : exp)
      );
    } else {
      setExperiences(prev => [...prev, { ...currentExperience, id: uuidv4() }]);
    }
    setShowExperienceModal(false);
  };

  const editExperience = (id: string) => {
    const expToEdit = experiences.find(exp => exp.id === id);
    if (expToEdit) {
      setCurrentExperience(expToEdit);
      setIsEditMode(true);
      setShowExperienceModal(true);
    }
  };

  const deleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
        <button
          type="button"
          onClick={() => {
            setCurrentExperience({
              id: '',
              title: '',
              company: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            });
            setIsEditMode(false);
            setShowExperienceModal(true);
          }}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm flex items-center"
        >
          <FaPlus className="mr-1" /> Add Experience
        </button>
      </div>
      
      {experiences.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <FaBriefcase className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No work experience added yet</p>
          <button
            type="button"
            onClick={() => {
              setCurrentExperience({
                id: '',
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
              });
              setIsEditMode(false);
              setShowExperienceModal(true);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm inline-flex items-center"
          >
            <FaPlus className="mr-1" /> Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{exp.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{exp.company}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.location && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.location}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => editExperience(exp.id)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteExperience(exp.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {exp.description && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isEditMode ? 'Edit Experience' : 'Add Experience'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentExperience.title}
                  onChange={handleExperienceChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company*
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={currentExperience.company}
                  onChange={handleExperienceChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Tech Company Inc."
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={currentExperience.location}
                  onChange={handleExperienceChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={currentExperience.current}
                  onChange={handleExperienceCheckbox}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="current" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I currently work here
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date*
                  </label>
                  <input
                    type="month"
                    id="startDate"
                    name="startDate"
                    value={currentExperience.startDate}
                    onChange={handleExperienceChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {!currentExperience.current && (
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date*
                      </label>
                      <input
                        type="month"
                        id="endDate"
                        name="endDate"
                        value={currentExperience.endDate}
                        onChange={handleExperienceChange}
                        required={!currentExperience.current}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentExperience.description}
                    onChange={handleExperienceChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowExperienceModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveExperience}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  {isEditMode ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ExperienceForm;
  
