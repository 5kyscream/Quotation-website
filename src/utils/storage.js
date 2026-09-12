import { supabase } from './supabaseClient';

const PROPOSALS_KEY = 'vykon_proposals'; // Fallback key

export const getProposals = async () => {
  let dbProposals = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        dbProposals = data;
      } else if (error) {
        console.error('Error fetching proposals from Supabase:', error.message);
      }
    } catch (error) {
      console.error('Error fetching proposals from Supabase:', error.message);
    }
  }
  
  const localProposals = getLocalProposals();
  
  // Merge DB and local, preferring DB if duplicate IDs exist
  const combined = [...localProposals, ...dbProposals];
  const uniqueMap = new Map();
  combined.forEach(p => {
    // Use proposalNumber as secondary key if id is missing
    const key = p.id || p.proposalNumber;
    uniqueMap.set(key, p);
  });
  
  const allProposals = Array.from(uniqueMap.values());
  // Sort by date (newest first)
  return allProposals.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateB - dateA;
  });
};

export const getProposalById = async (id) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching proposal by ID from Supabase:', error.message);
      return getLocalProposals().find(p => p.id === id);
    }
  } else {
    return getLocalProposals().find(p => p.id === id);
  }
};

export const getNextProposalNumber = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('get_next_proposal_number');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching global proposal number:', error.message);
      // Fallback local logic if DB fails
      return `VP-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  } else {
    return `VP-${Math.floor(1000 + Math.random() * 9000)}`;
  }
};

export const saveProposal = async (proposal) => {
  if (supabase) {
    try {
      // Remove local 'id' as Supabase uses a UUID DB-generated id, unless it's an update.
      // Our form just creates new proposals, so we'll just insert.
      const { id, ...proposalData } = proposal; 
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        proposalData.user_id = user.id;
        proposalData.user_email = user.email;
      }
      
      const { data, error } = await supabase
        .from('proposals')
        .insert([proposalData])
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving to Supabase:', error.message);
      saveLocalProposal(proposal);
      return proposal;
    }
  } else {
    saveLocalProposal(proposal);
    return proposal;
  }
};

export const deleteProposal = async (id) => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting from Supabase:', error.message);
      deleteLocalProposal(id);
    }
  } else {
    deleteLocalProposal(id);
  }
};

// --- Fallback Local Storage Methods ---

const getLocalProposals = () => {
  const data = localStorage.getItem(PROPOSALS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalProposal = (proposal) => {
  const proposals = getLocalProposals();
  const existingIndex = proposals.findIndex(p => p.id === proposal.id);
  
  if (existingIndex >= 0) {
    proposals[existingIndex] = proposal;
  } else {
    proposals.push(proposal);
  }
  
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
};

const deleteLocalProposal = (id) => {
  const proposals = getLocalProposals();
  const filtered = proposals.filter(p => p.id !== id);
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(filtered));
};

// --- Image Library Storage ---

const IMAGES_KEY = 'vykon_saved_images';

const base64ToBlob = (base64) => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

export const getSavedImages = async () => {
  if (supabase) {
    try {
      const coversMap = new Map();
      const backgroundsMap = new Map();
      
      // Fetch Covers
      const { data: coverFiles } = await supabase.storage.from('public-images').list('covers');
      if (coverFiles) {
        coverFiles.forEach(file => {
          if (file.name !== '.emptyFolderPlaceholder') {
            const { data } = supabase.storage.from('public-images').getPublicUrl(`covers/${file.name}`);
            const key = file.metadata?.size || file.name;
            if (!coversMap.has(key)) coversMap.set(key, data.publicUrl);
          }
        });
      }

      // Fetch Backgrounds
      const { data: backgroundFiles } = await supabase.storage.from('public-images').list('backgrounds');
      if (backgroundFiles) {
        backgroundFiles.forEach(file => {
          if (file.name !== '.emptyFolderPlaceholder' && file.id) {
            const { data } = supabase.storage.from('public-images').getPublicUrl(`backgrounds/${file.name}`);
            const key = file.metadata?.size || file.name;
            if (!backgroundsMap.has(key)) backgroundsMap.set(key, data.publicUrl);
          }
        });
      }

      // Fetch Root Files
      const { data: rootFiles } = await supabase.storage.from('public-images').list('');
      if (rootFiles) {
        rootFiles.forEach(file => {
          // files have an id, folders generally don't in Supabase list API
          if (file.name !== '.emptyFolderPlaceholder' && file.id) {
            const { data } = supabase.storage.from('public-images').getPublicUrl(`${file.name}`);
            const key = file.metadata?.size || file.name;
            if (!backgroundsMap.has(key)) backgroundsMap.set(key, data.publicUrl);
            if (!coversMap.has(key)) coversMap.set(key, data.publicUrl);
          }
        });
      }
      
      return { 
        covers: Array.from(coversMap.values()), 
        backgrounds: Array.from(backgroundsMap.values()) 
      };
    } catch (e) {
      console.error("Error fetching images from Supabase", e);
    }
  }

  try {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : { covers: [], backgrounds: [] };
  } catch (e) {
    console.error("Error reading saved images", e);
    return { covers: [], backgrounds: [] };
  }
};

export const saveImageToLibrary = async (type, base64Data) => {
  if (supabase) {
    try {
      const blob = base64ToBlob(base64Data);
      const filename = `${type}s/${Date.now()}.png`; // e.g. covers/12345.png
      
      const { error } = await supabase.storage
        .from('public-images')
        .upload(filename, blob, {
          contentType: blob.type,
          upsert: false
        });
        
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Error uploading image to Supabase", e);
      // Fallback to local storage logic below
    }
  }

  try {
    const data = localStorage.getItem(IMAGES_KEY);
    const images = data ? JSON.parse(data) : { covers: [], backgrounds: [] };
    if (type === 'cover') {
      images.covers.push(base64Data);
    } else if (type === 'background') {
      images.backgrounds.push(base64Data);
    }
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    return true;
  } catch (e) {
    console.error("Error saving image to library. LocalStorage might be full.", e);
    alert("Failed to save image. Local storage might be full.");
    return false;
  }
};
