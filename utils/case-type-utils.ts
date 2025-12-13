/**
 * Utility functions for case type detection and analysis
 */

/**
 * Determines if a case type is an X2 (double) model
 */
export function isX2Model(caseType: string): boolean {
  return caseType.includes('x2');
}

/**
 * Determines if a case type is an open model
 */
export function isOpenModel(caseType: string): boolean {
  return caseType.includes('open');
}

/**
 * Determines if a case type is an upgrade model
 */
export function isUpgradeModel(caseType: string): boolean {
  return caseType.includes('upgrade');
}

/**
 * Determines the material type from a case type string
 * Returns '3dp' for 3D printed models, 'acrylic' for acrylic models
 */
export function getMaterialFromCaseType(caseType: string): '3dp' | 'acrylic' {
  return caseType.includes('3dp') ? '3dp' : 'acrylic';
}
