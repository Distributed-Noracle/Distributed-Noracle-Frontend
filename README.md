# Frontend

## Usage
### Prerequisites
- Have a recent version of [Node.js](https://nodejs.org/) installed
- Make sure you have access to a running backend, by either:
  - Deploying the [Noracle bundle](https://distributed-noracle.github.io/)
  - Setting up an [own network](https://github.com/Distributed-Noracle/Distributed-Noracle-Backend)
  - Using our [development node](http://steen.informatik.rwth-aachen.de:9082)

### Setup
1. Get the repository and navitage to the root folder
1. Run `npm install`
1. (Optional) If you want to use our remote development backend instead a self-hosted local one, change the hostURL in `./scr/environments/environments.ts` to this: `hostUrls: ['http://steen.informatik.rwth-aachen.de:9082']`
1. `npm run start`

Noracle is now reachable at http://localhost:4200