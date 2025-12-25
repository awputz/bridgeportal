/**
 * Convert image URL to base64
 */
const imageToBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix to get just the base64 content
        const base64Content = base64.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

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
}, photoBase64?: string | null): string => {
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

  // Add photo if available
  if (photoBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
  }
  
  lines.push('END:VCARD');
  
  return lines.join('\r\n');
};

/**
 * Download a vCard file for a team member (with photo support)
 */
export const downloadVCard = async (member: {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  image?: string;
}): Promise<void> => {
  // Fetch and convert photo to base64 if available
  let photoBase64: string | null = null;
  if (member.image) {
    photoBase64 = await imageToBase64(member.image);
  }

  const vCardData = generateVCard(member, photoBase64);
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
