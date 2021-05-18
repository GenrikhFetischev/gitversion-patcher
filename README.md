# Gitversion patcher

## Description

Simple, lightweight no-dependency tool for patching package.json file with gitversion full semver. Right now it could get only
`FullSemVer` field from `gitversion` output, but feel free to ask for improvements.
If you (just like me) for some reasons don't want or can't to use version settings via `lerna` or `npm version` perhaps
could find that simple package useful.

## Installation

`yarn add gitversion-patcher`

## Usage

This package should be used as a cli utility and could be executed as a `yarn prepack` hook, or
somewhere like this.
The only important things:

- You should have `gitversion` installed
- You should have run that util in a folder which contains `package.json` file
