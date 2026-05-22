#!/bin/bash
set -e

ROOT="$(pwd)"
DIST_DIR="$ROOT/dist"
ZIP_DIR="$ROOT/zips"

VERSION=$(node -p "require('./package.json').version")

# optional first argument
SUFFIX="$1"

mkdir -p "$ZIP_DIR"

if [ -n "$SUFFIX" ]; then
  ZIP_NAME="extension-$VERSION-$SUFFIX.zip"
else
  ZIP_NAME="extension-$VERSION.zip"
fi


rm -f "$ZIP_DIR/$ZIP_NAME"

# Remove Mac OS hidden files
find "$DIST_DIR" -name ".DS_Store" -delete
find "$DIST_DIR" -type d -name "__MACOSX" -exec rm -rf {} +

cd "$DIST_DIR"

zip -r -D "$ZIP_DIR/$ZIP_NAME" . -x "*.DS_Store"

echo "Created:"
echo "$ZIP_DIR/$ZIP_NAME"