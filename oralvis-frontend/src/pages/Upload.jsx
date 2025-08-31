import React, { useState } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, CheckCircle, AlertCircle, Image } from 'lucide-react';

const Upload = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    scanType: '',
    region: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const scanTypes = [
    'Bitewing Radiograph',
    'Periapical Radiograph',
    'Panoramic Radiograph',
    'CBCT Scan',
    'Intraoral Photo',
    'Extraoral Photo'
  ];

  const regions = [
    'Upper Right Quadrant',
    'Upper Left Quadrant',
    'Lower Right Quadrant',
    'Lower Left Quadrant',
    'Full Mouth',
    'Anterior Region',
    'Posterior Region'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const uploadData = new FormData();
      uploadData.append('patientName', formData.patientName);
      uploadData.append('patientId', formData.patientId);
      uploadData.append('scanType', formData.scanType);
      uploadData.append('region', formData.region);
      uploadData.append('scanImage', selectedFile);

      await axios.post('http://localhost:5000/api/scans/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Scan uploaded successfully!' });
      
      // Reset form
      setFormData({
        patientName: '',
        patientId: '',
        scanType: '',
        region: ''
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Reset file input
      document.getElementById('scanImage').value = '';
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Upload failed. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <UploadIcon className="h-12 w-12 text-medical-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-medical-dark">Upload Patient Scan</h1>
        <p className="mt-2 text-gray-600">Upload dental scans and radiographs for patient records</p>
      </div>

      {message.text && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              required
              value={formData.patientName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter patient full name"
            />
          </div>
          
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID *
            </label>
            <input
              type="text"
              id="patientId"
              name="patientId"
              required
              value={formData.patientId}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter patient ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="scanType" className="block text-sm font-medium text-gray-700 mb-2">
              Scan Type *
            </label>
            <select
              id="scanType"
              name="scanType"
              required
              value={formData.scanType}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select scan type</option>
              {scanTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
              Region *
            </label>
            <select
              id="region"
              name="region"
              required
              value={formData.region}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select region</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="scanImage" className="block text-sm font-medium text-gray-700 mb-2">
            Scan Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-medical-primary transition-colors duration-200">
            <input
              type="file"
              id="scanImage"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="scanImage" className="cursor-pointer block">
              {previewUrl ? (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full h-48 object-contain mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600 text-center">Click to change image</p>
                </div>
              ) : (
                <div className="text-center">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to select scan image</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3"
        >
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <UploadIcon className="h-4 w-4" />
              <span>Upload Scan</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;