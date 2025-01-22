# SPA Example

### Complete Savvy Coders SPA Example with Single Page Application and Express REST API Server

## Setup

Run `npm run install` to install necessary package

## .env File

Create/update the .env file at the root level with the following key/values, update as needed:

```bash
PIZZA_PLACE_API_URL=https://spa-example-api.onrender.com
API_URL=https://spa-example-api.onrender.com
MONGODB=
[^---This MONGODB value above should be changed to be your own mongodb cluster connection string! See the curriculum for more on that!---^]
OPEN_WEATHER_MAP_API_KEY=
[^--- You get this from Open Weather Map (https://openweathermap.org/api)]
NPS_API_KEY=
[^--- You get this from National Park Service (https://www.nps.gov/subjects/developer/get-started.htm)]
```

## Execution

You must start both the SPA and Server using the `npm run serve` and `npm run app:watch` commands in separate terminals.

___

## NPM Script Commands

In the terminal use npm run

`serve`: Start the frontend SPA with hot reload
`app:watch`: Start the backend API with hot reload
`parcel-build`: Package SPA for production deployment


## Deployed for cohort use on Render.com:

SPA URL: https://spa-example.onrender.com
API URL: https://spa-example-api.onrender.com
