/**
 * Type-safe case model type detection utility
 */

export type CaseModelType = 'regular' | 'x2' | '10box' | '5box' | 'open' | 'stand';

/**
 * Determines the model type of a case based on its identifier
 * @param caseType - The case type identifier
 * @returns The model type classification
 */
export function getCaseModelType(caseType: string): CaseModelType {
  if (caseType.startsWith('10box-')) return '10box';
  if (caseType.startsWith('5box-')) return '5box';
  if (caseType.startsWith('zudo-stand-')) return 'stand';
  if (caseType.includes('open')) return 'open';
  if (caseType.includes('x2')) return 'x2';
  return 'regular';
}

/**
 * Type guards for specific model types
 */
export const isX2Model = (caseType: string): boolean => caseType.includes('x2');
export const is10BoxModel = (caseType: string): boolean => caseType.startsWith('10box-');
export const is5BoxModel = (caseType: string): boolean => caseType.startsWith('5box-');
export const isOpenModel = (caseType: string): boolean => caseType.includes('open');
export const isStandModel = (caseType: string): boolean => caseType.startsWith('zudo-stand-');

/**
 * Checks if a case model only supports single-color presets (YamiKage)
 */
export const isSingleColorOnlyModel = (caseType: string): boolean => {
  const modelType = getCaseModelType(caseType);
  return modelType === '10box' || modelType === 'stand';
};
