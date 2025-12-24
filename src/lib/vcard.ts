/**
 * Generate vCard (VCF) data for a team member
 */
export const generateVCard = (member: {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  image?: string;
}): string => {
  // Parse name into structured format (Last;First;;;)
  const nameParts = member.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${member.name}`,
    `N:${lastName};${firstName};;;`,
  ];
  
  if (member.title) {
    lines.push(`TITLE:${member.title}`);
  }
  
  lines.push('ORG:Bridge Advisory Group');
  
  if (member.email) {
    lines.push(`EMAIL;TYPE=WORK:${member.email}`);
  }
  
  if (member.phone) {
    // Clean phone number for vCard
    const cleanPhone = member.phone.replace(/[^\d+]/g, '');
    lines.push(`TEL;TYPE=WORK,VOICE:${cleanPhone}`);
  }
  
  if (member.linkedin) {
    lines.push(`URL;TYPE=LinkedIn:${member.linkedin}`);
  }
  
  lines.push('END:VCARD');
  
  return lines.join('\r\n');
};

/**
 * Download a vCard file for a team member
 */
export const downloadVCard = (member: Parameters<typeof generateVCard>[0]): void => {
  const vCardData = generateVCard(member);
  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${member.name.replace(/\s+/g, '-').toLowerCase()}.vcf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
