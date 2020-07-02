import 'isomorphic-fetch';
import 'reflect-metadata';
import * as compression from 'compression';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Request, Response, Application } from 'express';

import './controllers/DepartmentController';
import './controllers/EmployeeController';
import './controllers/OfficeController';
import container from './config/container';
import SwaggerDocumentation from './doc/SwaggerDocument';

dotenv.config();

class App {
  private readonly _port = process.env.PORT || 3000;
  private _app: Application;

  run(): void {
    this._app.listen(this._port, () =>
      console.log(`Server listening on port ${this._port}`),
    );
  }

  build(): Application {
    const server = new InversifyExpressServer(container, null, {
      rootPath: '/v1',
    });

    server.setConfig((app) => {
      app.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerDocumentation));
      app.use(cors());
      app.use(compression());

      app.get('/', (req: Request, res: Response) =>
        res.send('Welcome to Glide API'),
      );
    });

    this._app = server.build();

    return this._app;
  }
}

export default App;
