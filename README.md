# Cal-Adapt STAC Browser

A customized [STAC Browser](https://github.com/radiantearth/stac-browser) for the [Cal-Adapt STAC API](https://8dawjspn5g.execute-api.us-west-2.amazonaws.com).

**Live:** https://cal-adapt.github.io/caladapt-stac-browser/

Forked from [radiantearth/stac-browser](https://github.com/radiantearth/stac-browser) at v4.0.1.

## Cal-Adapt customizations

- Points to the Cal-Adapt STAC API
- Queryable filters (county, model, scenario, etc.) shown inline below spatial/temporal filters
- Enum-valued queryables render as dropdowns with an "Any" option to clear

## Local development

Requires Node 18.

```bash
npm install
npm start
```

Browse to http://localhost:8080.

## Deployment

Deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy-demo.yml`.
