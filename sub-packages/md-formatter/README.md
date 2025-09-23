# @takazudo/md-formatter

AST-based markdown and MDX formatter with Japanese text support. Built on top of the unified ecosystem with remark plugins.

## Features

- **AST-based formatting** - Uses remark's AST for reliable formatting
- **MDX support** - Full support for MDX syntax including JSX components
- **Japanese text formatting** - Special handling for Japanese punctuation and URLs
- **HTML to Markdown conversion** - Converts HTML definition lists to markdown
- **Docusaurus support** - Preserves Docusaurus admonitions (:::note, :::tip, etc.)
- **GFM features** - Tables, strikethrough, task lists
- **Frontmatter preservation** - YAML and TOML frontmatter support
- **CLI and API** - Use as command-line tool or import as library

## Installation

```bash
npm install @takazudo/md-formatter
```

Or use directly with npx:

```bash
npx @takazudo/md-formatter "**/*.md"
```

## Usage

### CLI

```bash
# Check files (exit with error if formatting needed)
md-formatter --check "**/*.{md,mdx}"

# Format files in place
md-formatter --write "**/*.{md,mdx}"

# Preview what would be changed (default)
md-formatter "**/*.{md,mdx}"

# Ignore specific patterns
md-formatter --write "**/*.md" --ignore "node_modules/**,dist/**"
```

### API

```javascript
import { format, formatFile, checkFile } from '@takazudo/md-formatter';

// Format a string
const formatted = await format('# Hello\nWorld');
console.log(formatted); // '# Hello\n\nWorld\n'

// Format a file in place
const changed = await formatFile('./README.md');
console.log(changed ? 'File formatted' : 'No changes needed');

// Check if a file needs formatting
const needsFormatting = await checkFile('./README.md');
console.log(needsFormatting ? 'Needs formatting' : 'Already formatted');
```

### Integration with lint-staged

Add to your `package.json`:

```json
{
"lint-staged": {
"*.{md,mdx}": [
"md-formatter --write"
]
}
}
```

### Integration with Prettier

This formatter can be used alongside Prettier. Configure Prettier to ignore markdown files:

```json
// .prettierignore
*.md
*.mdx
```

Then use this formatter for markdown files:

```json
{
"scripts": {
"format": "prettier --write . && md-formatter --write \"**/*.{md,mdx}\""
}
}
```

## Formatting Rules

### Headings

- ATX-style headings (`#`) are used (not setext)
- Blank line after headings

### Lists

- Unordered lists use `-` as bullet marker
- Ordered lists use `.` as marker
- Minimal indentation (2 spaces)

### Code

- Fenced code blocks with ` ``` `
- Language identifier preserved
- Content inside code blocks is not modified

### Tables

- GFM tables are formatted with aligned columns
- Pipes are padded with spaces

### Japanese Text

- URLs in Japanese parentheses `（）` are converted to markdown links
- Japanese punctuation spacing is preserved
- No extra spaces around `、。！？`

### MDX/JSX

- JSX components are preserved with proper indentation
- Import/export statements are maintained
- Self-closing tags remain self-closing

### HTML Conversion

HTML definition lists are converted to markdown:

```html

- **Term**: Definition

```

Becomes:

```markdown
**Term**
: Definition
```

### Docusaurus Admonitions

Admonition directives are preserved:

```markdown
:::note[Optional Title]
Content
:::
```

## Options

### CLI Options

- `-w, --write` - Write formatted files in place
- `-c, --check` - Check if files need formatting (for CI)
- `--ignore <patterns>` - Comma-separated patterns to ignore

### API Options

```javascript
await format(content, {
mdx: true,        // Force MDX mode (auto-detected by default)
filepath: 'file.mdx'  // Used for better format detection
});
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Format the formatter's own code
npm run format
```

## Testing

The formatter includes comprehensive tests for:

- Basic markdown formatting
- HTML to markdown conversion
- MDX/JSX preservation
- Docusaurus admonitions
- Japanese text handling
- GFM features
- Complex mixed content
- Error handling

Run tests with:

```bash
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please ensure all tests pass and add tests for new features.

## Acknowledgments

Built on top of the excellent unified ecosystem and remark plugins.
