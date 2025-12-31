import { Command } from 'commander';

export function infoCommand(program: Command): void {
  program
    .command('info')
    .description('Coming soon')
    .action(() => {
      console.log('Coming soon...');
    });
}
