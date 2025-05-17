import React, { useState } from 'react';
import FacultyTileList from '../components/FacultyTileList';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/theme.css';

const DashboardPage = () => {
  const [showImage, setShowImage] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleProhorClick = () => {
    setShowImage(true);
    setIsExpanding(true);
    
    setTimeout(() => {
      setIsExpanding(false);
    }, 5000);
  };

  return (
    <DashboardLayout>
      <h1 className="section-title">ФАКУЛЬТЕТЫ</h1>
      <FacultyTileList />
      <h1 
        className="prohor" 
        onClick={handleProhorClick}
        style={{ cursor: 'default' }}
      >
        Прохор черный пидор
      </h1>
      
      {showImage && (
        <div 
          className={`prohor-image ${isExpanding ? 'expanding' : ''}`}
          style={{
            backgroundImage: 'url(https://i.ibb.co/KjwqDRkr/B9-C35-D3-F-2023-480-F-8845-C9710-A436-F24-1-105-c.jpg)' // Замените на реальную ссылку
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;