const path = require('path');

module.exports = {
    entry: {
        index: './src/js/index.jsx',
        classes: './src/js/classes.jsx',
        calendar: './src/js/calendar.jsx',
        studioPage: './src/js/studio-page.jsx'
    },
    mode: 'development',
    // mode: 'production',
    watch: false,
    // stats: 'verbose',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: '[name].js'
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
