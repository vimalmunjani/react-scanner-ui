# GitHub Actions Workflows

This directory contains the automated workflows for the React Scanner Studio project. Each workflow is optimized to run only when relevant files change, improving CI/CD efficiency.

## Workflows Overview

### 📖 Documentation Deployment (`deploy-docs.yml`)

**Triggers:**
- Changes to `docs/**` folder
- Changes to the workflow file itself
- Manual trigger

**Purpose:** Builds and deploys VitePress documentation to GitHub Pages.

**When it runs:**
- ✅ Documentation content changes
- ❌ Source code only changes

### 🏷️ Version & Tag (`version.yml`)

**Triggers:**
- Changes to `src/**` folder
- Changes to `ui/**` folder  
- Changes to `yarn.lock`
- Changes to `package.json`
- Manual trigger

**Purpose:** Automatically bumps version and creates git tags for releases.

**When it runs:**
- ✅ Source code changes
- ✅ UI component changes
- ✅ Dependency changes
- ❌ Documentation only changes

### 📦 NPM Publishing (`publish.yml`)

**Triggers:**
- Successful completion of Version & Tag workflow
- Manual trigger

**Purpose:** Publishes the package to NPM registry with provenance.

**When it runs:**
- ✅ After successful versioning
- ❌ When versioning fails or is skipped

## Workflow Strategy

### Path-Based Triggering

Each workflow uses path filters to ensure it only runs when relevant files change:

- **Docs changes** → Only documentation deployment
- **Code changes** → Version bump + NPM publish
- **Config changes** → Appropriate workflow based on file type

### Manual Override

All workflows support manual triggering via `workflow_dispatch` for cases where:
- You need to force a deployment
- Testing workflow changes
- Emergency releases

### Efficiency Benefits

1. **Faster CI/CD** - No unnecessary builds
2. **Cost effective** - Saves GitHub Actions minutes  
3. **Cleaner history** - Only relevant workflow runs
4. **Reduced noise** - Fewer notifications for irrelevant changes

## Usage Examples

### Documentation Update
```bash
# Only triggers docs deployment
git add docs/guide/new-feature.md
git commit -m "docs: add new feature guide"
git push origin main
```

### Source Code Update
```bash
# Triggers versioning + publishing
git add src/utils/new-feature.ts
git commit -m "feat: add new utility function"
git push origin main
```

### Mixed Changes
```bash
# Triggers both docs and publish workflows
git add src/index.ts docs/api/index.md
git commit -m "feat: add new API and update docs"
git push origin main
```

## Troubleshooting

### Manual Workflow Trigger

If you need to manually run any workflow:

1. Go to Actions tab in GitHub
2. Select the workflow
3. Click "Run workflow"
4. Choose the branch and run

### Workflow Dependencies

- `publish.yml` depends on successful completion of `version.yml`
- If versioning fails, publishing won't happen
- Check workflow logs for specific error details

## Security

- NPM publishing uses OIDC/Trusted Publishing for enhanced security
- No long-lived tokens stored in repository secrets
- Provenance attestation enabled for published packages
