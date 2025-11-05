## Community Profiles Frontend

Requires [community-profiles-api](https://github.com/dvrpc/community-profiles-api) with postgres db populated by [community-profiles-data-builder](https://github.com/dvrpc/community-profiles-data-builder)

1. Setup required api and database mentioned in repos above
2. Create a .env file from env_sample
   - get a [mapbox access token](https://docs.mapbox.com/help/glossary/access-token/)
   - the revalidate secret needs to match the secret in the api
3. npm i
4. `npm run dev` for local development
5. To build, `npm run build:<NODE ENV>`. There are build configs for local, staging, and production.
6. `npm start`

Note: NextJS only supports development, test, and production out of the box. The development ENV refers to the local setup and staging is for the staging server at cloud.dvprc.org
