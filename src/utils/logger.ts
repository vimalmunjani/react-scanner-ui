import pc from 'picocolors';
import boxen, { type Options as BoxenOptions } from 'boxen';
import ora, { type Ora } from 'ora';
import type { Theme } from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';

/**
 * Beautiful logger utility using boxen, picocolors, and ora
 */

// Spinner instance for loading states
let currentSpinner: Ora | null = null;

// Consistent box width for all boxes
const BOX_WIDTH = 60;

// Indentation to align with box border (margin of 1 = 3 spaces)
const INDENT = '   ';

// Default box options for consistency
const defaultBoxOptions: BoxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  width: BOX_WIDTH,
};

// Inquirer theme with proper indentation
export const inquirerTheme: PartialDeep<Theme> = {
  prefix: {
    idle: `${INDENT}${pc.cyan('?')}`,
    done: `${INDENT}${pc.green('✔')}`,
  },
};

/**
 * Display a styled info box
 */
export function infoBox(title: string, content?: string): void {
  const message = content
    ? `${pc.bold(pc.cyan(title))}\n\n${content}`
    : pc.bold(pc.cyan(title));
  console.log(
    boxen(message, {
      ...defaultBoxOptions,
      borderColor: 'cyan',
    })
  );
}

/**
 * Display a styled success box
 */
export function successBox(title: string, content?: string): void {
  const message = content
    ? `${pc.bold(pc.green(title))}\n\n${content}`
    : pc.bold(pc.green(title));
  console.log(
    boxen(message, {
      ...defaultBoxOptions,
      borderColor: 'green',
    })
  );
}

/**
 * Display a styled error box
 */
export function errorBox(title: string, content?: string): void {
  const message = content
    ? `${pc.bold(pc.red(title))}\n\n${content}`
    : pc.bold(pc.red(title));
  console.log(
    boxen(message, {
      ...defaultBoxOptions,
      borderColor: 'red',
    })
  );
}

/**
 * Display a styled warning box
 */
export function warningBox(title: string, content?: string): void {
  const message = content
    ? `${pc.bold(pc.yellow(title))}\n\n${content}`
    : pc.bold(pc.yellow(title));
  console.log(
    boxen(message, {
      ...defaultBoxOptions,
      borderColor: 'yellow',
    })
  );
}

/**
 * Log a success message with a checkmark
 */
export function success(message: string): void {
  console.log(`${INDENT}${pc.green('✔')} ${pc.green(message)}`);
}

/**
 * Log an error message with an X
 */
export function error(message: string): void {
  console.log(`${INDENT}${pc.red('✖')} ${pc.red(message)}`);
}

/**
 * Log a warning message
 */
export function warning(message: string): void {
  console.log(`${INDENT}${pc.yellow('⚠')} ${pc.yellow(message)}`);
}

/**
 * Log an info message
 */
export function info(message: string): void {
  console.log(`${INDENT}${pc.cyan('ℹ')} ${pc.cyan(message)}`);
}

/**
 * Log a step/bullet point
 */
export function step(message: string): void {
  console.log(`${INDENT}  ${pc.dim('➜')} ${message}`);
}

/**
 * Log a highlighted message
 */
export function highlight(message: string): void {
  console.log(`${INDENT}${pc.bold(pc.magenta(message))}`);
}

/**
 * Log a dimmed/subtle message
 */
export function dim(message: string): void {
  console.log(`${INDENT}${pc.dim(message)}`);
}

/**
 * Log a URL or link
 */
export function link(url: string): string {
  return pc.underline(pc.cyan(url));
}

/**
 * Format text as bold
 */
export function bold(text: string): string {
  return pc.bold(text);
}

/**
 * Format text with background highlight (e.g., for "Tip:", "Note:", etc.)
 */
export function bgHighlight(text: string): string {
  return pc.bgYellow(pc.black(pc.bold(` ${text} `)));
}

