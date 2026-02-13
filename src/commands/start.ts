import { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import { checkPeerDependency } from '../utils/dependencies.js';
import { getServerPort } from '../utils/port.js';
import { startServer } from '../server/index.js';
import { logger, inquirerTheme } from '../utils/index.js';

const DEFAULT_PORT = 3000;

/**
 * Prompt user to confirm using a different port (like Storybook does)
 */
async function promptForPortChange(
  requestedPort: number,
  availablePort: number
): Promise<boolean> {
  logger.warning(
    `Port ${logger.bold(String(requestedPort))} is not available.`
  );

  const shouldChangePort = await confirm({
    message: `Would you like to run on port ${availablePort} instead?`,
    default: true,
    theme: inquirerTheme,
  });

  return shouldChangePort;
}

/**
 * Open the browser to the given URL
 */
async function openBrowser(url: string): Promise<void> {
  const { platform } = process;

  try {
    const { exec } = await import('child_process');

    let command: string;
    if (platform === 'darwin') {
      command = `open "${url}"`;
    } else if (platform === 'win32') {
      command = `start "" "${url}"`;
    } else {
      // Linux and other platforms
      command = `xdg-open "${url}"`;
    }

    exec(command, error => {
      if (error) {
        logger.info(
          `Could not open browser automatically. Please visit: ${logger.link(url)}`
        );
      }
    });
  } catch {
    logger.info(
      `Could not open browser automatically. Please visit: ${logger.link(url)}`
    );
  }
}

export function startCommand(program: Command): void {
  program
    .command('start')
    .description('Start the React Scanner Studio server')
    .option(
      '-p, --port <number>',
      'Port to run the server on',
      String(DEFAULT_PORT)
    )
    .option(
      '--exact-port',
      'Exit if the specified port is not available',
      false
    )
    .option('--ci', 'Run in CI mode (no interactive prompts)', false)
    .option('--open', 'Open the browser automatically', false)
    .action(async options => {
      checkPeerDependency();

      const requestedPort = parseInt(options.port, 10);

      if (isNaN(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
        logger.errorBox(
          'Invalid Port',
          'Please specify a port between 1 and 65535.'
        );
        process.exit(1);
      }

      // Use detect-port to find an available port
      const availablePort = await getServerPort(requestedPort, {
        exactPort: options.exactPort,
      });

      // If port changed and not in CI mode, prompt user
      if (
        availablePort !== requestedPort &&
        !options.ci &&
        !options.exactPort
      ) {
        const shouldChangePort = await promptForPortChange(
          requestedPort,
          availablePort
        );

        if (!shouldChangePort) {
          logger.info('Exiting.');
          process.exit(1);
        }
      } else if (availablePort !== requestedPort && options.ci) {
        // In CI mode, just log the port change
        logger.warning(
          `Port ${logger.bold(String(requestedPort))} is not available. Using port ${logger.bold(String(availablePort))} instead.`
        );
      }

      try {
        await startServer(availablePort);

        // Open browser if --open flag is set
        if (options.open) {
          const url = `http://localhost:${availablePort}`;
          await openBrowser(url);
        }
      } catch (error) {
        logger.errorBox('Server Error', `Failed to start server: ${error}`);
        process.exit(1);
      }
    });
}
