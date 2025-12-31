import { Command } from 'commander';
import { checkPeerDependency } from '../utils/dependencies';

export function startCommand(program: Command): void {
  program
    .command('start')
    .description('Coming soon')
    .action(() => {
      checkPeerDependency();
      console.log('Coming soon...');
    });
}
