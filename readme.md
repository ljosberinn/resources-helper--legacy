# Resources Helper

your go-to calculator for Resources mobile GPS real-time economy simulation

# IMPORTANT

For the remaining development of Resources Helper 4.0, the submodules are private. Expect this to change once v4.0 has been released.

# Frontend

### Technologies:

- bootstrapped via [create-react-app --typescript](https://github.com/facebook/create-react-app)
- Hooks-only React 16.8
- state management via [storeon](https://github.com/ai/storeon)
- code-splitting via [react-loadable](https://github.com/jamiebuilds/react-loadable)
- Bulma via [rbx](https://github.com/dfee/rbx)
- SCSS
- [Sentry](https://github.com/getsentry/sentry-javascript)

### Editor plugins (VS Code):

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

# Backend

### Technologies:

- typed PHP 7.2 (upgrading once host enables next version)
- MySQL via PDO
- [Sentry](https://packagist.org/packages/sentry/sentry)
- [dotenv](https://github.com/vlucas/phpdotenv)
- [phpstan]()

### Editor plugins (PHPStorm):

- [CodeGlance](https://plugins.jetbrains.com/plugin/7275-codeglance)
- [.env files Support](https://plugins.jetbrains.com/plugin/9525--env-files-support)
- [GitToolbox](https://plugins.jetbrains.com/plugin/7499-gittoolbox)
- [Rainbow Brackets](https://plugins.jetbrains.com/plugin/10080-rainbow-brackets)

# Deployment

- tba

# How to clone this repository

```bash
git clone https://github.com/ljosberinn/resources-helper

cd resources-helper

git submodule init

git submodule update
```

or

```bash
git clone --recursive https://github.com/ljosberinn/resources-helper
```
