#!/usr/bin/env node

import { program } from 'commander';
import { glob } from 'glob';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { formatFile, checkFile } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('md-formatter')
  .description('AST-based markdown and MDX formatter')
  .version('1.0.0')
  .argument('[patterns...]', 'Glob patterns for files to format', ['**/*.{md,mdx}'])
  .option('-w, --write', 'Write formatted files in place')
  .option('-c, --check', 'Check if files need formatting')
  .option(
    '--ignore <patterns>',
    'Comma-separated patterns to ignore',
    '**/node_modules/**,**/dist/**,**/build/**,**/.git/**,**/out/**,**/.next/**,**/coverage/**',
  )
  .option(
    '--ignore-file <path>',
    'Path to ignore file (default: .mdformatignore in current directory)',
    '.mdformatignore',
  )
  .action(async (patterns, options) => {
    try {
      await main(patterns, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();

/**
 * Read ignore patterns from a file
 * @param {string} filePath - Path to the ignore file
 * @returns {Promise<string[]>} Array of ignore patterns
 */
async function readIgnoreFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')); // Skip empty lines and comments
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

/**
 * Main CLI function
 * @param {string[]} patterns - File patterns to process
 * @param {Object} options - CLI options
 */
async function main(patterns, options) {
  // Read ignore patterns from file if it exists
  const ignoreFilePath = path.resolve(process.cwd(), options.ignoreFile);
  let ignorePatterns = [];

  if (existsSync(ignoreFilePath)) {
    const filePatterns = await readIgnoreFile(ignoreFilePath);
    ignorePatterns.push(...filePatterns);
  }

  // Add CLI ignore patterns
  const cliPatterns = options.ignore.split(',').map((p) => p.trim());
  ignorePatterns.push(...cliPatterns);

  // Remove duplicates
  ignorePatterns = [...new Set(ignorePatterns)];

  // Find all matching files
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      ignore: ignorePatterns,
      nodir: true,
    });
    files.push(...matches);
  }

  // Remove duplicates
  const uniqueFiles = [...new Set(files)];

  if (uniqueFiles.length === 0) {
    console.log(chalk.yellow('No files found matching the patterns.'));
    return;
  }

  console.log(chalk.blue(`Processing ${uniqueFiles.length} file(s)...`));

  let changedCount = 0;
  let errorCount = 0;

  for (const file of uniqueFiles) {
    try {
      if (options.write) {
        const changed = await formatFile(file);
        if (changed) {
          changedCount++;
          console.log(chalk.green('✓'), chalk.gray(file), chalk.green('formatted'));
        } else {
          console.log(chalk.gray('○'), chalk.gray(file), chalk.gray('unchanged'));
        }
      } else if (options.check) {
        const needsFormatting = await checkFile(file);
        if (needsFormatting) {
          changedCount++;
          console.log(chalk.yellow('⚠'), chalk.gray(file), chalk.yellow('needs formatting'));
        } else {
          console.log(chalk.green('✓'), chalk.gray(file), chalk.green('formatted correctly'));
        }
      } else {
        // Default: just show what would be done
        const needsFormatting = await checkFile(file);
        if (needsFormatting) {
          changedCount++;
          console.log(chalk.blue('→'), chalk.gray(file), chalk.blue('would be formatted'));
        } else {
          console.log(chalk.gray('○'), chalk.gray(file), chalk.gray('already formatted'));
        }
      }
    } catch (error) {
      errorCount++;
      console.error(chalk.red('✗'), chalk.gray(file), chalk.red(error.message));
    }
  }

  // Summary
  console.log();
  if (options.write) {
    if (changedCount > 0) {
      console.log(chalk.green(`✓ Formatted ${changedCount} file(s)`));
    } else {
      console.log(chalk.gray('All files are already formatted'));
    }
  } else if (options.check) {
    if (changedCount > 0) {
      console.log(chalk.yellow(`⚠ ${changedCount} file(s) need formatting`));
      process.exit(1); // Exit with error code for CI
    } else {
      console.log(chalk.green('✓ All files are formatted correctly'));
    }
  } else {
    if (changedCount > 0) {
      console.log(chalk.blue(`→ ${changedCount} file(s) would be formatted`));
      console.log(chalk.gray('Use --write to apply changes'));
    } else {
      console.log(chalk.gray('All files are already formatted'));
    }
  }

  if (errorCount > 0) {
    console.log(chalk.red(`✗ ${errorCount} error(s) occurred`));
    process.exit(1);
  }
}