/**
 * Start a spinner with a message
 */
export function startSpinner(message: string): Ora {
  if (currentSpinner) {
    currentSpinner.stop();
  }
  currentSpinner = ora({
    text: message,
    color: 'cyan',
    indent: 3,
  }).start();
  return currentSpinner;
}

/**
 * Update the spinner text
 */
export function updateSpinner(message: string): void {
  if (currentSpinner) {
    currentSpinner.text = message;
  }
}

/**
 * Stop the spinner with a success message
 */
export function spinnerSuccess(message: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(pc.green(message));
    currentSpinner = null;
  }
}

/**
 * Stop the spinner with an error message
 */
export function spinnerError(message: string): void {
  if (currentSpinner) {
    currentSpinner.fail(pc.red(message));
    currentSpinner = null;
  }
}

/**
 * Stop the spinner with a warning message
 */
export function spinnerWarning(message: string): void {
  if (currentSpinner) {
    currentSpinner.warn(pc.yellow(message));
    currentSpinner = null;
  }
}

/**
 * Stop the spinner with an info message
 */
export function spinnerInfo(message: string): void {
  if (currentSpinner) {
    currentSpinner.info(pc.cyan(message));
    currentSpinner = null;
  }
}

/**
 * Stop the spinner without a message
 */
export function stopSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop();
    currentSpinner = null;
  }
}

/**
 * Display the welcome/banner box for the CLI
 */
export function banner(name: string, version?: string): void {
  const versionText = version ? pc.dim(`v${version}`) : '';
  const title = `${pc.bold(pc.cyan(name))} ${versionText}`;
  console.log(
    boxen(title, {
      ...defaultBoxOptions,
      borderColor: 'cyan',
    })
  );
}

/**
 * Display server running information
 */
export function serverInfo(port: number, features: string[] = []): void {
  const url = `http://localhost:${port}`;
  let content = `${pc.bold('Local:')}   ${link(url)}`;

  if (features.length > 0) {
    content += '\n\n' + features.map(f => `${pc.dim('➜')} ${f}`).join('\n');
  }

  console.log(
    boxen(content, {
      ...defaultBoxOptions,
      borderColor: 'green',
      title: pc.bold(pc.green('🚀 React Scanner UI: Server Running')),
      titleAlignment: 'center',
    })
  );
}

/**
 * Display build complete information
 */
export function buildComplete(
  outputDir: string,
  commands: string[] = []
): void {
  let content = `${pc.bold('Output:')} ${pc.cyan(outputDir)}`;

  if (commands.length > 0) {
    content +=
      '\n\n' +
      pc.dim('Serve with:') +
      '\n' +
      commands.map(c => `  ${pc.cyan(c)}`).join('\n');
  }

  console.log(
    boxen(content, {
      ...defaultBoxOptions,
      borderColor: 'green',
      title: pc.bold(pc.green('✔ Build Complete')),
      titleAlignment: 'center',
    })
  );
}

/**
 * Display an error with details
 */
export function errorWithDetails(title: string, details: string[]): void {
  const content = details.map(d => `${pc.dim('•')} ${d}`).join('\n');
  console.log(
    boxen(`${pc.bold(pc.red(title))}\n\n${content}`, {
      ...defaultBoxOptions,
      borderColor: 'red',
    })
  );
}

/**
 * Display installation instructions
 */
export function installInstructions(packageName: string): void {
  const content = [
    `${pc.bold('npm:')}  npm install ${packageName}`,
    `${pc.bold('yarn:')} yarn add ${packageName}`,
    `${pc.bold('pnpm:')} pnpm add ${packageName}`,
  ].join('\n');

  console.log(
    boxen(content, {
      ...defaultBoxOptions,
      borderColor: 'yellow',
      title: pc.bold(pc.yellow('📦 Install Required')),
      titleAlignment: 'center',
    })
  );
}

// Export picocolors for direct use if needed
export { pc };
