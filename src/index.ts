#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('react-scanner-ui')
  .description('A CLI application built with Commander.js')
  .version('1.0.0');

program
  .command('info')
  .description('Coming soon')
  .action(() => {
    console.log('Coming soon...');
  });

program
  .command('init')
  .description('Coming soon')
  .action(() => {
    console.log('Coming soon...');
  });

program
  .command('start')
  .description('Coming soon')
  .action(() => {
    console.log('Coming soon...');
  });

program
  .command('build')
  .description('Coming soon')
  .action(() => {
    console.log('Coming soon...');
  });

program.parse();
