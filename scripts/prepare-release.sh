#!/bin/bash

# Chrome Extension Release Preparation Script
# This script helps prepare a release for the Chrome Web Store

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "manifest.json" ]; then
    print_error "This script must be run from the root of the Chrome extension project"
    exit 1
fi

print_step "Chrome Extension Release Preparation"
echo "======================================"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_step "Current version: $CURRENT_VERSION"

# Ask for release type
echo ""
echo "Select release type:"
echo "1) Patch (bug fixes)"
echo "2) Minor (new features)"
echo "3) Major (breaking changes)"
echo "4) Custom version"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        RELEASE_TYPE="patch"
        NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."$3+1}')
        ;;
    2)
        RELEASE_TYPE="minor"
        NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2+1".0"}')
        ;;
    3)
        RELEASE_TYPE="major"
        NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1+1".0.0"}')
        ;;
    4)
        read -p "Enter custom version (e.g., 1.2.3): " NEW_VERSION
        RELEASE_TYPE="custom"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_step "New version will be: $NEW_VERSION"

# Confirm with user
read -p "Continue with version $NEW_VERSION? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    print_warning "Release preparation cancelled"
    exit 0
fi

# Update package.json version
print_step "Updating package.json version..."
npm version $NEW_VERSION --no-git-tag-version
print_success "package.json updated"

# Update manifest.json version
print_step "Updating manifest.json version..."
if command -v jq &> /dev/null; then
    # Use jq if available (more reliable)
    jq ".version = \"$NEW_VERSION\"" manifest.json > manifest.tmp && mv manifest.tmp manifest.json
else
    # Fallback to sed
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" manifest.json
    rm -f manifest.json.bak
fi
print_success "manifest.json updated"

# Run linting and type checking
print_step "Running code quality checks..."
if npm run lint --silent > /dev/null 2>&1; then
    print_success "Linting passed"
else
    print_warning "Linting issues found, but continuing..."
fi

if npm run typecheck --silent > /dev/null 2>&1; then
    print_success "Type checking passed"
else
    print_warning "Type checking issues found, but continuing..."
fi

# Build the extension
print_step "Building extension..."
npm run build
if [ -d "build" ] && [ -f "build/manifest.json" ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed or build directory not found"
    exit 1
fi

# Verify build manifest version
BUILD_VERSION=$(node -p "require('./build/manifest.json').version")
if [ "$BUILD_VERSION" != "$NEW_VERSION" ]; then
    print_warning "Build manifest version ($BUILD_VERSION) doesn't match expected version ($NEW_VERSION)"
    print_step "Updating build manifest version..."
    if command -v jq &> /dev/null; then
        jq ".version = \"$NEW_VERSION\"" build/manifest.json > build/manifest.tmp && mv build/manifest.tmp build/manifest.json
    else
        sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" build/manifest.json
        rm -f build/manifest.json.bak
    fi
    print_success "Build manifest updated"
fi

# Create zip file for manual upload (optional)
print_step "Creating extension zip file..."
cd build
zip -r "../qr-gen-extension-v$NEW_VERSION.zip" .
cd ..
print_success "Extension zip created: qr-gen-extension-v$NEW_VERSION.zip"

# Create release notes template
print_step "Creating release notes template..."
cat > "RELEASE_NOTES_v$NEW_VERSION.md" << EOF
# Release Notes v$NEW_VERSION

## What's New

<!-- Add new features here -->
- 

## Improvements

<!-- Add improvements here -->
- 

## Bug Fixes

<!-- Add bug fixes here -->
- 

## Technical Changes

<!-- Add technical changes here -->
- Updated to version $NEW_VERSION

## Installation

### Chrome Web Store
Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)

### Manual Installation
1. Download the extension zip file
2. Extract the files
3. Open Chrome and go to chrome://extensions/
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

## Compatibility

- Chrome 88+
- All major operating systems (Windows, macOS, Linux)

---

**Full Changelog**: https://github.com/YOUR_USERNAME/qr-code-generator/compare/v$CURRENT_VERSION...v$NEW_VERSION
EOF

print_success "Release notes template created: RELEASE_NOTES_v$NEW_VERSION.md"

# Git operations
print_step "Preparing Git commit..."
git add package.json package-lock.json manifest.json

echo ""
print_success "Release preparation completed!"
echo "========================================="
print_step "Next steps:"
echo "1. Review and edit RELEASE_NOTES_v$NEW_VERSION.md"
echo "2. Commit the version changes:"
echo "   git commit -m \"chore: bump version to v$NEW_VERSION\""
echo "3. Create and push a git tag:"
echo "   git tag v$NEW_VERSION"
echo "   git push origin main --tags"
echo "4. Create a GitHub release with the tag to trigger automatic publishing"
echo ""
echo "Or use GitHub Actions workflow dispatch:"
echo "1. Go to Actions tab in GitHub"
echo "2. Select 'Publish Chrome Extension' workflow"
echo "3. Click 'Run workflow' and select '$RELEASE_TYPE' release type"
echo ""
print_warning "Don't forget to update the Chrome Web Store listing description if needed!"

# Check if required secrets are mentioned in documentation
if [ -f "scripts/setup-store-api.md" ]; then
    echo ""
    print_step "Reminder: Ensure GitHub secrets are configured as described in scripts/setup-store-api.md"
fi

print_step "Extension zip file ready for manual upload: qr-gen-extension-v$NEW_VERSION.zip"