// Helper/Data Module (roles/placement-officer/utils/officerIdentity.js):
// Supports Redux slices/components with data mapping, validation, or static configuration.
export function officerInitials(name = '') {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  const withoutTitle = words.filter((word) => !/^(dr|prof|mr|mrs|ms)\.?$/i.test(word));
  return (withoutTitle.length ? withoutTitle : words)
    .slice(0, 2).map((word) => word[0].toUpperCase()).join('') || 'PO';
}
