# Contributing to MaCosplay

👍🎉 First off, thank you for considering contributing to MaCosplay! 🎉👍

The following is a set of guidelines for contributing to MaCosplay, which is hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the MaCosplay Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project team.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for MaCosplay. Following these guidelines helps maintainers and the community understand your report 📝, reproduce the behavior 💻, and find related reports 🔎.

Before creating bug reports, please check [this list](https://github.com/idea2547/MaCosplay/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible.

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as [GitHub issues](https://github.com/idea2547/MaCosplay/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots or animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **If the problem is related to performance or memory**, include a CPU profile capture with your report.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for MaCosplay, including completely new features and minor improvements to existing functionality.

**How Do I Submit A (Good) Enhancement Suggestion?**

Enhancement suggestions are tracked as [GitHub issues](https://github.com/idea2547/MaCosplay/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots or animated GIFs** which help you demonstrate the steps.
- **Explain why this enhancement would be useful** to most MaCosplay users.
- **Specify which version of MaCosplay you're using.**
- **Specify the name and version of the OS you're using.**

### Pull Requests

The process described here has several goals:

- Maintain MaCosplay's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible MaCosplay
- Enable a sustainable system for MaCosplay's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow the [styleguides](#styleguides)
2. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

We follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/):

- Use the present tense ("add feature" not "added feature")
- Use the imperative mood ("move cursor to..." not "moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable prefix:
  - `feat:` when adding a new feature
  - `fix:` when fixing a bug
  - `docs:` when adding or changing documentation
  - `style:` for changes that do not affect the meaning of the code (formatting, etc)
  - `refactor:` for code changes that neither fix a bug nor add a feature
  - `test:` when adding or changing tests
  - `chore:` for changes to the build process or auxiliary tools

Example:

```
feat: add ability to customize cosplay character profiles

This adds a new form that allows users to customize their character profiles
with detailed information and references.

Resolves: #123
```

### JavaScript/TypeScript Styleguide

- Use 2 spaces for indentation
- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export`s with expressions whenever possible

  ```js
  // Use this:
  export const foo = 'bar';

  // Instead of:
  const foo = 'bar';
  export { foo };
  ```

- Place imports in the following order:
  - External imports (from packages)
  - Internal imports (from other files in the project)
  - Style imports (CSS/SCSS files)
- Use template literals instead of string concatenation

  ```js
  // Use this:
  const message = `Hello ${name}`;

  // Instead of:
  const message = 'Hello ' + name;
  ```

### Svelte Styleguide

- Use 2 spaces for indentation
- Keep components focused on a single responsibility
- Use reactive statements (`$:`) for derived state
- Organize your component in this order:
  - Script
  - Style
  - Template (HTML)
- Prefer slots for composition when possible
- Use named exports for components

### CSS Styleguide

- Use TailwindCSS utility classes when possible
- For custom styles, use CSS modules or component-scoped styles
- Follow the BEM naming convention if creating custom classes

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm

### Setting Up the Development Environment

1. Fork and clone the repository

   ```bash
   git clone https://github.com/yourusername/MaCosplay.git
   cd MaCosplay
   ```

2. Install dependencies

   ```bash
   yarn install
   ```

3. Start the development server

   ```bash
   yarn dev
   ```

4. Make your changes and ensure they meet our styling guidelines

   ```bash
   yarn lint
   ```

5. Run tests to make sure nothing breaks
   ```bash
   yarn test
   ```

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug` - Issues that represent a bug in MaCosplay
- `enhancement` - Issues that represent feature requests
- `documentation` - Issues related to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `wontfix` - This will not be worked on

### Pull Request Labels

We use labels to categorize and manage pull requests effectively. Here are the labels you might encounter:

- **bug**: Indicates that the pull request addresses a bug in the application.
- **enhancement**: Used for pull requests that introduce new features or improvements.
- **documentation**: For changes that involve documentation updates.
- **help wanted**: Indicates that the pull request needs additional attention or review.
- **good first issue**: A label for issues that are suitable for newcomers to the project.
- **wontfix**: Indicates that the issue will not be addressed or fixed.

When creating a pull request, please add relevant labels to help maintainers understand the nature of your changes.

## Contributing with Pull Requests

We welcome your contributions through pull requests! There are two main sections below:

1. General pull request process
2. Specific guidelines for creating effective pull requests

### Pull Request Process

The process described here has several goals:

- Maintain MaCosplay's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible MaCosplay
- Enable a sustainable system for MaCosplay's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow the [styleguides](#styleguides)
2. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing
   - Our CI pipeline runs the following checks:
     - **Linting**: Ensures code follows our style guidelines using ESLint
     - **Tests**: Runs unit tests to verify functionality works as expected
     - **Build Check**: Verifies the project builds successfully

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Pull Request Guidelines

We love your input! Making a great pull request helps us integrate your changes quickly and efficiently. Follow these guidelines to ensure a smooth process:

### 1. Fork and Branch

```bash
# Ensure your fork is up to date with the main repository
git remote add upstream https://github.com/idea2547/MaCosplay.git
git fetch upstream
git checkout main
git merge upstream/main

# Create a descriptive branch name
git checkout -b feature/amazing-feature
# or
git checkout -b fix/issue-123
```

### 2. Keep Changes Focused

- Each PR should address a single concern (feature, bugfix, or enhancement)
- Keep changes small and manageable (under 500 lines of code when possible)
- If you're working on multiple features, create separate branches and PRs

### 3. Follow Code Style

- Match the existing code style and structure
- Run linting before submitting: `yarn lint`
- Add appropriate tests for your changes: `yarn test`

### 4. Write a Meaningful Description

A good PR description includes:

- **What**: Summary of the changes
- **Why**: The problem you're solving
- **How**: Brief explanation of your implementation
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes (if applicable)

Example:

```
feat: add ability to customize cosplay character profiles

This adds a new form that allows users to customize their character profiles
with detailed information and references.

Resolves: #123
```

### 5. Responding to Review Comments

- Be responsive to feedback
- Address all review comments
- If you disagree with a suggestion, explain your reasoning politely
- Make requested changes in the same branch and push updates

### 6. PR Checklist

Before submitting, make sure you can check all these boxes:

- [ ] Code follows project style guidelines
- [ ] Changes are tested
- [ ] Documentation is updated (if necessary)
- [ ] PR description clearly explains changes
- [ ] PR is linked to related issues
- [ ] All CI checks pass

### 7. After Your PR is Merged

- Delete your branch
- Keep your fork synced with the main repository
- Celebrate your contribution! 🎉

---

## Thank You!

Your contributions to open source, large or small, make projects like MaCosplay possible. Thank you for taking the time to contribute.

<p align="center">
  <a href="https://github.com/idea2547/MaCosplay/graphs/contributors"><img src="https://img.shields.io/github/contributors/idea2547/MaCosplay?style=for-the-badge" alt="Contributors"/></a>
  <a href="https://github.com/idea2547/MaCosplay/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22"><img src="https://img.shields.io/github/issues/idea2547/MaCosplay/help%20wanted?style=for-the-badge" alt="Help Wanted Issues"/></a>
</p>
