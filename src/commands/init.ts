import { Command } from 'commander';
import {
  isReactScannerInstalled,
  promptInstallReactScanner,
  installReactScanner,
} from '../utils/dependencies';

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Coming soon')
    .action(async () => {
      if (!isReactScannerInstalled()) {
        const shouldInstall = await promptInstallReactScanner();
        if (shouldInstall) {
          installReactScanner();
        } else {
          console.log('react-scanner is required to continue. Exiting.');
          process.exit(1);
        }
      }
      console.log('Coming soon...');
    });
}
