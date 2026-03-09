import { describe, it, expect } from 'vitest';
import manifest from '../manifest.json';

describe('MV3 Manifest', () => {
  it('has manifest_version 3', () => {
    expect(manifest.manifest_version).toBe(3);
  });

  it('has content_scripts matching Google Maps', () => {
    expect(manifest.content_scripts).toBeDefined();
    expect(manifest.content_scripts![0].matches).toContain(
      '*://www.google.com/maps/*'
    );
  });

  it('has background service_worker defined', () => {
    expect(manifest.background).toBeDefined();
    expect(manifest.background!.service_worker).toBeDefined();
  });

  it('has correct permissions', () => {
    expect(manifest.permissions).toContain('activeTab');
    expect(manifest.permissions).toContain('storage');
  });
});
