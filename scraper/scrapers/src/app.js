import { ReserveAmerica } from './reserve-america/index';


function main() {
return new ReserveAmerica().work().then(() => {
  console.log('worked')
});
}

main();
// export.handler = function(event, context) {


// }
