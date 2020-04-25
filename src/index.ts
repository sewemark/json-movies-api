import express from 'express';
import { ApiServer } from './ApiServer';
import { initContainer } from './Bootstrap';
import { YamlConfigProvider } from './config/YamlConfigProvider';
import { MoviesController } from './http/MoviesController';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import { Types } from './Types';

(async () => {
    try {
        process.on('unhandledRejection', (reason, p) => {
            console.error(reason, 'Unhandled Rejection at Promise', p);
        });

        process.on('uncaughtException', (err) => {
            console.error(err, 'Uncaught Exception thrown');
            process.exit(1);
        });
        const startupLogger = new Logger();
        const configProvider = new YamlConfigProvider(startupLogger);
        const configName = process.argv.indexOf('--debug') >= 0 ? 'config-dev.yml' : 'config.yml';
        const config = await configProvider.import('.', configName);
        const container = initContainer(config);
        const logger = container.get<ILogger>(Types.Logger);
        const moviesController = container.get<MoviesController>(Types.MoviesController);
        const server = new ApiServer(
            logger,
            config,
            express(),
            moviesController,
        );
        server.start();
    } catch (err) {
        console.log('Error occured ' + err.stack);
    }
})();
