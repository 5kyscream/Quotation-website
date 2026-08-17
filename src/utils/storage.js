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
