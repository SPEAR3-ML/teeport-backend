# Teeport backend service

Teeport is an optimization platform that aims to solve the communication problems between the optimizers and the evaluators in real life. Read more about Teeport [here](https://teeport.ml/intro/) and [here](https://teeport-client-python.readthedocs.io/en/latest/).

To get the big picture of how Teeport works technically, please take a look at [this Teeport tutorial](https://github.com/SPEAR3-ML/teeport-test).

## Prerequisites

- [Node.js](https://nodejs.org/en/) 12+

## Run the service

First clone this repository to your computer:

```bash
git clone https://github.com/SPEAR3-ML/teeport-backend.git
```

In the terminal, go to the root of the project and install the dependences:

```bash
cd teeport-backend
npm install
```

Now create a configuration file named `.env` with the content below:

```bash
NODE_ENV=production
PORT=8080
```

Finally run the following command:

```bash
npm run serve
```

If you see output like below in the terminal, you're all set!

```
================== Teeport Server v0.3.0 ==================
Service starting time : 2020-12-17 11:26:41
Service mode          : production
Service log level     : info
Service port          : 8080
```
