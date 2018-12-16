const path = require('path');

module.exports = {
    entry: './src/js/index.jsx',
    mode: 'development',
    watch: false,
    // stats: 'verbose',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/env',
                            {
                                'targets': {
                                    'browsers': ['Chrome >=59']
                                },
                                'modules': false,
                                'loose': true
                            }
                        ],
                        [
                            '@babel/preset-react',
                            {
                                'development': true
                            }
                        ]
                    ],
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
