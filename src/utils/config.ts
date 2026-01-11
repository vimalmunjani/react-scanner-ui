import { writeFileSync, existsSync, readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import * as logger from './logger.js';

const IGNORE_ENTRY = '.react-scanner-ui/';
const IGNORE_COMMENT = '# React Scanner UI';

interface IgnoreFileConfig {
  filename: string;
  displayName: string;
}

const IGNORE_FILES: IgnoreFileConfig[] = [
  { filename: '.gitignore', displayName: '.gitignore' },
  { filename: '.eslintignore', displayName: '.eslintignore' },
  { filename: '.prettierignore', displayName: '.prettierignore' },
];

/**
 * Check if an ignore file already contains the react-scanner-ui entry
 */
function hasIgnoreEntry(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }

  const content = readFileSync(filePath, 'utf-8');
  return content.includes(IGNORE_ENTRY);
}

/**
 * Add react-scanner-ui entry to an ignore file
 */
function addIgnoreEntry(filePath: string): boolean {
  try {
    const entryWithComment = `\n${IGNORE_COMMENT}\n${IGNORE_ENTRY}\n`;

    if (!existsSync(filePath)) {
      // Create the file with the entry
      writeFileSync(filePath, `${IGNORE_COMMENT}\n${IGNORE_ENTRY}\n`);
      return true;
    }

    // Append to existing file
    appendFileSync(filePath, entryWithComment);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update all ignore files to exclude .react-scanner-ui/
 */
export function updateIgnoreFiles(): void {
  const cwd = process.cwd();
  const updatedFiles: string[] = [];
  const skippedFiles: string[] = [];
  const failedFiles: string[] = [];

  for (const ignoreFile of IGNORE_FILES) {
    const filePath = join(cwd, ignoreFile.filename);

    if (hasIgnoreEntry(filePath)) {
      skippedFiles.push(ignoreFile.displayName);
      continue;
    }

    if (addIgnoreEntry(filePath)) {
      updatedFiles.push(ignoreFile.displayName);
    } else {
      failedFiles.push(ignoreFile.displayName);
    }
  }

  // Log results
  if (updatedFiles.length > 0) {
    logger.success(
      `Added ${logger.bold(IGNORE_ENTRY)} to: ${updatedFiles.join(', ')}`
    );
  }

  if (skippedFiles.length > 0) {
    logger.dim(`Already configured in: ${skippedFiles.join(', ')}`);
  }

  if (failedFiles.length > 0) {
    logger.warning(`Failed to update: ${failedFiles.join(', ')}`);
  }
}

export interface ScannerConfigOptions {
  crawlFrom: string;
  importedFrom: string;
}

export function createReactScannerConfig(options: ScannerConfigOptions): void {
  const configPath = join(process.cwd(), 'react-scanner.config.js');

  if (existsSync(configPath)) {
    logger.info('react-scanner.config.js already exists.');
    return;
  }

  const configContent = `module.exports = {
  crawlFrom: '${options.crawlFrom}',
  includeSubComponents: true,
  importedFrom: '${options.importedFrom}',
  processors: [
    ['count-components-and-props', { outputTo: './.react-scanner-ui/scan-report.json' }],
  ],
};
`;

  try {
    writeFileSync(configPath, configContent);
    logger.success('Created react-scanner.config.js');
  } catch (error) {
    logger.errorBox(
      'Configuration Error',
      `Failed to create react-scanner.config.js\n${error}`
    );
  }
}
