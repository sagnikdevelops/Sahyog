# Sahyog Beginner-Friendly Development Guide

## Code Organization Principles
We are CSE freshmen and beginners! This codebase is engineered to be crystal clear, maintainable, and easy to modify:

1. **Centralized Types**: Everything lives in `src/types/index.ts`.
2. **Centralized Constants**: Service categories, pricing, and seed configs live in `src/constants/index.ts`.
3. **Zod Validation**: Input validations live in `src/schemas/index.ts`.
4. **State Management**: Reactive state lives in `src/lib/store/stateContext.tsx`.

## Common Development Tasks

### How to add a new Service Category:
1. Open `src/constants/index.ts`.
2. Add a new object to `SERVICE_CATEGORIES` with `id`, `name`, `nameHi`, `iconName`, etc.
3. Add corresponding services to `SERVICES`.

### How to add a new Language:
1. Open `src/lib/i18n/translations.ts`.
2. Add your language dictionary (e.g. `bn` for Bengali, `mr` for Marathi).
3. Add the language code to `src/lib/i18n/index.tsx`.

### How to run verification tests:
```bash
npm run test
npm run typecheck
npm run build
```