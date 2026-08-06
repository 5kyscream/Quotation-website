const PROPOSALS_KEY = 'vykon_proposals';

export const getProposals = () => {
  const data = localStorage.getItem(PROPOSALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProposal = (proposal) => {
  const proposals = getProposals();
  const existingIndex = proposals.findIndex(p => p.id === proposal.id);
  
  if (existingIndex >= 0) {
    proposals[existingIndex] = proposal;
  } else {
    proposals.push(proposal);
  }
  
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
};

export const deleteProposal = (id) => {
  const proposals = getProposals();
  const filtered = proposals.filter(p => p.id !== id);
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(filtered));
};
