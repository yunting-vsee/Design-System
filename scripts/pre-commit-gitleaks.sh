#!/usr/bin/env bash
# Optional gitleaks scan, invoked from lefthook's `security` pre-commit job.
#
# Kept as a standalone script because lefthook on Windows invokes `run:`
# commands directly (no shell), so shell builtins like `if` and quoting
# don't survive when inlined. Routing through `bash <script>` sidesteps
# that entirely — the script file sees a real shell.
#
# gitleaks itself is optional: if the binary isn't on PATH we print a
# notice and exit 0 so the hook never hard-blocks a commit.

set -eu

if command -v gitleaks >/dev/null 2>&1; then
  exec gitleaks git --staged
fi

echo "⚠ gitleaks not installed — skipping security scan."
echo "  Install with: brew install gitleaks  (or equivalent for your OS)"
exit 0
