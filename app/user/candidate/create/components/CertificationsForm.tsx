import React, { useState, useEffect } from 'react';
import { FaPlus, FaCertificate, FaUpload, FaTimes, FaFilePdf, FaFileImage } from 'react-icons/fa';
import { Certification } from '../type';
import { v4 as uuidv4 } from 'uuid';

interface CertificationsFormProps {
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  setCertifications
}) => {
  console.log('CertificationsForm - Received certifications prop:', certifications);
  console.log('CertificationsForm - Type of certifications:', typeof certifications);
  console.log('CertificationsForm - Is certifications an array?', Array.isArray(certifications));

  // Normalize certifications to always be an array
  const normalizedCertifications = Array.isArray(certifications) ? certifications : [];

  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add useEffect to monitor prop changes
  useEffect(() => {
    console.log('CertificationsForm - certifications prop changed:', certifications);
    console.log('CertificationsForm - Type after change:', typeof certifications);
    console.log('CertificationsForm - Is array after change?', Array.isArray(certifications));
  }, [certifications]); const [currentCertification, setCurrentCertification] = useState<Certification>({
    id: '',
    name: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    noExpiration: false,
    credentialId: '',
    credentialURL: '',
    file: null
  });

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCertification(prev => ({ ...prev, [name]: value }));
  };
  const handleNoExpirationChange = () => {
    setCurrentCertification(prev => {
      const noExpiration = !prev.noExpiration;
      return {
        ...prev,
        noExpiration,
        expirationDate: noExpiration ? '' : prev.expirationDate
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentCertification(prev => ({ ...prev, file }));
    }
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <FaFilePdf className="text-red-500" />;
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) return <FaFileImage className="text-blue-500" />;
    return <FaFilePdf className="text-gray-500" />;
  };

  const saveCertification = () => {
    if (isEditMode) {
      setCertifications(prev =>
        prev.map(cert => cert.id === currentCertification.id ? currentCertification : cert)
      );
    } else {
      setCertifications(prev => [...prev, { ...currentCertification, id: uuidv4() }]);
    }
    setShowCertificationModal(false);
  }; const editCertification = (id: string) => {
    const certToEdit = normalizedCertifications.find(cert => cert.id === id);
    if (certToEdit) {
      setCurrentCertification(certToEdit);
      setIsEditMode(true);
      setShowCertificationModal(true);
    }
  };

  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Certifications</h2>        <button
          type="button"
          onClick={() => {
            setCurrentCertification({
              id: '',
              name: '',
              issuer: '',
              issueDate: '',
              expirationDate: '',
              noExpiration: false,
              credentialId: '',
              credentialURL: '',
              file: null
            });
            setIsEditMode(false);
            setShowCertificationModal(true);
          }}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm flex items-center"
        >
          <FaPlus className="mr-1" /> Add Certification
        </button>
      </div>
      {normalizedCertifications.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <FaCertificate className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No certifications added yet</p>
          <button
            type="button" onClick={() => {
              setCurrentCertification({
                id: '',
                name: '',
                issuer: '',
                issueDate: '',
                expirationDate: '',
                noExpiration: false,
                credentialId: '',
                credentialURL: '',
                file: null
              });
              setIsEditMode(false);
              setShowCertificationModal(true);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm inline-flex items-center"
          >
            <FaPlus className="mr-1" /> Add Certification
          </button>
        </div>) : (
        <div className="space-y-4">
          {normalizedCertifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{cert.name}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{cert.issuer}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Issued: {cert.issueDate}
                    {!cert.noExpiration && cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                    {cert.noExpiration && ' • No Expiration'}
                  </p>
                  {cert.credentialId && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => editCertification(cert.id)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCertification(cert.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>)}
      {/* Certification Modal */}
      {showCertificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Certification' : 'Add Certification'}
              </h3>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 pt-4 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4">
                <div>
                  <label htmlFor="certName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Certification Name*
                  </label>
                  <input
                    type="text"
                    id="certName"
                    name="name"
                    value={currentCertification.name}
                    onChange={handleCertificationChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issuing Organization*
                  </label>
                  <input
                    type="text"
                    id="issuer"
                    name="issuer"
                    value={currentCertification.issuer}
                    onChange={handleCertificationChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>

                <div>
                  <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issue Date*
                  </label>
                  <input
                    type="month"
                    id="issueDate"
                    name="issueDate"
                    value={currentCertification.issueDate}
                    onChange={handleCertificationChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="noExpiration"
                    checked={currentCertification.noExpiration}
                    onChange={handleNoExpirationChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="noExpiration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    This certification does not expire
                  </label>
                </div>

                {!currentCertification.noExpiration && (
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="month"
                      id="expirationDate"
                      name="expirationDate"
                      value={currentCertification.expirationDate}
                      onChange={handleCertificationChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    id="credentialId"
                    name="credentialId"
                    value={currentCertification.credentialId}
                    onChange={handleCertificationChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ABC123XYZ"
                  />
                </div>
                <div>
                  <label htmlFor="credentialURL" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    id="credentialURL"
                    name="credentialURL"
                    value={currentCertification.credentialURL}
                    onChange={handleCertificationChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., https://www.example.com/verify/ABC123XYZ"
                  />
                </div>

                {/* Certification File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Certification Document
                  </label>
                  <div className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                    {currentCertification.file ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(currentCertification.file)}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {currentCertification.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(currentCertification.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentCertification(prev => ({ ...prev, file: null }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Upload certification document (PDF, JPG, PNG)
                        </p>
                        <label className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 cursor-pointer text-sm inline-flex items-center">
                          <FaUpload className="mr-2" />
                          Choose File
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Accepted formats: PDF, JPG, PNG. Maximum file size: 5MB.
                  </p>
                </div>              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCertificationModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveCertification}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  {isEditMode ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsForm;

