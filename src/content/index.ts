import { initPageDetection } from './page-detection';
import { initCategoryBadges } from './category-display';
import { initAuditPanel } from './audit-panel';
import { initLocalScan } from './local-scan';

const cleanupPageDetection = initPageDetection();
const cleanupCategoryBadges = initCategoryBadges();
const cleanupAuditPanel = initAuditPanel();
const cleanupLocalScan = initLocalScan();
