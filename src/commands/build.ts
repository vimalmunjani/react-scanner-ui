import { Command } from 'commander';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { checkPeerDependency } from '../utils/dependencies.js';
import {
  getScanData,
  readScannerConfig,
  getOutputFile,
} from '../utils/scannerConfig.js';
import { logger } from '../utils/index.js';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the path to the UI directory.
 * Works both in development (src/) and production (dist/)
 */
function getUiRoot(): string {
  // __dirname will be either src/commands or dist/commands
  // UI is always at project-root/ui
  const currentDir = __dirname;

  // Go up from commands/ to src/ or dist/, then up to project root, then into ui/
  return resolve(currentDir, '../../ui');
}

/**
 * Build the React Scanner Studio and output to consumer's .react-scanner-studio/ folder
 */
async function runBuild(): Promise<void> {
  const consumerRoot = process.cwd();
  const outputDir = resolve(consumerRoot, '.react-scanner-studio');

  logger.infoBox(
    'React Scanner Studio',
    'Building static files for production...'
  );

  // Step 1: Get the scan data
  logger.startSpinner('Reading scan data...');
  const scanResult = await getScanData();

  if (scanResult.error) {
    logger.spinnerError('Failed to read scan data');
    logger.errorBox('Error', scanResult.error);
    process.exit(1);
  }

  if (!scanResult.data) {
    logger.spinnerError('Failed to read scan data');
    logger.errorBox('Error', 'No scan data found.');
    process.exit(1);
  }

  logger.spinnerSuccess('Scan data loaded');

  // Step 2: Build the UI with Vite
  logger.startSpinner('Building UI with Vite...');

  const { build } = await import('vite');
  const react = (await import('@vitejs/plugin-react')).default;

  const uiRoot = getUiRoot();

  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Get the scan data file name from config
  const config = await readScannerConfig();
  const scanFile = config ? getOutputFile(config) : null;
  const scanFileName = scanFile ? basename(scanFile) : 'scan-data.json';

  try {
    await build({
      root: uiRoot,
      plugins: [react()],
      base: './', // Use relative paths for assets
      build: {
        outDir: outputDir,
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          '@': resolve(uiRoot, 'src'),
        },
      },
      logLevel: 'warn', // Reduce noise during build
    });
  } catch (error) {
    logger.spinnerError('Vite build failed');
    logger.errorBox('Build Error', String(error));
    process.exit(1);
  }

  logger.spinnerSuccess('UI built successfully');

  // Step 3: Write the scan data as a JSON file (using same filename from config)
  logger.startSpinner('Embedding scan data...');
  const scanDataPath = resolve(outputDir, scanFileName);
  writeFileSync(
    scanDataPath,
    JSON.stringify({ data: scanResult.data, error: null }, null, 2)
  );

  // Step 4: Create a custom index.html that loads scan data from the JSON file
  // We need to modify the built index.html to handle static data loading
  const indexPath = resolve(outputDir, 'index.html');
  const { readFileSync } = await import('fs');
  let indexHtml = readFileSync(indexPath, 'utf-8');

  // Inject a script that intercepts fetch calls to /api/scan-data
  const injectScript = `
    <script>
      // Intercept fetch for static build
      const originalFetch = window.fetch;
      window.fetch = async function(url, options) {
        if (url === '/api/scan-data' || url.endsWith('/api/scan-data')) {
          const response = await originalFetch('./${scanFileName}', options);
          return response;
        }
        return originalFetch(url, options);
      };
    </script>
  `;

  // Inject the script before the closing </head> tag
  indexHtml = indexHtml.replace('</head>', `${injectScript}</head>`);
  writeFileSync(indexPath, indexHtml);

  logger.spinnerSuccess('Scan data embedded');

  // Display build complete message
  logger.buildComplete(outputDir, [`npx serve ${outputDir}`]);
}

export function buildCommand(program: Command): void {
  program
    .command('build')
    .description(
      'Build the React Scanner Studio as static files to .react-scanner-studio/'
    )
    .action(async () => {
      checkPeerDependency();
      await runBuild();
    });
}
