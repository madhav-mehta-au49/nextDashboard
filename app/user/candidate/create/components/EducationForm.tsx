import React, { useState } from 'react';
import { FaPlus, FaSchool } from 'react-icons/fa';
import { Education } from '../type';
import { v4 as uuidv4 } from 'uuid';

interface EducationFormProps {
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
}

const EducationForm: React.FC<EducationFormProps> = ({
  educations,
  setEducations
}) => {
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    id: '',
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationCheckbox = () => {
    setCurrentEducation(prev => ({ ...prev, current: !prev.current }));
  };

  const saveEducation = () => {
    if (isEditMode) {
      setEducations(prev => 
        prev.map(edu => edu.id === currentEducation.id ? currentEducation : edu)
      );
    } else {
      setEducations(prev => [...prev, { ...currentEducation, id: uuidv4() }]);
    }
    setShowEducationModal(false);
  };

  const editEducation = (id: string) => {
    const eduToEdit = educations.find(edu => edu.id === id);
    if (eduToEdit) {
      setCurrentEducation(eduToEdit);
      setIsEditMode(true);
      setShowEducationModal(true);
    }
  };

  const deleteEducation = (id: string) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
        <button
          type="button"
          onClick={() => {
            setCurrentEducation({
              id: '',
              institution: '',
              degree: '',
              field: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            });
            setIsEditMode(false);
            setShowEducationModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
        >
          <FaPlus className="mr-1" /> Add Education
        </button>
      </div>
      
      {educations.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <FaSchool className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No education added yet</p>
          <button
            type="button"
            onClick={() => {
              setCurrentEducation({
                id: '',
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
              });
              setIsEditMode(false);
              setShowEducationModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center"
          >
            <FaPlus className="mr-1" /> Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div 
              key={edu.id} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{edu.institution}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => editEducation(edu.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEducation(edu.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {edu.description && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isEditMode ? 'Edit Education' : 'Add Education'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School/Institution*
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={currentEducation.institution}
                  onChange={handleEducationChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Stanford University"
                />
              </div>
              
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Degree*
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleEducationChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              
              <div>
                <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  id="field"
                  name="field"
                  value={currentEducation.field}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Computer Science"
                />
              </div>
              
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="eduCurrent"
                  checked={currentEducation.current}
                  onChange={handleEducationCheckbox}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="eduCurrent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I am currently studying here
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="eduStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date*
                  </label>
                  <input
                    type="month"
                    id="eduStartDate"
                    name="startDate"
                    value={currentEducation.startDate}
                    onChange={handleEducationChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                {!currentEducation.current && (
                  <div>
                    <label htmlFor="eduEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date*
                    </label>
                    <input
                      type="month"
                      id="eduEndDate"
                      name="endDate"
                      value={currentEducation.endDate}
                      onChange={handleEducationChange}
                      required={!currentEducation.current}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="eduDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="eduDescription"
                  name="description"
                  value={currentEducation.description}
                  onChange={handleEducationChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your studies, achievements, activities..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEducationModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEducation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

export default EducationForm;
