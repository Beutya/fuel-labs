#!/bin/bash

ROOT=$(cd "$(dirname "$0")/.."; pwd)

FILES=$(find $ROOT/{apps,packages,internal} -name '*.test.ts')
INVALID_FILES=$(grep -LE "@group\s+(node|browser|e2e)" $FILES)

if [ ! -z "$INVALID_FILES" ]; then
  echo "Test files don't contain a test environment configuration:\n"
  echo $INVALID_FILES
  exit 1
fi