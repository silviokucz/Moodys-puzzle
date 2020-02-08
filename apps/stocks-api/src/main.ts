/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';

// TODO: put this in aseparate settings
const token= 'Tpk_8b4ccb4dda554bee954df722a984d520';

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: { 
        cors: true
    } 

  });
  await server.register({ plugin: require('h2o2') });

  server.route({
    method: 'GET',


    path: '/beta/stock/{symbol}/chart/{period}',
    handler: {
        proxy: {
          uri:`https://sandbox.iexapis.com/beta/stock/{symbol}/chart/{period}/?token=${token}`
        }
    },
    options: {
        cache: {
            expiresIn: 60 * 1000 * 5, // 5 minutes
            privacy: 'private'
        }
      }


  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
