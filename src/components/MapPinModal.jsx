import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapPinModal = ({ isOpen, onClose, initialAddress, onSave, initialLat, initialLng }) => {
  const [center, setCenter] = useState([initialLat || 28.6139, initialLng || 77.2090]); // Default to Delhi if none
  const [address, setAddress] = useState(initialAddress || '');
  const [isDragging, setIsDragging] = useState(false);

  // Debounce for reverse geocoding
  const debounceTimeout = useRef(null);

  // Update center when modal opens if initial coords changed
  useEffect(() => {
    if (isOpen) {
      setCenter([initialLat || 28.6139, initialLng || 77.2090]);
      setAddress(initialAddress || '');
    }
  }, [isOpen, initialLat, initialLng, initialAddress]);

  // Custom component to handle map events
  const MapEvents = () => {
    useMapEvents({
      dragstart: () => {
        setIsDragging(true);
      },
      moveend: (e) => {
        setIsDragging(false);
        const map = e.target;
        const { lat, lng } = map.getCenter();
        setCenter([lat, lng]);
        
        // Reverse geocode
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                setAddress(data.display_name);
              }
            })
            .catch(err => console.error("Reverse geocoding error:", err));
        }, 500);
      }
    });
    return null;
  };

  const handleSave = () => {
    onSave({ address, lat: center[0], lng: center[1] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--color-navy)', borderRadius: '12px', width: '90%', maxWidth: '800px',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ color: 'var(--color-white)', margin: '0 0 8px 0', fontSize: '20px' }}>Adjust the site pin</h2>
          <p style={{ color: 'var(--color-muted-blue)', margin: 0, fontSize: '14px' }}>
            Drag the map so the centre crosshair sits exactly on the building entrance. The address line auto-resolves as you pan; save when it looks right.
          </p>
        </div>
        
        <div style={{ height: '400px', position: 'relative' }}>
          <MapContainer 
            center={center} 
            zoom={18} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            <MapUpdater center={center} />
            <MapEvents />
          </MapContainer>
          
          {/* Fixed center pin marker */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 1000,
            pointerEvents: 'none', transition: 'transform 0.2s',
            ...(isDragging ? { transform: 'translate(-50%, -120%) scale(1.1)' } : {})
          }}>
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0ZM16 22C12.686 22 10 19.314 10 16C10 12.686 12.686 10 16 10C19.314 10 22 12.686 22 16C22 19.314 19.314 22 16 22Z" fill="#00C2A8"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          </div>
        </div>
        
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-navy)', borderTop: '1px solid var(--color-border-light)' }}>
          <div style={{ color: 'var(--color-muted-blue)', fontSize: '14px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '24px' }}>
            {address || "Loading address..."}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{
              padding: '10px 20px', borderRadius: '24px', background: 'transparent', border: '1px solid var(--color-border-medium)',
              color: 'var(--color-white)', cursor: 'pointer', fontSize: '14px', fontWeight: 600
            }}>Cancel</button>
            <button onClick={handleSave} style={{
              padding: '10px 20px', borderRadius: '24px', background: 'var(--color-teal)', border: 'none',
              color: 'var(--color-navy)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 5.5L5 9L12.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPinModal;
