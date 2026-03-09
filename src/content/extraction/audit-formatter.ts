import type { BusinessProfileData } from './profile-extractor';

export type AuditSectionName = 'basicInfo' | 'contact' | 'reviews' | 'attributes' | 'links';

interface FieldDef {
  key: keyof BusinessProfileData;
  label: string;
}

const SECTION_FIELDS: Record<AuditSectionName, FieldDef[]> = {
  basicInfo: [
    { key: 'name', label: 'Name' },
    { key: 'placeId', label: 'Place ID' },
    { key: 'cid', label: 'CID' },
    { key: 'primaryCategory', label: 'Category' },
    { key: 'secondaryCategories', label: 'Other Categories' },
  ],
  contact: [
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
  ],
  reviews: [
    { key: 'rating', label: 'Rating' },
    { key: 'reviewCount', label: 'Reviews' },
    { key: 'reviewUrl', label: 'Review URL' },
  ],
  attributes: [
    { key: 'hours', label: 'Hours' },
    { key: 'attributes', label: 'Attributes' },
  ],
  links: [
    { key: 'directionsUrl', label: 'Directions' },
    { key: 'mapsUrl', label: 'Maps URL' },
    { key: 'website', label: 'Website' },
  ],
};

function formatFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : null;
  }
  return String(value);
}

function formatFields(data: BusinessProfileData, fields: FieldDef[]): string {
  const lines: string[] = [];
  for (const { key, label } of fields) {
    const formatted = formatFieldValue(data[key]);
    if (formatted) {
      lines.push(`${label}: ${formatted}`);
    }
  }
  return lines.join('\n');
}

/** Format all profile data as structured text with labels */
export function formatAsText(data: BusinessProfileData): string {
  const allFields: FieldDef[] = [
    { key: 'name', label: 'Name' },
    { key: 'placeId', label: 'Place ID' },
    { key: 'cid', label: 'CID' },
    { key: 'primaryCategory', label: 'Category' },
    { key: 'secondaryCategories', label: 'Other Categories' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviewCount', label: 'Reviews' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
    { key: 'hours', label: 'Hours' },
    { key: 'attributes', label: 'Attributes' },
    { key: 'reviewUrl', label: 'Review URL' },
    { key: 'directionsUrl', label: 'Directions' },
    { key: 'mapsUrl', label: 'Maps URL' },
  ];
  return formatFields(data, allFields);
}

/** Format profile data as pretty-printed JSON */
export function formatAsJson(data: BusinessProfileData): string {
  return JSON.stringify(data, null, 2);
}

/** Format a specific section as text */
export function formatSectionAsText(data: BusinessProfileData, section: AuditSectionName): string {
  const fields = SECTION_FIELDS[section];
  if (!fields) return '';
  return formatFields(data, fields);
}

/** Get section field definitions for building UI */
export { SECTION_FIELDS };
