import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Skill } from '../type';
import { v4 as uuidv4 } from 'uuid';

interface SkillsFormProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  setSkills
}) => {
  const [skillName, setSkillName] = useState('');

  const addSkill = () => {
    if (skillName.trim()) {
      setSkills(prev => [...prev, { id: uuidv4(), name: skillName.trim() }]);
      setSkillName('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-1" /> Add
          </button>
        </div>
        
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
              >
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No skills added yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add skills to showcase your expertise to potential employers
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> Add both technical skills (e.g., programming languages, tools) and soft skills (e.g., leadership, communication) that are relevant to your target roles.
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;
