# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## What This Is

A Slack app built with Bolt for JavaScript that translates a message when someone reacts to it with a flag emoji, and posts the translation in the thread.

## Slack Plugin

To install the Slack plugin for your coding agent, follow [Claude Code, Codex, Cursor, and Other Coding Agents](./README.md#claude-code-codex-cursor-and-other-coding-agents) in the README.

## Slack Skills

Slack skills are pre-installed in `.agents/skills` (and `.claude/skills` for Claude Code). Use them for Slack work. If the Slack plugin is installed, prefer its `slack:` skills, such as `slack:block-kit`, which may be newer. To update the pre-installed skills, run `npx --yes skills@1 add slackapi/slack-skills-plugin#<tag> --skill '*' --agent universal --agent claude-code --copy --yes` from this folder, with `<tag>` set to the latest release from https://github.com/slackapi/slack-skills-plugin/releases.

## Code Style

- No code comments. Make the code explain itself with clear names, tests, or types. Put the reason for a change in the PR description.
