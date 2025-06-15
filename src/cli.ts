#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { Update } from './update';
import { Check } from './check';
import { PackageManagerFactory } from './package-managers/factory';

const program = new Command();

const check = new Check();
const update = new Update();

program
  .name('depguard')
  .description('CLI to check and update project dependencies')
  .version('1.0.0');

program
  .command('check')
  .description('Check for outdated dependencies')
  .option('-i, --interactive', 'Run in interactive mode')
  .option('-o, --output <format>', 'Output format (json, csv)', 'text')
  .action(async (opts: { interactive?: boolean; output?: string }) => {
    const spinner = ora('Checking dependencies...').start();
    try {
      await check.checkUpdates();
      spinner.succeed('Dependencies checked successfully');
    } catch (error) {
      spinner.fail('Failed to check dependencies');
      console.error(error);
    }
  });

program
  .command('update')
  .description('Update dependencies to latest')
  .option('-s, --safe', 'Only update compatible versions')
  .option('-i, --interactive', 'Run in interactive mode')
  .option('-p, --package <name>', 'Update specific package')
  .action(async (opts: { safe?: boolean; interactive?: boolean; package?: string }) => {
    const spinner = ora('Updating dependencies...').start();
    try {
      if (opts.interactive) {
        const packageManager = await PackageManagerFactory.create();
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Update all dependencies', value: 'all' },
              { name: 'Update only compatible versions', value: 'safe' },
              { name: 'Update specific package', value: 'specific' }
            ]
          }
        ]);

        if (action === 'specific') {
          const { packageName } = await inquirer.prompt([
            {
              type: 'input',
              name: 'packageName',
              message: 'Enter package name:'
            }
          ]);
          opts.package = packageName;
        } else if (action === 'safe') {
          opts.safe = true;
        }
      }

      await update.updateDependencies(opts);
      spinner.succeed('Dependencies updated successfully');
    } catch (error) {
      spinner.fail('Failed to update dependencies');
      console.error(error);
    }
  });

program.parse(process.argv);
