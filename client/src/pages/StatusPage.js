import React from 'react';

const StatusPage = ({ apiStatus, newsStatus, newsData }) => {
  return (
    <div style={{
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Investimon Platform - System Status</h1>
      
      <div style={{
        background: '#f5f5f5',
        padding: '1rem',
        borderRadius: '4px',
        marginBottom: '2rem'
      }}>
        <h2>Connection Status</h2>
        <p><strong>Main API:</strong> {apiStatus}</p>
        <p><strong>News API:</strong> {newsStatus}</p>
      </div>

      {newsData.length > 0 && (
        <div>
          <h2>Latest News</h2>
          {newsData.map(item => (
            <div key={item.id} style={{
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: item.priceChange > 0 ? '#e6ffe6' : '#ffe6e6'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h3>{item.characterName}</h3>
                <span style={{
                  color: item.priceChange > 0 ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {item.priceChange > 0 ? '+' : ''}{item.priceChange.toFixed(2)}
                </span>
              </div>
              <h4>{item.news.title}</h4>
              <p>{item.news.description}</p>
              <div style={{color: '#666', fontSize: '0.8rem'}}>
                Source: {item.news.source} | Published: {new Date(item.news.publishedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusPage; 