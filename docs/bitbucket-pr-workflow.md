# Bitbucket PR workflow

How to read, write, create, and merge pull requests on `vp-design-system` (and other VSee repos) from the terminal — without the Bitbucket web UI.

Everything here uses the Bitbucket REST API v2.0 via `curl` + Basic auth. Works the same for `va-main` (Phoenix) — just swap the repo slug.

---

## 1. One-time setup — API token

Atlassian deprecated "app passwords"; use an **API token** instead.

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token with scopes**
3. Pick scopes:
   - Read: `read:repository:bitbucket`, `read:pullrequest:bitbucket`, `read:account:bitbucket`
   - Write: `write:repository:bitbucket`, `write:pullrequest:bitbucket`, `write:pipeline:bitbucket`
4. Copy the token — you only see it once.

Add to `~/.zshrc`:

```bash
export BITBUCKET_EMAIL="your@vsee.com"     # your Atlassian account email
export BITBUCKET_API_TOKEN="ATATT3x..."    # the token from step 4
```

Then `source ~/.zshrc` (or open a new terminal).

> **Gotcha.** If a subshell can't source `~/.zshrc` (nvm + node 14 dyld errors are the usual culprit), extract the vars directly:
> ```bash
> export BITBUCKET_EMAIL=$(grep BITBUCKET_EMAIL ~/.zshrc | grep -o '"[^"]*"' | tr -d '"')
> export BITBUCKET_API_TOKEN=$(grep BITBUCKET_API_TOKEN ~/.zshrc | grep -o '"[^"]*"' | tr -d '"')
> ```

Quick sanity check:

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/user" | jq .display_name
```

If you see your name, auth works. If you see `401`, the email is wrong (use your Atlassian account, not a different VSee email).

### git push over HTTPS with the same token

The REST API uses `email:token` for Basic auth (as above). Git-HTTPS pushes use the **same token** but with a *static literal* username — NOT your email:

```bash
git remote set-url bitbucket \
  "https://x-bitbucket-api-token-auth:${BITBUCKET_API_TOKEN}@bitbucket.org/vsee/vp-design-system.git"
git push bitbucket <branch>
```

The magic string is `x-bitbucket-api-token-auth`. Don't use:
- your email (works for the REST API but not git-HTTPS),
- your Bitbucket username, or
- `x-token-auth` (the legacy App-Password convention Atlassian is retiring 2026-06-09).

If you push via SSH instead (`git@bitbucket.org:...`), ignore this section — the token is only for HTTPS.

---

## 2. The base URL

```
https://api.bitbucket.org/2.0/repositories/vsee/<repo>
```

Design system: `vsee/vp-design-system`
Phoenix:       `vsee/va-main`

Every example below assumes you've exported `$BITBUCKET_EMAIL` and `$BITBUCKET_API_TOKEN`.

---

## 3. List open PRs

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests?state=OPEN" \
  | jq -r '.values[] | "#\(.id)  \(.source.branch.name) → \(.destination.branch.name)  — \(.title)"'
```

Output:

```
#7  feat/card-component → master  — feat(card): add Card primitive
#5  docs/commit-convention → master  — docs(claude): codify scoped conventional-commit convention
```

---

## 4. Read a single PR

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5" \
  | jq '{title, state, source: .source.branch.name, dest: .destination.branch.name, author: .author.display_name, description}'
```

The **description** is the markdown body shown on the PR page. It lives on Bitbucket (not in git), so you edit it via the API, not by pushing commits.

### Read the diff

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5/diff"
```

