import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import MapPinModal from './MapPinModal';

const SiteAddressInput = ({ value, onChange, onCoordsChange, lat, lng }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const debounceTimeout = useRef(null);

  // Sync internal query with external value if changed from outside (except during active typing)
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const fetchSuggestions = (text) => {
    if (!text || text.length < 3) {
      setSuggestions([]);
      return;
    }
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`)
      .then(res => res.json())
      .then(data => {
        setSuggestions(data);
        setShowDropdown(true);
      })
      .catch(err => console.error("Autocomplete error:", err));
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    onChange(text);
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchSuggestions(text), 400);
  };

  const handleSelectSuggestion = (s) => {
    setQuery(s.display_name);
    onChange(s.display_name);
    if (onCoordsChange) {
      onCoordsChange(parseFloat(s.lat), parseFloat(s.lon));
    }
    setShowDropdown(false);
  };

  const handleModalSave = (result) => {
    setQuery(result.address);
    onChange(result.address);
    if (onCoordsChange) {
      onCoordsChange(result.lat, result.lng);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input 
        required 
        type="text" 
        value={query} 
        onChange={handleInputChange} 
        className="form-input" 
        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Search the area or use the crosshair to capture your current location."
      />
      
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border-medium)',
          borderRadius: '8px', marginTop: '4px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {suggestions.map((s, i) => (
            <div 
              key={i} 
              onClick={() => handleSelectSuggestion(s)}
              style={{
                padding: '12px 16px', cursor: 'pointer', color: 'var(--color-white)', fontSize: '14px',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-border-medium)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {s.display_name}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
          <MapPin size={14} /> 
          Pinned to exact location - satellite view is accurate
        </div>
        
        {/* Clickable Map Thumbnail - Simplified to use a static iframe or image to save resources */}
        <div 
          onClick={() => setIsModalOpen(true)}
          style={{
            height: '140px', width: '100%', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
            border: '1px solid var(--color-border-light)', transition: 'border-color 0.2s', position: 'relative',
            backgroundColor: 'var(--color-bg-subtle)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-teal)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border-light)'}
        >
          {lat && lng ? (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }}
              src={`https://maps.google.com/maps?q=${lat},${lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
              title="Site Map Thumbnail"
            ></iframe>
          ) : (
             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-blue)', fontSize: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <MapPin size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <div>Click to drop pin on map</div>
                </div>
             </div>
          )}
          
          {/* Overlay to catch clicks and prevent iframe interaction */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}></div>
        </div>
      </div>

      <MapPinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialAddress={query}
        initialLat={lat}
        initialLng={lng}
        onSave={handleModalSave} 
      />
    </div>
  );
};

export default SiteAddressInput;
