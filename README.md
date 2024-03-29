# OpenVolt X National Grid Test Project

## Start the app

To start the development server run `nx serve backend`. Open your browser and navigate to http://localhost:4200/.

## Running locally

To start a project `nx serve frontend`

Start multiple projects `nx run-many -t serve -p frontend backend`

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

Build and run docker container
```
nx docker-build backend 
docker run -p 3000:3000 -t backend
```

Tag and push docker image to private unsecured docker registry
```
docker image tag frontend rayirl/carbonmix-frontend
docker push rayirl/carbonmix-frontend

docker image tag backend rayirl/carbonmix-backend
docker push rayirl/carbonmix-backend
```

## E2E test

Running end to end test `nx run backend-e2e:e2e`

## Explore the Project Graph
Run `nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

## Useful generator command exmaplse
Generate a vue app called frontend `npx g @nx/vue:app frontend`

To add dockerfile to project `nx g setup-docker`




## NEXT STEPS
Add rest of unit testing for unhappy path where dates matched
add test for cached values

Clean up front end
