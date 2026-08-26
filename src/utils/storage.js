import { supabase } from './supabaseClient';

const PROPOSALS_KEY = 'vykon_proposals'; // Fallback key

export const getProposals = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching proposals from Supabase:', error.message);
      // Fallback to local storage if network fails
      return getLocalProposals();
    }
  } else {
    return getLocalProposals();
  }
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

export const getSavedImages = () => {
  try {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : { covers: [], watermarks: [] };
  } catch (e) {
    console.error("Error reading saved images", e);
    return { covers: [], watermarks: [] };
  }
};

export const saveImageToLibrary = (type, base64Data) => {
  try {
    const images = getSavedImages();
    if (type === 'cover') {
      images.covers.push(base64Data);
    } else if (type === 'watermark') {
      images.watermarks.push(base64Data);
    }
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    return true;
  } catch (e) {
    console.error("Error saving image to library. LocalStorage might be full.", e);
    alert("Failed to save image. Local storage might be full.");
    return false;
  }
};
