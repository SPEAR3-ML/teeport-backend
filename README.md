# Teeport backend service

Teeport is an optimization platform that aims to solve the communication problems between the optimizers and the evaluators in real life. Read more about Teeport [here](https://teeport.ml/intro/) and [here](https://teeport-client-python.readthedocs.io/en/latest/).

To get the big picture of how Teeport works technically, please take a look at [this Teeport tutorial](https://github.com/SPEAR3-ML/teeport-test).

To run the service, you can either run it directly (within a Node.js environment, follow the [Run the service directly](#run-the-service-directly) section) or run it in docker (follow the [Run the service in docker](#run-the-service-in-docker) section). You don't have to go through both, just choose one path that fits your needs (I recommend you go with the docker way if docker is available in your case).

## Run the service directly

### Prerequisites

- [Node.js](https://nodejs.org/en/) 12+

### Clone the repo

```bash
git clone https://github.com/SPEAR3-ML/teeport-backend.git
```

### Install the dependence

In the terminal, go to the root of the project and install the dependence:

```bash
cd teeport-backend
npm install
```

### Configure the service and run

Now create a configuration file named `.env` with the content below:

```
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

### Stop the service

Just hit `ctrl + c` in the terminal in which you run the service to terminate it.

Note that for now, once the Teeport backend service is terminated, all data will be lost unless you have exported them. With the exported data file, you can import them again anytime. To read more about data exporting/importing, please refer to [teeport-frontend](https://github.com/SPEAR3-ML/teeport-frontend).

## Run the service in docker

### Prerequisites

- [docker](https://www.docker.com/) 19.03+

### Clone the repo

```bash
git clone https://github.com/SPEAR3-ML/teeport-backend.git
```

### Build the docker image

Go to the project directory:

```bash
cd teeport-backend
```

Create a file named `.env` with the content below:

```
NODE_ENV=production
PORT=8080
```

Now build the docker image:

```bash
docker build -t teeport/backend .
```

### Run the docker image

```bash
docker run -d -p 8080:8080 --name teeport-backend --restart always teeport/backend
```

Now the Teeport backend service should be running at port `8080`. You can verify that by running:

```bash
docker logs -f teeport-backend
```

And the print out should be something like:

```
================== Teeport Server v0.3.0 ==================
Service starting time : 2020-10-22 22:47:06
Service mode          : production
Service log level     : info
Service port          : 8080
```

### Stop the docker image

```bash
docker stop teeport-backend
```

You can restart a stopped docker image anytime by running:

```bash
docker start teeport-backend
```

Note that for now, once the Teeport backend docker image is stopped, all data will be lost unless you have exported them. With the exported data file, you can import them again anytime. To read more about data exporting/importing, please refer to [teeport-frontend](https://github.com/SPEAR3-ML/teeport-frontend).
