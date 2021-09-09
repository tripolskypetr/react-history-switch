const dts = require('dts-bundle');
const path = require('path');
const fs = require('fs');
 
function abs(subdir) {
    return path.join(__dirname, subdir);
}

dts.bundle({
    name: 'react-history-switch',
    main: 'dist/index.d.ts',
});

fs.copyFileSync(
    abs('dist/react-history-switch.d.ts'),
    abs('example/src/react-history-switch.d.ts'),
);
