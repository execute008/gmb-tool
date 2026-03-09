import { initPageDetection } from './page-detection';
import { initCategoryBadges } from './category-display';
import { initAuditPanel } from './audit-panel';

const cleanupPageDetection = initPageDetection();
const cleanupCategoryBadges = initCategoryBadges();
const cleanupAuditPanel = initAuditPanel();