### Read the commits

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5/commits" \
  | jq -r '.values[] | "\(.hash[0:7])  \(.author.user.display_name // .author.raw)  \(.message | split("\n")[0])"'
```

### Read review comments

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5/comments?pagelen=50" \
  | jq -r '.values[] | "\(.user.display_name): \(.content.raw | split("\n")[0])"'
```

---

## 5. Create a PR

```bash
git push -u origin docs/commit-convention   # push the branch first

curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests" \
  -d '{
    "title": "docs(claude): codify scoped conventional-commit convention",
    "source":      {"branch": {"name": "docs/commit-convention"}},
    "destination": {"branch": {"name": "master"}},
    "close_source_branch": true,
    "description": "## What\n\nAdd a Commit convention section...\n\n## Why\n\n...\n\n## Files\n\n- CLAUDE.md — +33 lines"
  }' \
  | jq '{id, state, url: .links.html.href}'
```

### Multi-line description — HEREDOC

JSON's `"\n"` works but reads awful. Use a heredoc + `jq` to build the body:

```bash
DESC=$(cat <<'EOF'
## What

One-line goal.

## Why

Why this change matters.

## Files

- `path/to/file.ts` — what changed.

## Verification

- [x] lint clean
- [x] tests green
EOF
)

curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests" \
  -d "$(jq -n \
    --arg title "your PR title" \
    --arg desc "$DESC" \
    --arg src "your-branch" \
    --arg dst "master" \
    '{title: $title, description: $desc,
      source: {branch: {name: $src}},
      destination: {branch: {name: $dst}},
      close_source_branch: true}')"
```

### Screenshot inclusion

Raw Bitbucket URLs render inline. After pushing screenshots to the branch:

```markdown
![Before](https://bitbucket.org/vsee/vp-design-system/raw/<branch>/docs/product_shots/<path>.png)
```

Don't use the Bitbucket Downloads section — those URLs won't render inline.

---

## 6. Comment on a PR

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5/comments" \
  -d '{"content": {"raw": "Looks good to me. Shipping."}}'
```

To @mention someone, the body must use `@{accountId}` — NOT `@username`. Look up the account ID from any of their commits:

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/commits/<commit-hash>" \
  | jq .author.user.account_id
```

Then embed as `@{5efc33a8c2967a0bb180e912}` in the comment body.

---

## 7. Update a PR description

The description is editable via `PUT`:

```bash
DESC=$(cat <<'EOF'
## Updated

... new description ...
EOF
)

curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X PUT "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5" \
  -d "$(jq -n --arg d "$DESC" '{description: $d}')"
```

You can also edit `title`, `source`, `destination` through the same PUT.

---

## 8. Merge a PR

```bash
curl -s -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "https://api.bitbucket.org/2.0/repositories/vsee/vp-design-system/pullrequests/5/merge" \
  -d '{
    "merge_strategy": "squash",
    "close_source_branch": true,
    "message": "docs(claude): codify scoped conventional-commit convention (#5)\n\nPin scoped conventional commits as house style ..."
  }' \
  | jq '{state, merge_commit: .merge_commit.hash, error}'
```

**Conventions:**

- **Strategy** — `squash` (recommended, clean history) or `merge_commit` (preserves individual commits). We default to squash.
- **Message first line = commit title.** Put your conventional-commit subject (`fix(tokens): ...`) there, not `Merged in xxx`. This is what shows up in `git log --oneline`.
- **`close_source_branch: true`** — deletes the source branch on remote post-merge. Skip this (set `false`) only for release branches that the deploy pipeline tracks.

---

## 9. Common errors

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Wrong email (the Atlassian account email, not a VSee alias) or expired token | Check `curl /2.0/user` works before anything else |
| `"You can't merge until you resolve all merge conflicts"` | Branch is behind master | `git rebase origin/master`, resolve, `git push --force-with-lease`, retry merge |
| `403 Forbidden` on merge | Token lacks `write:pullrequest` scope | Recreate the token with the scopes listed in §1 |
| Empty `description` after PUT | You sent a nested object `{"description": {"raw": "..."}}` | The PR-update endpoint takes a flat string: `{"description": "..."}` |
| `key already exists` on create | Source branch has an open PR already | Find it with step 3 (list); update instead of create |

---

## 10. Cheat sheet

| Action | Method | Path |
|---|---|---|
| List PRs | `GET` | `/pullrequests?state=OPEN` |
| Read one | `GET` | `/pullrequests/{id}` |
| Diff | `GET` | `/pullrequests/{id}/diff` |
| Commits | `GET` | `/pullrequests/{id}/commits` |
| Comments | `GET` | `/pullrequests/{id}/comments` |
| Create PR | `POST` | `/pullrequests` |
| Update PR | `PUT` | `/pullrequests/{id}` |
| Comment | `POST` | `/pullrequests/{id}/comments` |
| Merge | `POST` | `/pullrequests/{id}/merge` |
| Decline | `POST` | `/pullrequests/{id}/decline` |

All paths prefix with `https://api.bitbucket.org/2.0/repositories/vsee/<repo>`.

---

## Related

- Atlassian docs: https://developer.atlassian.com/cloud/bitbucket/rest/api-group-pullrequests/
- Repo convention: see `CLAUDE.md` → **Commit convention** for the expected commit shape that becomes the merge-commit title.
